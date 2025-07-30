import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddUser = () => {
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const [formData, setFormData] = useState({
    firstName: "",
    midName: "",
    lastName: "",
    department: "",
    userId: "",
    password: "",
    confirmPassword: "",
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiBase}/api/departments`)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("❌ โหลด department ไม่ได้:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      await axios.post(`${apiBase}/api/users`, {
        firstname: formData.firstName,
        midname: formData.midName,
        lastname: formData.lastName,
        department: formData.department,
        user_id: formData.userId,
        password: formData.password,
      });

      alert("✅ เพิ่มผู้ใช้สำเร็จ");
      navigate("/userManagement");
    } catch (err) {
      console.error("❌ ไม่สามารถเพิ่มผู้ใช้ได้:", err);
      alert("❌ เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="main-container">
      <div className="add-user-wrapper">
        <div className="box-container">
          <form className="add-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>
                  First Name <span className="required">*</span>
                </label>
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
                <label>
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>
                  Department <span className="required">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- เลือกแผนก --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.department_name}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>
                  UserID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Confirm password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="button-row">
              <button type="submit" className="btn btn-save">
                ADD
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => navigate(-1)}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    <style>{`
    .edit-user-wrapper {
      margin-top: 100px;
      display: flex;
      justify-content: center;
    }

    .box-container {
      background: #fff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      width: 95%;
      max-width: 900px;
    }

    .edit-form {
      width: 100%;
      font-family: 'Prompt', sans-serif;
    }

    /* === กล่อง input แถวแรก 3 ช่อง === */
    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 200px;
      margin-bottom: 15px;
    }

    input,
    select {
      padding: 10px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
      background-color: white;
    }

    label {
      color: #002f6c;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .required {
      color: red;
      margin-left: 3px;
    }

    /* === ปุ่ม SAVE / CANCEL === */
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
      font-size: 15px;
      cursor: pointer;
      color: white;
      text-align: center;
      transition: 0.2s ease;
    }

    .btn-save {
      background-color: #00cc66;
    }

    .btn-cancel {
      background-color: #ff4d4d;
    }

    @media (max-width: 768px) {
      .form-row {
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

export default AddUser;
