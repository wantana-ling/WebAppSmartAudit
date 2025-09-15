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
          <div><span className="live-screen-label"><b>User ID</b></span><br /><br />{selectedUser.userId}</div>
          <div><span className="live-screen-label"><b>Department</b></span><br /><br />{selectedUser.department}</div>
          <div><span className="live-screen-label"><b>Username</b></span><br /><br />{selectedUser.username}</div>
        </div>

        <div className="live-screen-video">
          <video controls  src="http://localhost:3050/video/id_001_210825"></video>

        </div>

        <div className="live-screen-exit">
          <button className="live-screen-exit-btn" onClick={handleExit}>EXIT</button>
        </div>

      </div>

      <style>{`
        .live-screen-video video {
          width: 100%;
          height: 100%;
          object-fit: contain;   /* ใช้ cover ถ้าอยากให้เต็มตัดขอบ */
          border-radius: 6px;
          display: block;
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
          text-align:center;
        }

        .live-screen-table {
          display: flex;
          justify-content: space-around;
          gap: 40px;                    
          margin-bottom: 20px;
          font-size: 16px;
          flex-wrap: wrap;              
        }

        .live-screen-table > div {
          min-width: 150px;
          text-align: center;
        }

        .live-screen-table > div {
          flex: 1;
          text-align: center;
        }



        .live-screen-video {
          width: 100%;
          aspect-ratio: 25 / 10; 
          background: #000;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-bottom: 30px;
          overflow: hidden;
        }

        .live-screen-exit-btn {
          align-item:center;
          width:50%;
          background:rgba(13,149,216,1);
          border: none;
          color: white;
          padding: 10px 30px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s ease;
          transition-delay: 0s;
        }

        .live-screen-exit-btn:hover {
          background: rgba(13,149,216,0.5);
          transition-delay: 0.4s;
        }
        .live-screen-exit {
          text-align:center;
        }
      `}</style>
    </div>
  );
};

export default LiveScreen;
