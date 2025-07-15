import React, { useState } from "react";
import "../css/editManageUser.css"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditManageUser = () => {
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const [formData, setFormData] = useState({
    firstName: "",
    midName: "",
    lastName: "",
    department: "",
    status: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.department || !formData.status) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      await axios.post(`${apiBase}/api/user`, formData);
      alert("✅ เพิ่มผู้ใช้สำเร็จ");
      navigate("/userManagement");
    } catch (err) {
      console.error("❌ ไม่สามารถเพิ่มผู้ใช้ได้:", err);
      alert("❌ เกิดข้อผิดพลาด");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="main-container">
      <div className="add-user-wrapper">
        <div className="box-container">
          <form className="add-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mid Name</label>
                <input
                  type="text"
                  name="midName"
                  value={formData.midName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Department <span className="required">*</span></label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">-- เลือกแผนก --</option>
                <option value="ITfront">ITfront</option>
                <option value="ITback">ITback</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status <span className="required">*</span></label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">-- เลือกสถานะ --</option>
                <option value="active">ACTIVE</option>
                <option value="inactive">INACTIVE</option>
              </select>
            </div>

            <div className="button-row">
              <button type="submit" className="btn btn-save">SAVE</button>
              <button type="button" className="btn btn-cancel" onClick={handleCancel}>CANCEL</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditManageUser;
