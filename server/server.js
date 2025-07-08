require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const upload = multer({ dest: 'temp/' });

const app = express();

app.use(express.json());

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions ={
    origin: ['http://localhost:3000',' http://192.168.121.195:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'user-role'],
    credentials:true,   
};

app.use(cors(corsOptions));


console.log("JWT Secret:", process.env.JWT_SECRET);

// เชื่อมต่อ MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
    console.log('Connected to the database!');
});



app.post('/login', (req, res) => {
    const { user_id, password } = req.body;

    const query = 'SELECT * FROM users WHERE user_id = ?';

    
    db.execute(query, [user_id], (err, results) => {
        if (err) {
            console.error("Database error: ", err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid user_id or password' });
        }

        const user = results[0];

        if (user.status !== 'active') {
            return res.status(400).json({ error: 'User is not active' });
        }

        if (user.role !== 'admin' && user.role !== 'manager') {
            return res.status(400).json({ error: 'User has no access rights' });
        }

        if (password !== user.password_hash) {
            return res.status(400).json({ error: 'Invalid user_id or password' });
        }
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // ส่ง Response กลับเมื่อ Login สำเร็จ
        return res.json({
            token,
            user: {
                user_id: user.user_id,
                firstname: user.firstname,
                lastname: user.lastname,
                password: user.password_hash,
                role: user.role
            }
        });
        
    });
});

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';

    db.execute(query, (err, results) => {
        if (err) {
            console.error("Database error: ", err);
            return res.status(500).json({ error: 'Database error' });
        }

        // กรองตาม role ผู้เรียกดู
        const requestingUser = req.headers['user-role'];
        const filtered = requestingUser === 'manager'
            ? results.filter(u => u.role !== 'manager')
            : results.filter(u => u.role !== 'admin' && u.role !== 'manager');


        return res.json(filtered);
    });
});


app.post('/api/users', upload.single('image'), async (req, res) => {
    const { user_id, firstname, lastname, password, role } = req.body;
  
    try {
      // แปลงเป็น PNG แล้วเก็บไว้ตามชื่อ user_id
      const outputPath = `./uploads/images/user_profile/${user_id}.png`;
  
      await sharp(req.file.path)
        .resize(300) // ย่อขนาดถ้าต้องการ
        .png()
        .toFile(outputPath);
  
      // ลบไฟล์ต้นฉบับ (temp)
      fs.unlinkSync(req.file.path);
  
      // เพิ่มผู้ใช้ในฐานข้อมูล
      const insertQuery = `
        INSERT INTO users (user_id, firstname, lastname, password_hash, role, status)
        VALUES (?, ?, ?, ?, ?, 'active')
      `;
  
      db.query(insertQuery, [user_id, firstname, lastname, password, role], (err) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).json({ error: 'Insert failed' });
        }
  
        res.json({ success: true });
      });
  
    } catch (err) {
      console.error("Image processing error:", err);
      res.status(500).json({ error: "Image upload failed" });
    }
  });
  
  
  


app.get('/sessions', (req, res) => {
    const query = `
        SELECT 
            sessions.*,
            users.firstname,
            users.lastname
        FROM 
            sessions
        JOIN 
            users ON sessions.user_id = users.user_id;
    `;

    db.execute(query, (err, results) => {
        if (err) {
            console.error("Database error: ", err);
            return res.status(500).json({ error: 'Database error' });
        }

        return res.json(results);
    });
});

app.get('/api/dashboard-stats', (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM sessions) AS accessCount,
            (SELECT SUM(duration) FROM sessions WHERE DATE(login_time) = CURDATE()) AS dailyUse,
            (SELECT COUNT(DISTINCT user_id) FROM sessions WHERE status = 'active') AS visitorActive
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
});


