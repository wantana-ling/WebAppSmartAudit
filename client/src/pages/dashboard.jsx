import React, { useEffect, useState } from "react";
import axios from 'axios';
import UserChart from '../components/UserChart';
import HistoryTimeline from '../components/HistoryTimeline';
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
    // ✅ ดึงข้อมูล admin จาก session (ไม่ใช้ JWT)
    axios.get(`${apiBase}/api/me`, { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(error => {
        console.error("❌ Failed to fetch admin info:", error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      });

    axios.get(`${apiBase}/api/dashboard-stats`, { withCredentials: true })
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));

    axios.get(`${apiBase}/api/history-timeline?month=${month}&year=${year}`, { withCredentials: true })
      .then(response => setHistoryTimeline(response.data))
      .catch(error => console.error('Error fetching history timeline data:', error));

    axios.get(`${apiBase}/api/users-chart?month=${month}&year=${year}`, { withCredentials: true })
      .then(response => setUserChart(response.data))
      .catch(error => console.error('Error fetching user chart data:', error));

    axios.get(`${apiBase}/api/available-years`, { withCredentials: true })
      .then(res => {
        setYears(res.data);
        if (!year && res.data.length > 0) {
          setYear(res.data[0]);
        }
      })
      .catch(err => console.error("Error loading available years:", err));
  }, [month, year]);

  if (!user || !stats || !Array.isArray(userChart)) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="w-[80vw] h-screen flex items-center justify-center">
      <div className="flex flex-col gap-5 w-[90%] mx-[10px] overflow-y-auto overflow-x-hidden z-[1] min-h-[80%]">
        {/* header */}
        <div className="w-full flex flex-row justify-around text-[#0B1246]">
          <h1 className="text-[45px] font-medium">
            WELCOME
            <span className="text-[40px] font-light"> , {user.company}</span>
          </h1>

          <div className="flex items-center justify-center" onClick={() => navigate('/profile')}>
            <button className="w-[50px] h-[50px] rounded-[30px] border border-[#D7D7D7] cursor-pointer overflow-hidden">
              <img
                src={process.env.PUBLIC_URL + "/img/default-profile.jpg"}
                alt="Profile"
                className="w-full h-full rounded-[30px] object-cover"
              />
            </button>
          </div>
        </div>

        {/* content */}
        <div className="flex flex-col gap-5">
          {/* row 1 cards */}
          <div className="flex flex-row flex-wrap gap-[30px] px-[10px] w-full">
            <div className="p-[10px] px-[30px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)] rounded-[20px] flex flex-col justify-start gap-5">
              <h3 className="font-medium mr-5 text-[18px] text-[#0B1246]">Access Count</h3>
              <h1 className="text-center font-normal text-[40px] text-[#0B1246]">
                {stats.accessCount} <span className="font-light text-[20px] mx-[5px]">Times</span>
              </h1>
            </div>

            <div className="p-[10px] px-[30px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)] rounded-[20px] flex flex-col justify-start gap-5">
              <h3 className="font-medium mr-5 text-[18px] text-[#0B1246]">Daily Use</h3>
              <h1 className="text-center font-normal text-[40px] text-[#0B1246]">
                {stats.dailyUse ? (
                  <>
                    {Math.floor(stats.dailyUse / 60)} <span className="font-light text-[20px] mx-[5px]">Hours</span>{" "}
                    {stats.dailyUse % 60} <span className="font-light text-[20px] mx-[5px]">Minutes</span>
                  </>
                ) : (
                  <>
                    0 <span className="font-light text-[20px] mx-[5px]">Hours</span> 0{" "}
                    <span className="font-light text-[20px] mx-[5px]">Minutes</span>
                  </>
                )}
              </h1>
            </div>

            <div className="p-[10px] px-[30px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)] rounded-[20px] flex flex-col justify-start gap-5">
              <div className="flex flex-row justify-between mb-[10px]">
                <h3 className="font-medium mr-10 text-[18px] text-[#0B1246]">Visitor Active</h3>
                <div
                  className={[
                    "w-3 h-3 rounded-full m-[5px]",
                    stats.visitorActive > 0
                      ? "bg-[#36D277] ring-2 ring-[#36D277]/40 animate-pulse"
                      : "bg-[#c3c3c3] ring-2 ring-gray-300/40",
                  ].join(" ")}
                />
              </div>

              <div className="flex justify-evenly items-center">
                <span className="text-[1.6rem] text-[#1A2DAC]"><FaUser /></span>
                <h1 className="text-center font-normal text-[40px] text-[#0B1246]">{stats.visitorActive}</h1>
              </div>
            </div>
          </div>

          {/* row 2 cards (charts) */}
          <div className="flex flex-row flex-wrap gap-[30px] px-[10px] w-full">
            <div className="p-[10px] px-[30px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)] rounded-[20px] flex flex-col justify-start gap-5">
              <div className="flex flex-row justify-between items-center flex-wrap min-w-[300px]">
                <h3 className="font-medium mr-10 text-[18px] text-[#0B1246]">User</h3>
                <div className="text-right flex items-center gap-2">
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>

                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Year</option>
                    {years.map((y, idx) => (
                      <option key={idx} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="min-w-[100px] min-h-[100px] flex items-center justify-center">
                <UserChart data={userChart} month={month} year={year} />
              </div>
            </div>

            <div className="p-[10px] px-[30px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)] rounded-[20px] flex flex-col justify-start gap-5">
              <h3 className="font-medium mr-5 text-[18px] text-[#0B1246]">History Timeline</h3>
              <div className="min-w-[100px] min-h-[100px] flex items-center justify-center">
                <HistoryTimeline data={historyTimeline} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="fixed bottom-0 right-0 z-[1000] max-w-full overflow-x-hidden pointer-events-none">
        <div className="bg-[#0B1246] h-10 mr-5 rounded-t-[20px] flex px-2">
          <small className="text-white text-center m-auto p-[5px]">
            Last updated: {new Date().toLocaleDateString()}
          </small>
        </div>
      </div>
    </div>
  );

};

export default Dashboard;
