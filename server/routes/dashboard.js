// server/routes/dashboard.js
const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // ✅ Dashboard stats
  router.get('/dashboard-stats', async (_req, res) => {
    const sql = `
      SELECT
        /* จำนวน access ทั้งหมด */
        (SELECT COUNT(*) FROM sessions) AS accessCount,
        /* ผลรวม duration ของวันนี้ (เป็น 0 ถ้า NULL) */
        IFNULL((SELECT SUM(duration) FROM sessions WHERE DATE(login_time) = CURDATE()), 0) AS dailyUse,
        /* จำนวนผู้ใช้ที่ active ตอนนี้ (status='active') */
        (SELECT COUNT(DISTINCT user_id) FROM sessions WHERE status = 'active') AS visitorActive
    `;
    try {
      const [rows] = await db.query(sql);
      res.json(rows[0] || { accessCount: 0, dailyUse: 0, visitorActive: 0 });
    } catch (err) {
      console.error('❌ dashboard-stats error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // ✅ Users Chart (สรุปตามแผนก)
  router.get('/users-chart', async (req, res) => {
    const month = Number.parseInt(req.query.month, 10);
    const year  = Number.parseInt(req.query.year, 10);

    const params = [];
    let sql = `
      SELECT
        COALESCE(d.department_name, 'Admin') AS name,
        COUNT(*) AS usage_count,
        YEAR(s.login_time) AS year
      FROM sessions s
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN department d ON u.department_id = d.id
      WHERE s.login_time IS NOT NULL
    `;

    if (!Number.isNaN(month)) { sql += ' AND MONTH(s.login_time) = ?'; params.push(month); }
    if (!Number.isNaN(year))  { sql += ' AND YEAR(s.login_time) = ?';  params.push(year);  }

    sql += ' GROUP BY name, YEAR(s.login_time)';

    try {
      const [rows] = await db.query(sql, params);
      const total = rows.reduce((acc, r) => acc + (r.usage_count || 0), 0);
      const data = rows.map(r => ({
        name: r.name,
        usage_count: r.usage_count,
        year: r.year,
        value: total > 0 ? Number(((r.usage_count / total) * 100).toFixed(2)) : 0
      }));
      res.json(data);
    } catch (err) {
      console.error('❌ users-chart error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // ✅ Available Years (จาก sessions.login_time)
  router.get('/available-years', async (_req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT DISTINCT YEAR(login_time) AS year
        FROM sessions
        WHERE login_time IS NOT NULL
        ORDER BY year DESC
      `);
      res.json(rows.map(r => r.year).filter(Boolean));
    } catch (err) {
      console.error('❌ available-years error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // ✅ History Timeline (จำนวนเข้าถึงรายเดือนของทั้งระบบ)
  router.get('/history-timeline', async (_req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT
          MONTH(login_time) AS month_num,
          DATE_FORMAT(login_time, '%M') AS month,
          COUNT(*) AS accessCount
        FROM sessions
        WHERE login_time IS NOT NULL
        GROUP BY month_num, month
        ORDER BY month_num
      `);
      res.json(rows);
    } catch (err) {
      console.error('❌ history-timeline error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  return router;
};
