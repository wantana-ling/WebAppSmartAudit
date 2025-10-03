import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditDepartment = () => {
  const [departmentName, setDepartmentName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  useEffect(() => {
    axios
      .get(`${apiBase}/api/departments/${id}`)
      .then((res) => {
        setDepartmentName(res.data.department_name || "");
      })
      .catch((err) => {
        console.error("❌ โหลด department ล้มเหลว:", err);
        alert("ไม่พบข้อมูลแผนก");
        navigate("/department");
      });
  }, [id, apiBase, navigate]);

  const handleSave = () => {
    if (!departmentName.trim()) return alert("กรุณากรอกชื่อแผนก");

    axios
      .put(`${apiBase}/api/departments/${id}`, { name: departmentName })
      .then(() => {
        alert("✅ บันทึกสำเร็จ");
        navigate("/department");
      })
      .catch((err) => {
        console.error("❌ บันทึกไม่สำเร็จ:", err);
        alert("เกิดข้อผิดพลาด");
      });
  };

  return (
    <div className="w-full max-w-[700px] bg-white p-10 rounded-xl shadow-md border border-gray-300 mx-auto mt-12 pt-12 pb-16 ">
      {/* Input */}
      <div className="flex flex-col mb-6">
        <label className="text-[15px] text-[#00209F] mb-2">
          Department Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder="Enter department name"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#0DA5D8] outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
          onClick={handleSave}
        >
          SAVE
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
          onClick={() => navigate("/department")}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default EditDepartment;
