import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Setting = () => {
  const [adServer, setAdServer] = useState("");
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const handleSave = () => {
    if (!adServer.trim()) return alert("กรุณากรอก AD Server IP / Host Name");

    axios.post(`${apiBase}/api/settings/adserver`, { host: adServer })
      .then(() => {
        alert("✅ บันทึกสำเร็จ");
      })
      .catch(err => {
        console.error("❌ บันทึกไม่สำเร็จ:", err);
        alert("เกิดข้อผิดพลาด");
      });
  };

  return (
    <div className="main-container">
      <div className="form-wrapper">
        <div className="form-group">
          <label>AD Server IP / Hostname <span className="required">*</span></label>
          <input
            type="text"
            value={adServer}
            onChange={(e) => setAdServer(e.target.value)}
            placeholder="Enter AD Server IP or Hostname"
          />
        </div>
        <div className="button-group">
          <button className="save-btn" onClick={handleSave}>SAVE</button>
        </div>
      </div>
    <style>{`
    .main-container {
      margin-left: 21vw;
      width: 79vw;
      padding: 40px;
      box-sizing: border-box;
      font-family: 'Prompt', sans-serif;
    }

    /* กล่องตั้งค่า */
    .setting-wrapper {
      width: 100%;
      max-width: 700px;
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin: 50px auto 0;
      border: 1px solid #ddd;
    }

    /* ช่องกรอกข้อความ */
    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 30px;
    }

    .form-group label {
      font-size: 15px;
      color: #00209F;
      margin-bottom: 6px;
    }

    input[type="text"] {
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid #ccc;
      font-size: 14px;
      width: 100%;
    }

    /* ปุ่ม SAVE */
    .save-btn {
      display: block;
      margin: 0 auto;
      width: 120px;
      background-color: #22c55e;
      color: white;
      padding: 10px 30px;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .save-btn:hover {
      background-color: #16a34a;
    }
    `}</style>
    </div>
  );
};

export default Setting;
