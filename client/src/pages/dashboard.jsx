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
    <div className="main-container">
      <div className="box-container">
        <div className="dashboard-header">
          <h1>WELCOME<span> , {user.company}</span></h1>
          <div className="profile-pic" onClick={() => navigate('/profile')}>
            <button>
              <img
                src={process.env.PUBLIC_URL + "/img/default-profile.jpg"}
                alt="Profile"
              />
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
              <div className="card-header-graph">
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
    <style>{`
      .box-container{
        align-items:center;
        text-align:center;
      }
      .dashboard-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .dashboard-header {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        color: var(--secondary-color);
      }

      .dashboard-header h1{
        font-size: 45px;
        font-weight: 500;
      }

      .dashboard-header h1 span{
        font-size: 40px;
        font-weight: 300;
      }
      .status-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin: 5px;
      }
        
      .status-indicator.online {
        background-color: var(--green-color);
        box-shadow: 0 0 6px 3px rgba(58, 215, 124, 0.4);
        animation: glow 2s infinite ease-in-out;
      }
      
      .status-indicator.offline {
        background-color: #c3c3c3;
        box-shadow: 0 0 6px 3px rgba(220, 220, 220, 0.4);
      }

      @media (max-width: 768px) {
        .dashboard-header {
            align-items: start;
        }
        
        .dashboard-header h1{
          font-size: 35px;
        }
        
        .dashboard-header h1 span{
            font-size: 30px;
        }
      
        .card {
            padding: 15px;
            width: 100%;
            border-radius: 20px;
        }
        .card h3 {
            font-size: 3.5vw;
        }
        
        .card h1 {
            font-size: 5.5vw;
        
        }
        .card h1 span {
            font-size: 4vw;
        }

        .graph {
            height: 22vh;
        }

      
        .history-timeline {
            display: flex;
            justify-content: center;
            margin-right: 10px;
        }

        .user-chart {
            width: 200;
            height: 200;

        }
        
        .updated-text {
            font-size: 12px;
        }

      
      }
    `}</style>  
    </div>
  );
};

export default Dashboard;
