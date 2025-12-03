import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import AlertModal from "../components/AlertModal";

const Setting = () => {
  const [adServer, setAdServer] = useState("");
  const navigate = useNavigate();
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: "info", title: "", message: "" });

  useEffect(() => {
    api.get('/api/ad-config')
      .then(res => {
        if (res.data && res.data.serverip_hostname) {
          setAdServer(res.data.serverip_hostname);
        }
      })
      .catch(err => {
        console.error("❌ ดึงค่า AD server ล้มเหลว:", err);
      });
  }, []);

  const handleSave = () => {
    if (!adServer.trim()) {
      setAlertModal({ isOpen: true, type: "warning", title: "Warning", message: "Please enter AD Server IP / Host Name" });
      return;
    }

    api.post('/api/ad-config', { serverip_hostname: adServer })
      .then(() => {
        setAlertModal({ isOpen: true, type: "success", title: "Success", message: "Saved successfully" });
      })
      .catch(err => {
        console.error("❌ บันทึกไม่สำเร็จ:", err);
        setAlertModal({ isOpen: true, type: "error", title: "Error", message: "An error occurred" });
      });
  };

  return (
    <div className="h-screen p-6 justify-center items-center flex">
      <div className="w-full max-w-[700px] bg-white p-10 rounded-xl shadow-md border border-gray-300">
        {/* Form Group */}
        <div className="flex flex-col mb-6">
          <label className="text-[15px] text-[#00209F] mb-2">
            AD Server IP / Hostname <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={adServer}
            onChange={(e) => setAdServer(e.target.value)}
            placeholder="Enter AD Server IP or Hostname"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#0DA5D8] outline-none"
          />
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            className="w-32 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors"
            onClick={handleSave}
          >
            SAVE
          </button>
        </div>
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, type: "info", title: "", message: "" })}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
      />
    </div>
  );
};

export default Setting;
