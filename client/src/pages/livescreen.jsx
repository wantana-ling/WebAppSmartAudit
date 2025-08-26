import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LiveScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedUser } = location.state || {};

  const handleExit = () => {
    navigate(-1); // ย้อนกลับ
  };

  return (
    <div className="main-container">
      <div className="box-container">
        <div className="live-screen-title">Live Screen Viewer</div>

        <div className="live-screen-table">
          <div><span className="live-screen-label">User ID</span><br />{selectedUser.userId}</div>
          <div><span className="live-screen-label">Department</span><br />{selectedUser.department}</div>
          <div><span className="live-screen-label">Username</span><br />{selectedUser.username}</div>
        </div>

        <div className="live-screen-video">
          <video controls width="720" src="http://localhost:3050/video/id_001_210825"></video>

        </div>

        <button className="live-screen-exit-btn" onClick={handleExit}>EXIT</button>
      </div>

      <style>{`
        .live-screen-container {
          padding: 40px;
          background: #f5f5f5;
          height: 100vh;
          box-sizing: border-box;
        }

        .live-screen-content {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          text-align: center;
        }

        .live-screen-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 30px;
        }

        .live-screen-table {
        display: flex;
        justify-content: space-around; /* กระจายให้สมดุล */
        gap: 40px;                     /* ช่องว่างระหว่างกล่อง */
        margin-bottom: 20px;
        font-size: 16px;
        flex-wrap: wrap;              /* ป้องกันล้นบนจอเล็ก */
        }

        .live-screen-table > div {
        min-width: 150px;
        text-align: center;
        }

        .live-screen-table > div {
        flex: 1;
        text-align: center;
        }

        @media (max-width: 600px) {
        .live-screen-table {
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        }



        .live-screen-video {
          width: 100%;
          height: 300px;
          background: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .live-screen-exit-btn {
          background: #ff5e5e;
          border: none;
          color: white;
          padding: 10px 30px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .live-screen-exit-btn:hover {
          background: #e04e4e;
        }
      `}</style>
    </div>
  );
};

export default LiveScreen;
