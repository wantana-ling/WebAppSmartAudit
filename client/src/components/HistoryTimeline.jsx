import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

// Custom tooltip สำหรับแสดงรายละเอียด session
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        style={{
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: '6px 10px',
          fontSize: 13,
        }}
      >
        <div><strong>Date:</strong> {label}</div>
        <div><strong>User:</strong> {d.user || '-'}</div>
        <div><strong>Sessions:</strong> {d.accessCount ?? d.count ?? 0}</div>
        <div><strong>Duration:</strong> {d.duration ?? '-'} min</div>
      </div>
    );
  }
  return null;
};

const HistoryTimeline = ({ data = [] }) => {
  // normalize ชื่อคีย์ให้อยู่ในรูปเดียว เช่น [{ date, count }]
  const formatted = useMemo(() => {
    return data.map((d) => ({
      date: d.date || d.day || d.month || 'Unknown',
      accessCount: Number(d.accessCount ?? d.count ?? 0),
      user: d.user ?? '',
      duration: d.duration ?? null,
    }));
  }, [data]);

  if (!formatted.length) {
    return (
      <div
        style={{
          width: 400,
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: 18,
        }}
      >
        No data found
      </div>
    );
  }

  return (
    <div className="history-timeline" style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-25}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            allowDecimals={false}
            label={{
              value: 'Sessions',
              angle: -90,
              position: 'insideLeft',
              fontSize: 12,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="accessCount"
            stroke="#1A2DAC"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryTimeline;
