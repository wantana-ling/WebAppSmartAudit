import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Setting = () => {
  const [adServer, setAdServer] = useState("");
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  useEffect(() => {
    axios.get(`${apiBase}/api/ad-config`)
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
    if (!adServer.trim()) return alert("กรุณากรอก AD Server IP / Host Name");

    axios.post(`${apiBase}/api/ad-config`, { serverip_hostname: adServer })
      .then(() => {
        alert("✅ บันทึกสำเร็จ");
      })
      .catch(err => {
        console.error("❌ บันทึกไม่สำเร็จ:", err);
        alert("เกิดข้อผิดพลาด");
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
    </div>
  );
};

export default Setting;
