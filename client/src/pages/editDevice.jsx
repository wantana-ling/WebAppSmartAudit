import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import AlertModal from "../components/AlertModal";

const EditDevice = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    device_name: "",
    ip: "",
    departments: [],
    max_users: "",
  });

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: "info", title: "", message: "" });

  useEffect(() => {
    api.get('/api/departments/')
      .then(res => setDepartmentOptions(res.data || []))
      .catch(err => console.error("❌ โหลด department ไม่ได้", err));
  }, []);

  useEffect(() => {
    api.get(`/api/devices/${id}`)
      .then(res => {
        const d = res.data;
        setForm({
          device_name: d.device_name || "",
          ip: d.ip || "",
          departments: d.department ? d.department.split(",").map(x => x.trim()) : [],
          max_users: d.max_users || "",
        });
      })
      .catch(err => {
        console.error("❌ โหลด device ไม่สำเร็จ", err);
        setAlertModal({ 
          isOpen: true, 
          type: "error", 
          title: "Error", 
          message: "Device not found",
          onClose: () => {
            setAlertModal({ isOpen: false, type: "info", title: "", message: "" });
            navigate("/deviceManagement");
          }
        });
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleDepartment = (value) => {
    setForm(prev => {
      const has = prev.departments.includes(value);
      return {
        ...prev,
        departments: has
          ? prev.departments.filter(d => d !== value)
          : [...prev.departments, value],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.device_name || !form.ip || form.departments.length === 0 || !form.max_users) {
      setAlertModal({ isOpen: true, type: "warning", title: "Warning", message: "Please fill in all fields" });
      return;
    }

    try {
      await api.put(`/api/devices/${id}`, {
        device_name: form.device_name,
        ip: form.ip,
        department: form.departments.join(", "),
        max_users: form.max_users,
      });
      setAlertModal({ 
        isOpen: true, 
        type: "success", 
        title: "Success", 
        message: "Device updated successfully",
        onClose: () => {
          setAlertModal({ isOpen: false, type: "info", title: "", message: "" });
          navigate("/deviceManagement");
        }
      });
    } catch (err) {
      console.error("❌ แก้ไขไม่สำเร็จ", err);
      setAlertModal({ isOpen: true, type: "error", title: "Error", message: "Failed to save changes" });
    }
  };

  // class reuse
  const labelCls = "text-[#002f6c] font-medium mb-1";
  const inputCls =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0DA5D8]";
  const rowCls = "flex flex-col gap-5 md:flex-row";

  return (
    <div className="min-h-screen w-full flex items-start justify-center pt-12 pb-16">
      <div className="w-[95%] max-w-[900px] rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-gray-200">
        <h1 className="mb-6 text-xl font-semibold text-gray-800">Edit Device</h1>

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

          {/* Row 2 — Department multi-select */}
          <div className={rowCls}>
            <div className="w-full">
              <label className={labelCls}>
                Department <span className="text-red-500">*</span>
              </label>
              <div className="rounded-xl border border-gray-300 bg-gray-50 p-4 flex flex-wrap gap-4">
                {departmentOptions.map((d) => {
                  const checked = form.departments.includes(d.department_name);
                  return (
                    <label
                      key={d.id}
                      className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={d.department_name}
                        checked={checked}
                        onChange={() => toggleDepartment(d.department_name)}
                        className="h-4 w-4 accent-indigo-600"
                      />
                      {d.department_name}
                    </label>
                  );
                })}
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
              SAVE
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

export default EditDevice;
