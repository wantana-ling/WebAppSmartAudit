// server/server.js
const express = require('express');
require('dotenv').config();
const mysql = require('mysql2/promise');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const createLoginRouter = require('./routes/login');
const createDashboardRouter = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3002;

// pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4_general_ci'
});

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000','http://127.0.0.1:3000','http://localhost:5173'],
  credentials: true
}));

app.get('/', (_req, res) => res.send('✅ SmartAudit server is running!'));
app.use('/api', createLoginRouter(pool));
app.use('/api', createDashboardRouter(pool));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
