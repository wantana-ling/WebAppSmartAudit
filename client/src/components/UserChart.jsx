import React, { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api';

// พาเลตต์สีคงที่
const PALETTE = [
  '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
  '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E',
  '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC',
  '#E67300', '#8B0707', '#651067', '#329262', '#5574A6',
];

// map สีแบบคงที่ตามชื่อ
const colorFor = (name) => {
  const s = String(name ?? '');
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
};

const UserChart = ({ month, year }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูลจาก /api/dashboard/users
  useEffect(() => {
    if (!month || !year) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/dashboard/users', { params: { month, year } });
        if (!cancelled) setRows(res.data || []);
      } catch (e) {
        console.error('❌ Error fetching chart data:', e?.message || e);
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [month, year]);

  // รองรับทั้งสองสคีมา:
  // 1) [{ name, usage_count }]
  // 2) [{ day, count }]
  const normalized = useMemo(() => {
    return (rows || []).map((r) => ({
      name: r.name ?? r.day ?? r.user ?? 'Unknown',
      usage_count: Number(r.usage_count ?? r.count ?? r.total ?? 0),
    }));
  }, [rows]);

  const total = normalized.reduce((s, x) => s + (x.usage_count || 0), 0);

  const chartData = useMemo(() => {
    if (total <= 0) return [];
    return normalized.map((x) => ({
      name: x.name,
      value: Number(((x.usage_count / total) * 100).toFixed(2)),
    }));
  }, [normalized, total]);

  if (loading) return <div style={{ textAlign: 'center' }}>Loading...</div>;

  if (!chartData.length) {
    return (
      <div
        className="user-chart"
        style={{
          width: 300, height: 300, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: '#999', fontSize: 18
        }}
      >
        No data found
      </div>
    );
  }

  return (
    <div className="user-chart" style={{ width: 300, height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={false}
            labelLine={false}
          >
            {chartData.map((d, i) => (
              <Cell key={i} fill={colorFor(d.name)} />
            ))}
          </Pie>
          <Tooltip formatter={(v, n) => [`${v}%`, n]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserChart;
