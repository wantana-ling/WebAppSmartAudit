import React, { useEffect, useState } from "react";
import api from "../api";
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
  <div className="rounded-[16px] md:rounded-[20px] lg:rounded-[22px] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-5 min-w-[200px] sm:min-w-[220px] md:min-w-[240px] lg:min-w-[260px] flex-1">
    <div className="flex items-center justify-between mb-1">
      <div className="text-xs md:text-sm text-gray-700">{title}</div>
      {trend !== undefined && <Trend value={trend} />}
    </div>
    <div className="flex items-end gap-2">{children}</div>
  </div>
);

const FrameCard = ({ title, right, children }) => (
  <div className="flex-1 min-w-[280px] sm:min-w-[300px] md:min-w-[320px] lg:min-w-[340px] rounded-[16px] md:rounded-[20px] lg:rounded-[22px] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 p-4 md:p-5 lg:p-6">
    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
      <h3 className="text-lg md:text-xl lg:text-[22px] font-semibold text-black">{title}</h3>
      <div className="text-xs md:text-sm text-gray-600">{right}</div>
    </div>
    {children}
  </div>
);

const Dashboard = () => {
  const [user] = useState({ company: "Smartclick", username: "admin" });
  const [stats, setStats] = useState(null);
  const [userChart, setUserChart] = useState([]);
  const [historyTimeline, setHistoryTimeline] = useState([]);
  const [years, setYears] = useState([]);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const [statsRes, historyRes, chartRes, yearsRes] = await Promise.all([
          api.get('/api/dashboard/stats'),
          api.get('/api/dashboard/history', {
            params: { month, year },
          }),
          api.get('/api/dashboard/users', {
            params: { month, year },
          }),
          api.get('/api/dashboard/years'),
        ]);

        if (cancelled) return;
        setStats(statsRes.data);
        setHistoryTimeline(historyRes.data || []);
        setUserChart(chartRes.data || []);
        setYears(yearsRes.data || []);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [month, year]);

  if (!stats) return <div className="py-20 text-center text-gray-500">Loading dashboard…</div>;

  const accessTrend = stats.accessTrend ?? -1.55;
  const dailyUseTrend = stats.dailyUseTrend ?? 2.12;

  const hours = Math.floor((stats.dailyUse || 0) / 60);
  const minutes = (stats.dailyUse || 0) % 60;

  return (
    <div className="w-full min-h-screen flex items-start justify-center">
      <div className="mt-5 md:mt-8 lg:mt-10 mb-8 md:mb-10 lg:mb-12 w-full max-w-[1200px] rounded-2xl md:rounded-3xl bg-transparent p-4 sm:p-5 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-5 lg:mb-6 flex-wrap gap-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] leading-tight font-semibold text-black tracking-wide">
            WELCOME <span className="font-light">, {user.company}</span>
          </h1>
          <button
            onClick={() => navigate("/profile")}
            className="size-8 sm:size-10 md:size-11 lg:size-12 rounded-full border border-gray-300 overflow-hidden hover:ring-2 hover:ring-[#0DA5D8] transition shrink-0"
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
        <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-6">
          <StatCard title="Access Count" trend={accessTrend}>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold text-black">
              {stats.accessCount ?? 0}
            </div>
            <div className="text-xs md:text-sm text-gray-500 mb-1">Times</div>
          </StatCard>

          <StatCard title="Daily Use" trend={dailyUseTrend}>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold text-black">{hours}</div>
            <div className="text-xs md:text-sm text-gray-500 mb-1">hours</div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold text-black">
              {minutes.toString().padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-gray-500 mb-1">minutes</div>
          </StatCard>

          <div className="rounded-[16px] md:rounded-[20px] lg:rounded-[22px] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 px-4 py-4 md:px-5 md:py-5 lg:px-6 lg:py-5 min-w-[200px] sm:min-w-[220px] md:min-w-[240px] lg:min-w-[260px] flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs md:text-sm text-gray-700">Visitor Active</div>
              <span className="inline-flex items-center gap-2">
                <span
                  className={`size-2 md:size-3 rounded-full ${
                    stats.visitorActive > 0 ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></span>
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <FaUser className="text-xl md:text-2xl text-[#1A2DAC]" />
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold text-black">
                {stats.visitorActive ?? 0}
              </div>
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className="mt-6 md:mt-7 lg:mt-8 flex flex-wrap gap-4 md:gap-5 lg:gap-6">
          <FrameCard
            title="Users"
            right={
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <span className="text-xs md:text-sm text-gray-500 font-medium">
                  {new Date(2000, month - 1, 1).toLocaleString(undefined, { month: "long" })},{" "}
                  {year}
                </span>
                <div className="relative inline-block">
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="bg-white border border-gray-300 rounded-lg md:rounded-xl px-3 py-1.5 md:px-4 md:py-2 pr-8 md:pr-10 text-xs md:text-sm text-gray-700 font-medium focus:ring-2 focus:ring-[#0DA5D8] focus:border-[#0DA5D8] outline-none shadow-sm hover:shadow-md hover:border-gray-400 transition-all duration-200 cursor-pointer appearance-none"
                  >
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthDate = new Date(2000, i, 1);
                    const monthName = monthDate.toLocaleString(undefined, { month: "short" });
                    return (
                      <option key={i + 1} value={i + 1}>
                        {monthName}
                      </option>
                    );
                  })}
                  </select>
                  <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            }
          >
            <div className="h-[240px] sm:h-[280px] md:h-[300px] lg:h-[320px] flex items-center justify-center">
              <UserChart data={userChart} month={month} year={year} />
            </div>
          </FrameCard>

          <FrameCard
            title="History Timeline"
            right={
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-xs md:text-sm text-gray-500 font-medium">Year:</span>
                <div className="relative inline-block">
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="bg-white border border-gray-300 rounded-lg md:rounded-xl px-3 py-1.5 md:px-4 md:py-2 pr-8 md:pr-10 text-xs md:text-sm text-gray-700 font-medium focus:ring-2 focus:ring-[#0DA5D8] focus:border-[#0DA5D8] outline-none shadow-sm hover:shadow-md hover:border-gray-400 transition-all duration-200 cursor-pointer appearance-none"
                  >
                  {years.map((y, idx) => (
                    <option key={idx} value={y}>
                      {y}
                    </option>
                  ))}
                  </select>
                  <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            }
          >
            <div className="h-[240px] sm:h-[280px] md:h-[300px] lg:h-[320px] flex items-center justify-center">
              <HistoryTimeline data={historyTimeline} />
            </div>
          </FrameCard>
        </div>
      </div>

      {/* footer chip */}
      <div className="fixed bottom-0 right-0 bg-[#0B1246] text-white text-xs md:text-sm rounded-tl-[12px] md:rounded-tl-[16px] rounded-tr-[12px] md:rounded-tr-[16px] px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2 shadow-lg mr-2 md:mr-4 lg:mr-5">
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default Dashboard;
