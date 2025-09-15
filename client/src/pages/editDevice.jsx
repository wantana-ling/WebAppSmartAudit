import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    .device-form-container {
      margin: 0 auto;
      background: #fff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      width: 95%;
      max-width: 900px;
    }

    .device-form {
      width: 100%;
    }

    .device-form .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .device-form .form-group {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .device-form label {
      font-weight: 500;
      color: #002f6c;
      margin-bottom: 5px;
    }

    .device-form input[type="text"] {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
    }

    .checkbox-group {
      background-color: #f7f7f7;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .checkbox-inline {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .required {
      color: red;
    }

    .button-row {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 30px;
    }

    .btn {
      width: 120px;
      padding: 10px 0;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      color: white;
      text-align: center;
      transition: 0.2s ease;
    }

    .btn-save {
      background-color: #00cc66;
    }

    .btn-save:hover {
      background-color: #16a34a;
    }

    .btn-cancel {
      background-color: #ff4d4d;
    }

    .btn-cancel:hover {
      background-color: #dc2626;
    }

    @media (max-width: 768px) {
      .device-form .form-row {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
    `}</style>
    </div>
  );
};

export default EditDevice;
