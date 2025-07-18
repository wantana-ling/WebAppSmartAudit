import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/addDevice.css";

const AddDevice = () => {
  const [form, setForm] = useState({
    device_name: "",
    ip: "",
    departments: [],
    max_users: "",
  });

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  useEffect(() => {
    axios
      .get(`${apiBase}/api/departments`)
      .then((res) => setDepartmentOptions(res.data))
      .catch((err) => console.error("❌ โหลด department ไม่ได้", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const updated = checked
        ? [...prev.departments, value]
        : prev.departments.filter((d) => d !== value);
      return { ...prev, departments: updated };
    });
  };

  const handleSubmit = async () => {
  const { device_name, ip, departments, max_users } = form;

  if (!device_name || !ip || departments.length === 0 || !max_users) {
    return alert("กรอกข้อมูลให้ครบ");
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const create_by = user?.user_id;

  const payload = {
    device_name,
    ip,
    department: departments.join(", "),
    max_users,
    create_by
  };

  console.log("📦 ส่งข้อมูล:", payload);

  try {
    await axios.post(`${apiBase}/api/devices`, payload);
    alert("✅ เพิ่มอุปกรณ์สำเร็จ");
    navigate("/deviceManagement");
  } catch (err) {
    console.error("❌ เพิ่ม device ไม่สำเร็จ", err);
    alert("เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์");
  }
};

  return (
    <div className="main-container">
      <div className="add-device-wrapper">
        <div className="form-row">
          <div className="form-group">
            <label>Name<span className="required">*</span></label>
            <input name="device_name" value={form.device_name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address<span className="required">*</span></label>
            <input name="ip" value={form.ip} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Department<span className="required">*</span></label>
            <div className="checkbox-group">
              {departmentOptions.map((dept) => (
                <label key={dept.id} className="checkbox-inline">
                  <input
                    type="checkbox"
                    value={dept.department_name}
                    checked={form.departments.includes(dept.department_name)}
                    onChange={handleCheckbox}
                  />
                  {dept.department_name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Max users<span className="required">*</span></label>
            <input
              type="number"
              name="max_users"
              value={form.max_users}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="button-row">
          <button className="btn-add" onClick={handleSubmit}>ADD</button>
          <button className="btn-cancel" onClick={() => navigate("/deviceManagement")}>CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default AddDevice;
