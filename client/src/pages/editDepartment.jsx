import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import AlertModal from "../components/AlertModal";

const EditDepartment = () => {
  const [departmentName, setDepartmentName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: "info", title: "", message: "" });

  useEffect(() => {
    api
      .get(`/api/departments/${id}`)
      .then((res) => {
        setDepartmentName(res.data.department_name || "");
      })
      .catch((err) => {
        console.error("❌ โหลด department ล้มเหลว:", err);
        setAlertModal({ 
          isOpen: true, 
          type: "error", 
          title: "Error", 
          message: "Department not found",
          onClose: () => {
            setAlertModal({ isOpen: false, type: "info", title: "", message: "" });
            navigate("/department");
          }
        });
      });
  }, [id, navigate]);

  const handleSave = () => {
    if (!departmentName.trim()) {
      setAlertModal({ isOpen: true, type: "warning", title: "Warning", message: "Please enter department name" });
      return;
    }

    api
      .put(`/api/departments/${id}`, { name: departmentName })
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

export default EditDepartment;
