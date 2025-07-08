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

  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("❌ Failed to parse user from localStorage", err);
    }

    axios.get(`${apiBase}/api/dashboard-stats`)
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));

    axios.get(`${apiBase}/api/history-timeline?month=${month}&year=${year}`)
      .then(response => setHistoryTimeline(response.data))
      .catch(error => console.error('Error fetching history timeline data:', error));

    axios.get(`${apiBase}/api/users-chart?month=${month}&year=${year}`)
      .then(response => {
        console.log("user-chart response:", response.data);
        setUserChart(response.data);
      })
      .catch(error => console.error('Error fetching filtered data:', error));

    axios.get(`${apiBase}/api/available-years`)
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
    <div className="main-container">
      <div className="box-container">
        <div className="dashboard-header">
          <h1>WELCOME<span> , {user.firstname}</span></h1>
          <div className="profile-pic" onClick={() => navigate('/profile')}>
            <button>
              {/*<img
                src={`/uploads/images/user_profile/${user.user_id}.png`}
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'uploads/images/default-profile.jpg';
                }}
              />*/}
            </button>
          </div>
        </div>

        <div className="dashboard-container">
          <div className="cards">
            <div className="card">
              <h3>Access Count</h3>
              <h1>{stats.accessCount} <span>Times</span></h1>
            </div>
            <div className="card">
              <h3>Daily Use</h3>
              <h1>{stats.dailyUse ? (
                <>
                  {Math.floor(stats.dailyUse / 60)} <span>Hours</span> {stats.dailyUse % 60} <span>Minutes</span>
                </>
              ) : (
                <>0 <span>Hours</span> 0 <span>Minutes</span></>
              )}
              </h1>
            </div>
            <div className="card">
              <div className="card-header">
                <h3>Visitor Active</h3>
                <div className={`status-indicator ${stats.visitorActive > 0 ? 'online' : 'offline'}`}></div>
              </div>
              <div className="visitor-info">
                <span className="icon"><FaUser /></span>
                <h1>{stats.visitorActive}</h1>
              </div>
            </div>
          </div>

          <div className="cards">
            <div className="card">
              <div className="card-header">
                <h3>User</h3>
                <div className="filter-month">
                  <select value={month} onChange={e => setMonth(Number(e.target.value))}>
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>

                  <select value={year} onChange={e => setYear(Number(e.target.value))}>
                    <option value="">Year</option>
                    {years.map((y, index) => (
                      <option key={index} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="graph">
                <UserChart data={userChart} month={month} year={year} />
              </div>
            </div>

            <div className="card">
              <h3>History Timeline</h3>
              <div className="graph">
                <HistoryTimeline data={historyTimeline} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="post-it">
          <small className="updated-text">Last updated: {new Date().toLocaleDateString()}</small>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
