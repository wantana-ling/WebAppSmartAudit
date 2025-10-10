import React, { useEffect, useState } from "react";
import axios from "axios";
import UserChart from "../components/UserChart";
import HistoryTimeline from "../components/HistoryTimeline";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Trend = ({ value }) => {
  const isUp = Number(value) >= 0;
  return (
    <div className={`text-xs font-medium ${isUp ? "text-green-600" : "text-red-500"}`}>
      {isUp ? "↑" : "↓"} {Math.abs(Number(value)).toFixed(2)}%
    </div>
  );
};

const StatCard = ({ title, children, trend }) => (
  <div className="rounded-[22px] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 px-6 py-5 min-w-[260px]">
    <div className="flex items-center justify-between mb-1">
      <div className="text-sm text-gray-700">{title}</div>
      {trend !== undefined && <Trend value={trend} />}
    </div>
    <div className="flex items-end gap-2">
      {children}
    </div>
  </div>
);

const FrameCard = ({ title, right, children }) => (
  <div className="flex-1 min-w-[340px] rounded-[22px] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 p-6">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[22px] font-semibold text-black">{title}</h3>
      <div className="text-sm text-gray-600">{right}</div>
    </div>
    {children}
  </div>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [userChart, setUserChart] = useState([]);
  const [historyTimeline, setHistoryTimeline] = useState([]);
  const [years, setYears] = useState([]);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const navigate = useNavigate();

  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:3002";

  useEffect(() => {
    axios.get(`${apiBase}/api/me`, { withCredentials: true })
      .then(r => setUser(r.data))
      .catch(e => { if (e.response?.status === 401) navigate("/login"); });

    axios.get(`${apiBase}/api/dashboard-stats`, { withCredentials: true })
      .then(r => setStats(r.data));

    axios.get(`${apiBase}/api/history-timeline?month=${month}&year=${year}`, { withCredentials: true })
      .then(r => setHistoryTimeline(r.data));

    axios.get(`${apiBase}/api/users-chart?month=${month}&year=${year}`, { withCredentials: true })
      .then(r => setUserChart(r.data));

    axios.get(`${apiBase}/api/available-years`, { withCredentials: true })
      .then(r => setYears(r.data));
  }, [month, year]); // keeps your original behavior

  if (!user || !stats) return <div className="py-20 text-center text-gray-500">Loading dashboard…</div>;

  // ตัวอย่าง trend mock หาก API ยังไม่มีค่า %
  const accessTrend = stats.accessTrend ?? -1.55;
  const dailyUseTrend = stats.dailyUseTrend ?? 2.12;

  return (
    <div className="w-[80vw] min-h-screen flex items-start justify-center">
      {/* กรอบขาวมีขอบฟ้าอ่อนรอบพื้นที่ dashboard ให้ความรู้สึกเหมือน mock */}
      <div className="mt-10 mb-12 w-[90%] max-w-[1200px] rounded-3xl bg-transparent p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[44px] leading-tight font-semibold text-black tracking-wide">
            WELCOME <span className="font-light">, {user.company}</span>
          </h1>
          <button
            onClick={() => navigate("/profile")}
            className="size-12 rounded-full border border-gray-300 overflow-hidden hover:ring-2 hover:ring-[#0DA5D8] transition"
            aria-label="Profile"
          >
            <img
              src={process.env.PUBLIC_URL + "/img/default-profile.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        {/* Top stats */}
        <div className="flex flex-wrap gap-6">
          <StatCard title="Access Count" trend={accessTrend}>
            <div className="text-[40px] font-semibold text-black">{stats.accessCount ?? 0}</div>
            <div className="text-gray-500 mb-1">Times</div>
          </StatCard>

          <StatCard title="Daily Use" trend={dailyUseTrend}>
            <div className="text-[40px] font-semibold text-black">
              {Math.floor(stats.dailyUse / 60) || 0}
            </div>
            <div className="text-gray-500 mb-1">hours</div>
            <div className="text-[40px] font-semibold text-black">
              {stats.dailyUse % 60 || 0}
            </div>
            <div className="text-gray-500 mb-1">minutes</div>
          </StatCard>

          <div className="rounded-[22px] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 px-6 py-5 min-w-[260px]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-700">Visitor Active</div>
              <span className="inline-flex items-center gap-2">
                <span className={`size-3 rounded-full ${stats.visitorActive > 0 ? "bg-green-500" : "bg-gray-300"}`}></span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FaUser className="text-2xl text-[#1A2DAC]" />
              <div className="text-[40px] font-semibold text-black">{stats.visitorActive}</div>
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className="mt-8 flex flex-wrap gap-6">
          <FrameCard
            title="Users"
            right={
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{
                  new Date(2000, month - 1, 1).toLocaleString(undefined,{ month: "long" })
                } , {year}</span>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#0DA5D8] outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            }
          >
            <div className="h-[320px] flex items-center justify-center">
              <UserChart data={userChart} month={month} year={year} />
            </div>
          </FrameCard>

          <FrameCard
            title="History Timeline"
            right={
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{year}</span>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#0DA5D8] outline-none"
                >
                  {years.map((y, idx) => (
                    <option key={idx} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            }
          >
            <div className="h-[320px] flex items-center justify-center">
              <HistoryTimeline data={historyTimeline} />
            </div>
          </FrameCard>
        </div>
      </div>

      {/* footer chip */}
      <div className="fixed bottom-0 right-0 bg-[#0B1246] text-white text-sm rounded-tl-[16px] rounded-tr-[16px] px-5 py-2 shadow-lg mr-5">
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default Dashboard;
