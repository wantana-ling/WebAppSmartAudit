import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/editDevice.css";
import axios from "axios";

const EditDevice = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 👉 ดึง ID จาก URL
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const [formData, setFormData] = useState({
    device_name: "",
    ip: "",
    departments: []
  });

  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    // ✅ โหลด department options
    axios.get(`${apiBase}/api/departments`)
      .then(res => setDepartmentOptions(res.data))
      .catch(err => console.error("❌ โหลด department ล้มเหลว", err));
  }, []);

  useEffect(() => {
    // ✅ โหลดข้อมูล device เดิม
    axios.get(`${apiBase}/api/devices/${id}`)
      .then(res => {
        const device = res.data;
        setFormData({
          device_name: device.device_name || "",
          ip: device.ip || "",
          departments: device.department
            ? device.department.split(",").map(d => d.trim())
            : []
        });
      })
      .catch(err => {
        console.error("❌ โหลดข้อมูล device ไม่สำเร็จ", err);
        alert("ไม่พบข้อมูลอุปกรณ์");
        navigate("/deviceManagement");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev.departments, value]
        : prev.departments.filter((d) => d !== value);
      return { ...prev, departments: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.device_name || !formData.ip || formData.departments.length === 0) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      await axios.put(`${apiBase}/api/devices/${id}`, {
        device_name: formData.device_name,
        ip: formData.ip,
        department: formData.departments.join(", ")
      });
      alert("✅ แก้ไขข้อมูลสำเร็จ");
      navigate("/deviceManagement");
    } catch (err) {
      console.error("❌ แก้ไขอุปกรณ์ไม่สำเร็จ", err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (
    <div className="main-container">
      <div className="device-form-container">
        <form className="device-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Device Name <span className="required">*</span></label>
              <input
                type="text"
                name="device_name"
                value={formData.device_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>IP Hostname <span className="required">*</span></label>
              <input
                type="text"
                name="ip"
                value={formData.ip}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Department <span className="required">*</span></label>
            <div className="checkbox-group">
              {departmentOptions.map((dept) => (
                <label key={dept.id} className="checkbox-inline">
                  <input
                    type="checkbox"
                    value={dept.department_name}
                    checked={formData.departments.includes(dept.department_name)}
                    onChange={handleCheckbox}
                  />
                  {dept.department_name}
                </label>
              ))}
            </div>
          </div>

          <div className="button-row">
            <button type="submit" className="btn btn-save">SAVE</button>
            <button type="button" className="btn btn-cancel" onClick={() => navigate("/deviceManagement")}>CANCEL</button>
          </div>
        </form>
      </div>
    <style>{`
      
    
    
    
    `}</style>
    </div>
  );
};

export default EditDevice;
