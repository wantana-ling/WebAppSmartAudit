import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import AlertModal from "../components/AlertModal";

const AddDepartment = () => {
  const [departmentName, setDepartmentName] = useState("");
  const navigate = useNavigate();
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: "info", title: "", message: "" });

  const handleSave = () => {
    if (!departmentName.trim()) {
      setAlertModal({ isOpen: true, type: "warning", title: "Warning", message: "Please enter department name" });
      return;
    }
    api
      .post('/api/departments/', { name: departmentName })
      .then(() => {
        setAlertModal({ 
          isOpen: true, 
          type: "success", 
          title: "Success", 
          message: "Saved successfully",
          onClose: () => {
            setAlertModal({ isOpen: false, type: "info", title: "", message: "" });
            navigate("/department");
          }
        });
      })
      .catch((err) => {
        console.error("❌ บันทึกไม่สำเร็จ:", err);
        
        // Handle FastAPI validation errors (array format)
        let errorMessage = "An error occurred";
        if (err.response?.data?.detail) {
          const detail = err.response.data.detail;
          if (Array.isArray(detail)) {
            errorMessage = detail.map((e) => `${e.loc?.join('.') || ''}: ${e.msg || ''}`).join('\n');
          } else if (typeof detail === 'string') {
            errorMessage = detail;
          } else {
            errorMessage = JSON.stringify(detail);
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setAlertModal({ isOpen: true, type: "error", title: "Error", message: errorMessage });
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

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => {
          setAlertModal({ isOpen: false, type: "info", title: "", message: "" });
          if (alertModal.onClose) alertModal.onClose();
        }}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
      />
    </div>
  );
};

export default AddDepartment;
