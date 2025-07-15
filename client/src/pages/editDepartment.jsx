import React, { useState } from "react";
import "../css/editDepartment.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditDepartment = () => {
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
          <button className="save-btn" onClick={handleSave}>SAVE</button>
          <button className="cancel-btn" onClick={() => navigate("/department")}>CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;
