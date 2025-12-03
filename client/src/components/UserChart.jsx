import React, { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import api from '../api';

// พาเลตต์สีที่สวยงามและทันสมัย
const PALETTE = [
  '#1A2DAC', '#0DA5D8', '#4DB1D6', '#3366CC', '#109618',
  '#FF9900', '#DC3912', '#990099', '#3B3EAC', '#0099C6',
  '#DD4477', '#66AA00', '#316395', '#994499', '#22AA99',
  '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#651067',
];

// map สีแบบคงที่ตามชื่อ
const colorFor = (name) => {
  const s = String(name ?? '');
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
};

// Custom Tooltip ที่สวยงาม
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3">
        <p className="font-semibold text-gray-800 mb-1">{data.name}</p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-[#1A2DAC]">{data.value}%</span> of total
        </p>
      </div>
    );
  }
  return null;
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

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#1A2DAC] border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!chartData.length) {
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
        <PieChart>
          <defs>
            {chartData.map((d, i) => (
              <linearGradient key={`gradient-${i}`} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorFor(d.name)} stopOpacity={1} />
                <stop offset="100%" stopColor={colorFor(d.name)} stopOpacity={0.7} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius="70%"
            innerRadius="40%"
            paddingAngle={2}
            label={({ name, value }) => `${name}: ${value}%`}
            labelLine={false}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {chartData.map((d, i) => (
              <Cell
                key={`cell-${i}`}
                fill={`url(#gradient-${i})`}
                stroke="#fff"
                strokeWidth={2}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontSize: '12px',
              paddingTop: '10px',
            }}
            formatter={(value) => (
              <span style={{ color: '#4B5563', fontSize: '12px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserChart;
