import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/addDevice.css";

const AddDevice = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    department: "",
    max_users: "",
  });

  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.address || !form.department || !form.max_users) return alert("กรอกข้อมูลให้ครบ");
    try {
      await axios.post(`${apiBase}/api/devices`, form);
      navigate("/deviceManagement");
    } catch (err) {
      console.error("❌ เพิ่ม device ไม่สำเร็จ", err);
    }
  };

  return (
    <div className="main-container">
      <div className="add-device-wrapper">
        <div className="form-row">
          <div className="form-group">
            <label>Name<span className="required">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address<span className="required">*</span></label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Department<span className="required">*</span></label>
            <select name="department" value={form.department} onChange={handleChange}>
              <option value="">เลือกแผนก</option>
              <option value="Accounting">Accounting</option>
              <option value="Sales">Sales</option>
              <option value="IT Support">IT Support</option>
              <option value="Development">Development</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max users<span className="required">*</span></label>
            <input type="number" name="max_users" value={form.max_users} onChange={handleChange} />
          </div>
        </div>

        <div className="button-row">
          <button className="btn-add" onClick={handleSubmit}>ADD</button>
          <button className="btn-cancel" onClick={() => navigate("/deviceManagement")}>CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default AddDevice;
