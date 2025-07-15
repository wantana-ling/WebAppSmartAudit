import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/editDevice.css";
import axios from "axios";

const EditDevice = () => {
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const [formData, setFormData] = useState({
    name: "",
    ip: "",
    departments: []
  });

  const departmentOptions = ["HR", "Operator", "Purchase", "Accounting"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newDepartments = checked
        ? [...prev.departments, value]
        : prev.departments.filter((d) => d !== value);
      return { ...prev, departments: newDepartments };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.ip || formData.departments.length === 0) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    try {
      await axios.post(`${apiBase}/api/devices`, formData);
      alert("✅ เพิ่มอุปกรณ์เรียบร้อยแล้ว");
      navigate("/deviceManagement");
    } catch (err) {
      console.error("❌ เพิ่มอุปกรณ์ไม่สำเร็จ", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div className="main-container">
      <div className="device-form-wrapper">
        <form className="device-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Device Name <span className="required">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>IP Hostname <span className="required">*</span></label>
              <input type="text" name="ip" value={formData.ip} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Department <span className="required">*</span></label>
            <div className="checkbox-group">
              {departmentOptions.map((dept) => (
                <label key={dept} className="checkbox-inline">
                  <input
                    type="checkbox"
                    value={dept}
                    checked={formData.departments.includes(dept)}
                    onChange={handleCheckbox}
                  />
                  {dept}
                </label>
              ))}
            </div>
          </div>

          <div className="button-row">
            <button type="submit" className="btn btn-save">SAVE</button>
            <button type="button" className="btn btn-cancel" onClick={() => navigate(-1)}>CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDevice;