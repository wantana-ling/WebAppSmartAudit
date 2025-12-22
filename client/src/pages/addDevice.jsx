import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { SlArrowDown } from "react-icons/sl";
import AlertModal from "../components/AlertModal";

const AddDevice = () => {
  const navigate = useNavigate();

  // ฟอร์มเหมือนไฟล์เดิม แต่ย้ายมาใช้ Tailwind + placeholder ครบ
  const [form, setForm] = useState({
    device_name: "",
    ip: "",
    departments: [], // multiple
    max_users: "",
  });

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: "info", title: "", message: "" });

  // dropdown สำหรับ Department (multi-select)
  const [deptOpen, setDeptOpen] = useState(false);
  const deptMenuRef = useRef(null);

  useEffect(() => {
    api
      .get('/api/departments/')
      .then((res) => setDepartmentOptions(res.data || []))
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDepartment = (value) => {
    setForm((prev) => {
      const has = prev.departments.includes(value);
      return {
        ...prev,
        departments: has
          ? prev.departments.filter((d) => d !== value)
          : [...prev.departments, value],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { device_name, ip, departments, max_users } = form;

    if (!device_name || !ip || departments.length === 0 || !max_users) {
      setAlertModal({ isOpen: true, type: "warning", title: "Warning", message: "Please fill in all fields" });
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const create_by = user?.username;

    const payload = {
      device_name,
      ip,
      department: departments.join(", "), // ⬅️ คงพฤติกรรมไฟล์เดิม
      max_users,
      create_by,
    };

    try {
      await api.post('/api/devices/', payload);
      setAlertModal({ 
        isOpen: true, 
        type: "success", 
        title: "Success", 
        message: "Device added successfully",
        onClose: () => {
          setAlertModal({ isOpen: false, type: "info", title: "", message: "" });
          navigate("/deviceManagement");
        }
      });
    } catch (err) {
      console.error("❌ เพิ่ม device ไม่สำเร็จ", err);
      setAlertModal({ isOpen: true, type: "error", title: "Error", message: "Failed to add device" });
    }
  };

  // class ร่วมให้โทนเหมือน AddUser
  const labelCls = "text-[#002f6c] font-medium mb-1";
  const inputCls =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0DA5D8]";
  const rowCls = "flex flex-col gap-5 md:flex-row";

  // แสดงสถานะที่ปุ่ม dropdown
  const deptSummary =
    form.departments.length === 0
      ? "Select department(s)"
      : form.departments.length <= 2
      ? form.departments.join(", ")
      : `${form.departments.length} selected`;

  return (
    <div className="min-h-screen w-full flex items-start justify-center pt-18 pb-16 lg:pt-24">
      <div className="w-[95%] max-w-[900px] rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-200">
        <h1 className="mb-6 text-xl font-semibold text-gray-800">Add Device</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 */}
          <div className={rowCls}>
            <div className="flex-1 min-w-[240px]">
              <label className={labelCls}>
                Server / Device Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="device_name"
                value={form.device_name}
                onChange={handleChange}
                required
                placeholder="Enter device name"
                className={inputCls}
              />
            </div>

            <div className="flex-1 min-w-[240px]">
              <label className={labelCls}>
                IP Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ip"
                value={form.ip}
                onChange={handleChange}
                required
                placeholder="Enter IP or hostname"
                className={inputCls}
              />
            </div>
          </div>

          {/* Row 2 — Department (multi-select dropdown แบบ AddUser style) */}
          <div className={rowCls}>
            <div className="w-full">
              <label className={labelCls}>
                Department <span className="text-red-500">*</span>
              </label>

              <div className="relative inline-flex w-full" ref={deptMenuRef}>
                <button
                  type="button"
                  onClick={() => setDeptOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={deptOpen}
                  aria-controls="dept-menu"
                  className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-[#0DA5D8]"
                >
                  <span className="truncate text-gray-700">{deptSummary}</span>
                  <SlArrowDown className={`shrink-0 transition ${deptOpen ? "rotate-180" : ""}`} />
                </button>

                {deptOpen && (
                  <ul
                    id="dept-menu"
                    role="listbox"
                    className="absolute left-0 top-[calc(100%+6px)] z-30 w-full max-h-60 overflow-y-auto list-none rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                  >
                    {departmentOptions.map((d) => {
                      const name = d.department_name;
                      const checked = form.departments.includes(name);
                      return (
                        <li
                          key={d.id}
                          role="option"
                          aria-selected={checked}
                          className={`flex h-10 cursor-pointer items-center justify-between px-3 text-sm hover:bg-indigo-50 ${
                            checked ? "bg-indigo-50 font-semibold text-indigo-700" : "text-gray-800"
                          }`}
                          onClick={(e) => {
                            // รองรับคลิกทั้งบรรทัด: toggle ค่า
                            e.preventDefault();
                            toggleDepartment(name);
                          }}
                        >
                          <span className="truncate pr-3">{name}</span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            className="h-4 w-4 pointer-events-none accent-indigo-600"
                          />
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
            <div className="w-full md:max-w-[320px]">
              <label className={labelCls}>
                Max users <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="max_users"
                value={form.max_users}
                onChange={handleChange}
                required
                placeholder="Enter max concurrent users"
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
              onClick={() => navigate("/deviceManagement")}
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

export default AddDevice;
