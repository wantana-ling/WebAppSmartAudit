import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddDepartment = () => {
  const [departmentName, setDepartmentName] = useState("");
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const handleSave = () => {
    if (!departmentName.trim()) return alert("กรุณากรอกชื่อแผนก");
    axios.post(`${apiBase}/api/departments`, { name: departmentName })
      .then(() => {
        alert("✅ บันทึกสำเร็จ");
        navigate("/department");
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
          <label>Department Name <span className="required">*</span></label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="Enter department name"
          />
        </div>
        <div className="button-group">
          <button className="save-btn" onClick={handleSave}>ADD</button>
          <button className="cancel-btn" onClick={() => navigate("/department")}>CANCEL</button>
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

    /* ให้ form wrapper กว้างและชิดซ้ายแบบ edit */
    .form-wrapper {
      width: 100%;
      max-width: 700px;
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin: 50px auto 0;
      border: 1px solid #ddd;
    }

    /* ช่องกรอก input */
    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 30px;
    }

    label {
      font-size: 15px;
      color: #00209F;
      margin-bottom: 6px;
    }

    .required {
      color: red;
    }

    input[type="text"] {
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid #ccc;
      font-size: 14px;
      width: 100%;
    }

    /* ปุ่ม Save/Cancel */
    .button-group {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .save-btn {
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

    .cancel-btn {
      width: 120px;
      background-color: #ef4444;
      color: white;
      padding: 10px 30px;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .cancel-btn:hover {
      background-color: #dc2626;
    }
    `}</style>
    </div>
  );
};

export default AddDepartment;
