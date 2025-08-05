import React, { useState, useEffect } from "react";
import "../css/editUser.css";
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
    </div>
  );
};

export default EditUser;
