import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

const COLORS = ['#1A2DAC', '#4DB1D6'];
const API_BASE = process.env.REACT_APP_API?.trim() || 'http://192.168.121.195:3002';

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

  const renderLabel = ({ payload, percent }) => {
    const percentage = (percent * 100).toFixed(2);
    return `${payload.name}: ${percentage}%`;
  };

  if (loading) {
    return <div style={{ textAlign: 'center' }}>Loading...</div>;
  }

  if (!data.length || totalUsage === 0) {
    return (
      <div style={{ textAlign: 'center', fontSize: '18px', color: '#999' }}>
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
            label={renderLabel}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserChart;
