import React, { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api'; 

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('');
};

const UserChart = ({ month, year }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!month || !year) return;

    (async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/users-chart', { params: { month, year } });
        setData(res.data || []);
      } catch (e) {
        console.error('❌ Error fetching chart data:', e?.message || e);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [month, year]);

  const totalUsage = data.reduce((sum, x) => sum + (x.usage_count || 0), 0);

  const chartData = data.map(x => ({
    name: x.name,
    value: totalUsage > 0 ? Number(((x.usage_count / totalUsage) * 100).toFixed(2)) : 0,
  }));

  const COLORS = useMemo(() => chartData.map(() => getRandomColor()), [chartData]);

  if (loading) return <div style={{ textAlign: 'center' }}>Loading...</div>;

  if (!data.length || totalUsage === 0) {
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
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip formatter={(v, n) => [`${v}%`, n]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserChart;
