import React, { useState, useEffect } from "react";
import "../css/editManageUser.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditManageUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const [formData, setFormData] = useState({
    firstName: "",
    midName: "",
    lastName: "",
    department: "",
    status: "",
  });

  const [departments, setDepartments] = useState([]);
  const [invalidId, setInvalidId] = useState(false); // ✅ flag แทน early return

  // ✅ โหลด department
  useEffect(() => {
    axios.get(`${apiBase}/api/departments`)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("❌ โหลด department ไม่ได้:", err));
  }, []);

  // ✅ โหลดข้อมูล user เดิม
  useEffect(() => {
    if (!id || id === "undefined") {
      setInvalidId(true); // ✅ ตั้ง flag ถ้า id หาย
      return;
    }

    axios.get(`${apiBase}/api/user-manage/${id}`)
      .then((res) => {
        const u = res.data;
        setFormData({
          firstName: u.firstname,
          midName: u.midname || "",
          lastName: u.lastname,
          department: u.department,
          status: u.status,
        });
      })
      .catch((err) => {
        console.error("❌ โหลดข้อมูลผู้ใช้ไม่สำเร็จ:", err.response?.data || err);
        setInvalidId(true);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ["firstName", "lastName", "department", "status"];
    for (const field of required) {
      if (!formData[field]) {
        alert(`กรุณากรอกข้อมูลให้ครบถ้วน (${field})`);
        return;
      }
    }

    try {
      console.log("📦 ส่งข้อมูล:", formData);
      await axios.put(`${apiBase}/api/user-manage/${id}`, formData);
      alert("✅ อัปเดตผู้ใช้สำเร็จ");
      navigate("/userManagement");
    } catch (err) {
      console.error("❌ ไม่สามารถอัปเดตผู้ใช้ได้:", err.response?.data || err);
      alert("❌ เกิดข้อผิดพลาด");
    }
  };

  // ✅ เงื่อนไขหลัง hook: ถ้า id ไม่ valid
  if (invalidId) {
    return (
      <div style={{ padding: 30, color: "red" }}>
        ❌ ไม่พบข้อมูลผู้ใช้ หรือ URL ไม่ถูกต้อง
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="add-user-wrapper">
        <div className="box-container">
          <form className="add-form" onSubmit={handleSubmit}>
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
              <label>Department <span className="required">*</span></label>
              <select name="department" value={formData.department} onChange={handleChange} required>
                <option value="">-- เลือกแผนก --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.department_name}>{d.department_name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status <span className="required">*</span></label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="">-- เลือกสถานะ --</option>
                <option value="active">ACTIVE</option>
                <option value="inactive">INACTIVE</option>
              </select>
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

export default EditManageUser;
