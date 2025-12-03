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

// Custom tooltip สำหรับแสดงรายละเอียด session ที่สวยงาม
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[160px]">
        <p className="font-semibold text-gray-800 mb-2 text-sm border-b border-gray-100 pb-2">
          {label}
        </p>
        <div className="space-y-1 text-xs">
          {d.user && (
            <div className="flex justify-between">
              <span className="text-gray-600">User:</span>
              <span className="font-medium text-gray-800">{d.user}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Sessions:</span>
            <span className="font-semibold text-[#1A2DAC]">{d.accessCount ?? d.count ?? 0}</span>
          </div>
          {d.duration && (
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-gray-800">{d.duration} min</span>
            </div>
          )}
        </div>
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
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-24 h-24 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-gray-400 text-sm font-medium">No data available</p>
          <p className="text-gray-300 text-xs mt-1">Chart will appear when data is available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formatted}
          margin={{ top: 5, right: 20, left: 10, bottom: 40 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1A2DAC" stopOpacity={1} />
              <stop offset="50%" stopColor="#0DA5D8" stopOpacity={1} />
              <stop offset="100%" stopColor="#4DB1D6" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            vertical={false}
            opacity={0.5}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#6B7280' }}
            angle={-25}
            textAnchor="end"
            height={60}
            stroke="#9CA3AF"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6B7280' }}
            allowDecimals={false}
            stroke="#9CA3AF"
            label={{
              value: 'Sessions',
              angle: -90,
              position: 'insideLeft',
              fontSize: 11,
              fill: '#6B7280',
              style: { textAnchor: 'middle' },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="accessCount"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={{
              fill: '#1A2DAC',
              strokeWidth: 2,
              stroke: '#fff',
              r: 4,
            }}
            activeDot={{
              r: 6,
              fill: '#0DA5D8',
              stroke: '#fff',
              strokeWidth: 2,
            }}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryTimeline;
