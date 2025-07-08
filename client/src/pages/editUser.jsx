import React, { useState } from "react";
import "../css/editUser.css";
import { useNavigate } from "react-router-dom";

const EditUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    midName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    // TODO: submit to API
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
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Mid Name</label>
                <input type="text" name="midName" value={formData.midName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Phone number <span className="required">*</span></label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password <span className="required">*</span></label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Confirm password <span className="required">*</span></label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
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

export default EditUser;
