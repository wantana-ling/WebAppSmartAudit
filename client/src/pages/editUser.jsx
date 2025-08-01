import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditUser = () => {
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const [formData, setFormData] = useState({
    firstName: "",
    midName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData({
        firstName: user.firstname || "",
        midName: user.midname || "",
        lastName: user.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
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

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.user_id;

    if (!userId) {
      alert("ไม่พบ user_id");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("🚀 ส่งข้อมูลไป backend:", formData);

    try {
      await axios.put(`${apiBase}/api/user-profile/${userId}`, {
        firstname: formData.firstName,
        midname: formData.midName,
        lastname: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        department: user.department,
        status: user.status
      });

      const updatedUser = {
        ...user,
        firstname: formData.firstName,
        midname: formData.midName,
        lastname: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("✅ บันทึกสำเร็จ");
      navigate(-1);
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("❌ บันทึกไม่สำเร็จ");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="main-container">
      <div className="edit-user-wrapper">
        <div className="box-container">
          <form className="edit-form" onSubmit={handleSubmit}>
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
              <label>Email <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone number <span className="required">*</span></label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="\d{10}"
                title="Phone number must be exactly 10 digits"
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
              <button type="button" className="btn btn-cancel" onClick={handleCancel}>CANCEL</button>
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
