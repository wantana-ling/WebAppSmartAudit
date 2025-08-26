const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (pool) => {
  const router = express.Router();

  router.post('/login', async (req, res) => {
    try {
      const { user_id, password } = req.body || {};
      if (!user_id || !password) {
        return res.status(400).json({ error: 'Missing user_id or password' });
      }
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: 'JWT_SECRET missing' });
      }

      const [rows] = await pool.query(
        `SELECT user_id, company, password
         FROM admin
         WHERE user_id = ?
         LIMIT 1`,
        [user_id]
      );
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const admin = rows[0];

      let ok = false;
      try {
        ok = await bcrypt.compare(password, admin.password);
      } catch { ok = false; }

      if (!ok) ok = password === admin.password;

      if (!ok) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { user_id: admin.user_id, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.json({
        success: true,
        message: 'Login successful',
        admin_info: {
          user_id: admin.user_id,
          company: admin.company ?? null
        },
        token
      });
    } catch (err) {
      console.error('POST /api/login error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  });

  return router;
};
