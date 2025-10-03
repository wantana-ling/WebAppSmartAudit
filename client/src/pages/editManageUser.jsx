import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SlArrowDown } from "react-icons/sl";

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

  const [deptOpen, setDeptOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const deptMenuRef = useRef(null);
  const statusMenuRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (deptMenuRef.current && !deptMenuRef.current.contains(e.target)) {
      setDeptOpen(false);
    }
    if (statusMenuRef.current && !statusMenuRef.current.contains(e.target)) {
      setStatusOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setDeptOpen(false);
      setStatusOpen(false);
    }
  };

  window.addEventListener("click", handleClickOutside);
  window.addEventListener("keydown", handleKeyDown);
  return () => {
    window.removeEventListener("click", handleClickOutside);
    window.removeEventListener("keydown", handleKeyDown);
  };
  }, []);

  useEffect(() => {
    axios
      .get(`${apiBase}/api/departments`)
      .then((res) => setDepartments(res.data || []))
      .catch((err) => console.error("❌ โหลด department ไม่ได้:", err));
  }, []);

  useEffect(() => {
    if (!id || id === "undefined") {
      setInvalidId(true);
      return;
    }

    axios
      .get(`${apiBase}/api/users/${id}`)
      .then((res) => {
        const u = res.data || {};
        setFormData({
          firstName: u.firstname || "",
          midName: u.midname || "",
          lastName: u.lastname || "",
          department: u.department || "No Department",
          status: u.status || "",
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

    const selectedDept = departments.find(
      (d) => d.department_name === formData.department
    );
    const department_id =
      formData.department === "No Department" ? null : selectedDept?.id || null;

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
      <div className="min-h-[40vh] p-8 text-center text-red-600">
        ❌ ไม่พบข้อมูลผู้ใช้ หรือ URL ไม่ถูกต้อง
      </div>
    );
  }

  // shared Tailwind classes
  const labelCls = "text-[#002f6c] font-medium mb-1";
  const inputCls =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0DA5D8]";
  const rowCls = "flex flex-col gap-5 md:flex-row";

  return (
    <div className="min-h-screen w-full flex items-start justify-center pt-12 pb-16">
      <div className="w-[95%] max-w-[900px] rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-200">
        <h1 className="mb-6 text-xl font-semibold text-gray-800">Edit User</h1>

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
            {/* Department */}
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
                    <li
                      key="no-dept"
                      role="option"
                      aria-selected={formData.department === "No Department"}
                      onClick={() => {
                        setFormData(p => ({ ...p, department: "No Department" }));
                        setDeptOpen(false);
                      }}
                      className={`flex h-9 cursor-pointer items-center px-3 text-sm hover:bg-indigo-50 ${
                        formData.department === "No Department"
                          ? "bg-indigo-50 font-semibold text-indigo-700"
                          : "text-gray-800"
                      }`}
                    >
                      No Department
                    </li>

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

            {/* Status */}
            <div className="w-full">
              <label className={labelCls}>
                Status <span className="text-red-500">*</span>
              </label>

              <div className="relative inline-flex w-full" ref={statusMenuRef}>
                <button
                  type="button"
                  onClick={() => setStatusOpen(v => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={statusOpen}
                  aria-controls="status-menu"
                  className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-[#0DA5D8]"
                >
                  <span className="truncate text-gray-700">
                    {formData.status ? formData.status.toUpperCase() : "Select Status"}
                  </span>
                  <SlArrowDown className={`shrink-0 transition ${statusOpen ? "rotate-180" : ""}`} />
                </button>

                {statusOpen && (
                  <ul
                    id="status-menu"
                    role="listbox"
                    className="absolute left-0 top-[calc(100%+6px)] z-30 w-full max-h-40 overflow-y-auto list-none rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                  >
                    {["active", "inactive"].map((s) => {
                      const active = formData.status === s;
                      return (
                        <li
                          key={s}
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            setFormData(p => ({ ...p, status: s }));
                            setStatusOpen(false);
                          }}
                          className={`flex h-9 cursor-pointer items-center px-3 text-sm hover:bg-indigo-50 ${
                            active ? "bg-indigo-50 font-semibold text-indigo-700" : "text-gray-800"
                          }`}
                        >
                          {s.toUpperCase()}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>


          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="submit"
              className="w-32 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700"
            >
              SAVE
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
    </div>
  );
};

export default EditManageUser;
