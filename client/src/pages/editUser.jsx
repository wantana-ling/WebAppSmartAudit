import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditUser = () => {
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const [formData, setFormData] = useState({
    company: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin) {
      setFormData({
        company: admin.company || "",
        password: "",
        confirmPassword: ""
      });
    }
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

    const admin = JSON.parse(localStorage.getItem("admin"));
    const userId = admin?.user_id;

    if (!userId) {
      alert("ไม่พบ user_id");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.put(`${apiBase}/api/admin-profile/${userId}`, {
        company: formData.company,
        password: formData.password
      });

      const updatedAdmin = {
        ...admin,
        company: formData.company,
        password: formData.password
      };
      localStorage.setItem("admin", JSON.stringify(updatedAdmin));

      alert("✅ บันทึกสำเร็จ");
      navigate(-1);
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("❌ บันทึกไม่สำเร็จ");
    }
  };

  return (
    <div className="main-container">
      <div className="edit-user-wrapper">
        <div className="box-container">
          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Company name <span className="required">*</span></label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm password <span className="required">*</span></label>
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
              <button type="submit" className="btn btn-save">SAVE</button>
              <button type="button" className="btn btn-cancel" onClick={() => navigate(-1)}>CANCEL</button>
            </div>
          </form>
        </div>
      </div>
    <style>{`
    .edit-user-wrapper {
      margin-top: 80px;
      display: flex;
      justify-content: center;
    }

    .box-container {
      background: #fff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      width: 90%;
    }

    .edit-form {
      width: 100%;
      max-width: 900px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
      flex: 1;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
    }

    input {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
    }

    .required {
      color: red;
    }

    .button-row {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
    }

    .btn {
      width: 150px;
      padding: 10px 0;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      color: white;
      text-align: center;
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

    label {
      color: #002f6c; /* น้ำเงินเข้ม */
      font-weight: 500;
    }
    `}</style>
    </div>
  );
};

export default EditUser;
