import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { SlArrowDown } from "react-icons/sl";
import AlertModal from "../components/AlertModal";


const AddUser = () => {
  const navigate = useNavigate();
  const [deptOpen, setDeptOpen] = useState(false);
  const deptMenuRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    midName: "",
    lastName: "",
    department: "",
    userId: "",
    password: "",
    confirmPassword: "",
  });

  const [departments, setDepartments] = useState([]);
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: "info", title: "", message: "" });

  useEffect(() => {
    api
      .get('/api/departments/')
      .then((res) => setDepartments(res.data || []))
      .catch((err) => console.error("❌ โหลด department ไม่ได้:", err));
  }, []);
  useEffect(() => {
  const onClickOutside = (e) => {
    if (deptMenuRef.current && !deptMenuRef.current.contains(e.target)) setDeptOpen(false);
  };
  window.addEventListener("click", onClickOutside);
  return () => window.removeEventListener("click", onClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlertModal({ isOpen: true, type: "error", title: "Error", message: "Passwords do not match" });
      return;
    }

    // Validate department selection
    if (!formData.department) {
      setAlertModal({ isOpen: true, type: "error", title: "Error", message: "Please select a department" });
      return;
    }

    const selectedDept = departments.find(
      (d) => d.department_name === formData.department
    );
    const department_id = selectedDept ? selectedDept.id : null;

    if (!department_id) {
      setAlertModal({ isOpen: true, type: "error", title: "Error", message: "Department ID not found. Please select a valid department." });
      return;
    }

    try {
      // Send username as string (backend expects str, not int)
      await api.post('/api/users/', {
        firstname: formData.firstName,
        midname: formData.midName,
        lastname: formData.lastName,
        department_id,
        username: formData.userId.trim(), // Send as string
        password: formData.password,
      });

      setAlertModal({ 
        isOpen: true, 
        type: "success", 
        title: "Success", 
        message: "User added successfully",
        onClose: () => {
          setAlertModal({ isOpen: false, type: "info", title: "", message: "" });
          navigate("/userManagement");
        }
      });
    } catch (err) {
      console.error("❌ ไม่สามารถเพิ่มผู้ใช้ได้:", err);
      console.log("DATA:", err.response?.data);
      
      // Handle FastAPI validation errors (array format)
      let errorMessage = "An error occurred";
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          // FastAPI validation errors are arrays
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
    }
  };

  const labelCls = "text-[#002f6c] font-medium mb-1";
  const inputCls =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0DA5D8]";
  const rowCls = "flex flex-col gap-5 md:flex-row";

  return (
    <div className="min-h-screen w-full flex items-start justify-center pt-18 pb-16 lg:pt-24">
      <div className="w-[95%] max-w-[900px] rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-200 ">
        <h1 className="mb-6 text-xl font-semibold text-gray-800">Add User</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 */}
          <div className={rowCls}>
            <div className="flex-1 min-w-[200px]">
              <label className={labelCls}>
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter first name"
                className={inputCls}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className={labelCls}>Mid Name</label>
              <input
                type="text"
                name="midName"
                value={formData.midName}
                onChange={handleChange}
                placeholder="Enter middle name"
                className={inputCls}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className={labelCls}>
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter last name"
                className={inputCls}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className={rowCls}>
            <div className="w-full">
              <label className={labelCls}>
                Department <span className="text-red-500">*</span>
              </label>

              <div className="relative inline-flex w-full" ref={deptMenuRef}>
                <button
                  type="button"
                  onClick={() => setDeptOpen(v => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={deptOpen}
                  aria-controls="dept-menu"
                  className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-[#0DA5D8]"
                >
                  <span className="truncate text-gray-700">
                    {formData.department ? formData.department : "Select Department"}
                  </span>
                  <SlArrowDown className={`shrink-0 transition ${deptOpen ? "rotate-180" : ""}`} />
                </button>

                {deptOpen && (
                  <ul
                    id="dept-menu"
                    role="listbox"
                    className="absolute left-0 top-[calc(100%+6px)] z-30 w-full max-h-60 overflow-y-auto list-none rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                  >
                    {departments.map((d) => {
                      const active = formData.department === d.department_name;
                      return (
                        <li
                          key={d.id}
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            setFormData(p => ({ ...p, department: d.department_name }));
                            setDeptOpen(false);
                          }}
                          className={`flex h-9 cursor-pointer items-center px-3 text-sm hover:bg-indigo-50 ${
                            active ? "bg-indigo-50 font-semibold text-indigo-700" : "text-gray-800"
                          }`}
                        >
                          {d.department_name}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className={rowCls}>
            <div className="w-full">
              <label className={labelCls}>
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                placeholder="Enter username"
                className={inputCls}
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className={rowCls}>
            <div className="flex-1 min-w-[200px]">
              <label className={labelCls}>
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className={inputCls}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className={labelCls}>
                Confirm password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter password"
                className={inputCls}
              />
            </div>
          </div>


          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="submit"
              className="w-32 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700"
            >
              ADD
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-32 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-600"
            >
              CANCEL
            </button>
          </div>
        </form>
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

export default AddUser;
