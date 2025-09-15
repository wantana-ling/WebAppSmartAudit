import React, { useState, useEffect } from "react";
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
  const [invalidId, setInvalidId] = useState(false);

  useEffect(() => {
    axios.get(`${apiBase}/api/departments`)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("❌ โหลด department ไม่ได้:", err));
  }, []);

  useEffect(() => {
    if (!id || id === "undefined") {
      setInvalidId(true);
      return;
    }

    axios.get(`${apiBase}/api/users/${id}`)
      .then((res) => {
        const u = res.data;
        setFormData({
          firstName: u.firstname,
          midName: u.midname || "",
          lastName: u.lastname,
          department: u.department || "No Department",
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

    const required = ["firstName", "lastName", "status"];
    for (const field of required) {
      if (!formData[field]) {
        alert(`กรุณากรอกข้อมูลให้ครบถ้วน (${field})`);
        return;
      }
    }

    const selectedDept = departments.find((d) => d.department_name === formData.department);
    const department_id = formData.department === "No Department" ? null : selectedDept?.id || null;

    try {
      await axios.put(`${apiBase}/api/users/${id}`, {
        firstname: formData.firstName,
        midname: formData.midName,
        lastname: formData.lastName,
        email: "",
        phone: "",
        password: "",
        department_id,
        status: formData.status,
      });

      alert("✅ อัปเดตผู้ใช้สำเร็จ");
      navigate("/userManagement");
    } catch (err) {
      console.error("❌ ไม่สามารถอัปเดตผู้ใช้ได้:", err.response?.data || err);
      alert("❌ เกิดข้อผิดพลาด");
    }
  };

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
              <label>Department</label>
              <select
                name="department"
                value={formData.department || ""}
                onChange={handleChange}
              >
                <option value="No Department">No Department</option>
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
    <style>{`
    .device-management-wrapper {
      width: 100%;
      max-width: 1100px;
      background-color: #ffffff;
      font-family: 'Prompt', sans-serif;
      margin-top: 50px;
      margin-left: 0;
      margin-right: 0;
      margin-bottom: auto;
    }

    /* === กล่องควบคุมด้านบน === */
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
    }

    .search-filter-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      flex: 1;
    }

    .add-button-row {
      display: flex;
      justify-content: flex-end;
      flex-shrink: 0;
    }

    /* === Input + Select === */
    .search-filter-row input[type="text"],
    .search-filter-row select {
      padding: 8px 12px;
      border-radius: 10px;
      border: 1px solid #ccc;
      font-size: 14px;
    }

    .user-search-input {
      width: 50%;
      max-width: 400px;
      min-width: 200px;
    }

    /* === Table === */
    .table-container {
      max-height: calc(51px * 10);
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    }

    .scroll-table {
      width: 100%;
      border-collapse: collapse;
    }

    .scroll-table thead,
    .scroll-table tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }

    .scroll-table tbody {
      display: block;
      overflow-y: auto;
      max-height: none;
    }

    th, td {
      padding: 12px;
      text-align: left;
      vertical-align: middle;
    }

    th {
      background-color: #f0f2fa;
      color: #00209F;
      font-weight: 600;
      font-size: 14px;
    }

    td {
      font-size: 14px;
      color: #333;
      border-top: 1px solid #eee;
    }

    /* === Column Widths === */
    th:nth-child(1), td:nth-child(1) { width: 20px; text-align: center; }
    th:nth-child(2), td:nth-child(2) { width: 50px; text-align: left; }
    th:nth-child(3), td:nth-child(3) { width: 100px; text-align: left; }
    th:nth-child(4), td:nth-child(4) { width: 200px; text-align: left; }
    th:nth-child(5), td:nth-child(5) { width: 20px; text-align: center; }
    th:nth-child(6), td:nth-child(6) { width: 20px;}
    th:nth-child(7), td:nth-child(7) {
      width: 20px;
      text-align: center;
      vertical-align: middle;
    }

    /* === ปุ่ม Edit/Delete === */
    .edit-btn, .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      transition: 0.2s ease;
    }

    .edit-btn:hover { color: #007bff; }
    .delete-btn:hover { color: #ff3b30; }

    /* === ปุ่ม Add === */
    .add-user-btn {
      background-color: #22c55e;
      color: white;
      font-weight: 500;
      border: none;
      border-radius: 6px;
      padding: 4px 12px;
      font-size: 13px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .add-user-btn:hover {
      background-color: #16a34a;
    }
    `}</style>
    </div>
  );
};

export default EditManageUser;