app.get('/api/users-chart', (req, res) => {
    const { month, year } = req.query;
    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);

    let query = `
        SELECT 
            users.role AS name,
            COUNT(*) as usage_count,
            YEAR(login_time) AS year
        FROM sessions
        JOIN users ON sessions.user_id = users.user_id
        WHERE users.role != 'admin'
    `;

    const params = [];

    if (!isNaN(parsedMonth)) {
        query += ` AND MONTH(login_time) = ?`;
        params.push(parsedMonth);
    }

    if (!isNaN(parsedYear)) {
        query += ` AND YEAR(login_time) = ?`;
        params.push(parsedYear);
    }

    query += ` GROUP BY users.role, YEAR(login_time)`;

    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Error fetching user chart data: ", err);
            return res.status(500).json({ error: 'Database error' });
        }

        const totalUsage = results.reduce((sum, entry) => sum + entry.usage_count, 0);
        const chartData = results.map(entry => ({
            name: entry.name,
            usage_count: entry.usage_count,
            year: entry.year,
            value: parseFloat(((entry.usage_count / totalUsage) * 100).toFixed(2))
        }));

        res.json(chartData);
    });
});

app.get('/api/available-years', (req, res) => {
    const query = `
        SELECT DISTINCT YEAR(login_time) AS year
        FROM sessions
        ORDER BY year DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching available years:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const years = results.map(row => row.year);
        res.json(years);
    });
});







app.get('/api/history-timeline', (req, res) => {
    const query = `
        SELECT 
            DATE_FORMAT(login_time, '%M') as month,
            COUNT(*) as accessCount
        FROM sessions
        GROUP BY month;
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});


app.post('/api/change-password', (req, res) => {
    const { user_id, oldPassword, newPassword } = req.body;
  
    const query = 'SELECT password_hash FROM users WHERE user_id = ?';
  
    db.query(query, [user_id], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "Database error" });
  
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const user = results[0];
  
      // เช็ค password แบบ plain-text 
      if (user.password_hash !== oldPassword) {
        return res.status(401).json({ success: false, message: "รหัสผ่านเดิมไม่ถูกต้อง" });
      }
  
      // Update password ใหม่
      const updateQuery = 'UPDATE users SET password_hash = ? WHERE user_id = ?';
      db.query(updateQuery, [newPassword, user_id], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Failed to update password" });
        return res.json({ success: true });
      });
    });
  });




  app.post('/api/verify-admin-and-toggle-status', (req, res) => {
    const { admin_id, admin_password, target_user_id, new_status } = req.body;
  
    console.log("REQ BODY:", req.body);
  
    const query = 'SELECT password_hash FROM users WHERE user_id = ? AND role = "admin"';
  
    db.query(query, [admin_id], (err, results) => {
      if (err) {
        console.error("DB SELECT error:", err);
        return res.status(500).json({ success: false, message: "DB error" });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: "Admin not found" });
      }
  
      const isPasswordCorrect = results[0].password_hash === admin_password;
      if (!isPasswordCorrect) {
        return res.status(403).json({ success: false, message: "รหัสผ่านแอดมินไม่ถูกต้อง" });
      }
  
      const updateQuery = 'UPDATE users SET status = ? WHERE user_id = ?';
      db.query(updateQuery, [new_status, target_user_id], (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Update error" });
        }
        return res.json({ success: true });
      });
    });
  });


  app.put('/api/users/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, role } = req.body;
  
    const updateQuery = 'UPDATE users SET firstname = ?, lastname = ?, role = ? WHERE user_id = ?';
  
    try {
      // อัปเดตข้อมูลพื้นฐานก่อน
      await db.promise().query(updateQuery, [firstname, lastname, role, id]);
  
      // ถ้ามีการอัปโหลดรูป
      if (req.file) {
        const outputPath = `./uploads/images/user_profile/${id}.png`;
  
        await sharp(req.file.path)
          .resize(300)
          .png()
          .toFile(outputPath);
  
        fs.unlinkSync(req.file.path); // ลบ temp
      }
  
      res.json({ success: true });
    } catch (err) {
      console.error("Update user error:", err);
      res.status(500).json({ success: false });
    }
  });

  app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM users WHERE user_id = ?';
  
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: "Failed to delete user" });
      }
  
      res.json({ success: true });
    });
  });

  
  
  
  
  
  
  
  




app.listen(3000, () => console.log('Server running on port 3000'));