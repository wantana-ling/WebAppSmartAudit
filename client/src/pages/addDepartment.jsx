import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddDepartment = () => {
  const [departmentName, setDepartmentName] = useState("");
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const handleSave = () => {
    if (!departmentName.trim()) return alert("กรุณากรอกชื่อแผนก");
    axios
      .post(`${apiBase}/api/departments`, { name: departmentName })
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
    <div className="w-full min-h-screen px-4 py-10">
      <div className="w-full max-w-[700px] mx-auto mt-12 rounded-xl border border-gray-200 bg-white p-10 shadow">
        {/* Field */}
        <div className="mb-8 flex flex-col">
          <label className="mb-1 text-[15px] font-medium text-[#00209F]">
            Department Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="Enter department name"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#0DA5D8] focus:ring-2 focus:ring-[#0DA5D8]"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSave}
            className="w-[120px] rounded-md bg-green-500 px-6 py-2.5 text-sm font-medium text-white shadow hover:bg-green-600 active:translate-y-[1px]"
          >
            ADD
          </button>
          <button
            onClick={() => navigate("/department")}
            className="w-[120px] rounded-md bg-red-500 px-6 py-2.5 text-sm font-medium text-white shadow hover:bg-red-600 active:translate-y-[1px]"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
