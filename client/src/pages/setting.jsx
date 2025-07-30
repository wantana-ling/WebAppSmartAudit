import React, { useState } from "react";
import "../css/setting.css"; 
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
      
    
    
    
    `}</style>
    </div>
  );
};

export default Setting;
