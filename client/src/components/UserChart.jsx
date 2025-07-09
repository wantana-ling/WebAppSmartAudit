import React, { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API?.trim() || 'http://192.168.121.195:3002';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('');
};

const UserChart = ({ month, year }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!month || !year) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/api/users-chart`, {
          params: { month, year },
          withCredentials: true
        });
        setData(response.data || []);
      } catch (error) {
        console.error('❌ Error fetching chart data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year]);

  const totalUsage = data.reduce((sum, entry) => sum + (entry.usage_count || 0), 0);

  const chartData = data.map(entry => ({
    name: entry.name,
    value: totalUsage > 0
      ? parseFloat(((entry.usage_count / totalUsage) * 100).toFixed(2))
      : 0
  }));

  // ✅ สุ่มสีใหม่ทุกครั้งที่ chartData เปลี่ยน
  const COLORS = useMemo(() => {
    return chartData.map(() => getRandomColor());
  }, [chartData]);

  const renderLabel = ({ payload, percent }) => {
    const percentage = (percent * 100).toFixed(2);
    return `${payload.name}: ${percentage}%`;
  };

  if (loading) {
    return <div style={{ textAlign: 'center' }}>Loading...</div>;
  }

  if (!data.length || totalUsage === 0) {
    return (
      <div
        className="user-chart"
        style={{
          width: 300,
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '18px',
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
            fill="#8884d8"
            label={false}
            labelLine={false}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value}%`, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserChart;
