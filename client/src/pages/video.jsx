import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/video.css";
import ConfirmModal from "./deleteDepartment"; // ✅ Modal ที่มีปุ่มยืนยัน/ยกเลิก
import {
  FaFileVideo,
  FaAngleLeft,
  FaAngleRight,
  FaTrash
} from "react-icons/fa";

const Video = () => {
  const [sessions, setSessions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false); // ✅ ใช้เปิด modal

  const API_BASE = "http://192.168.121.195:3002";

  const loadSessions = () => {
    axios.get(`${API_BASE}/api/sessions`)
      .then((res) => setSessions(res.data))
      .catch((err) => console.error("❌ โหลด sessions fail:", err));
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    const name = `${s.firstname} ${s.lastname}`.toLowerCase();
    const matchesSearch = name.includes(searchText.toLowerCase());
    const matchesDate = dateFilter ? s.login_time.startsWith(dateFilter) : true;
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredSessions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleSessions = filteredSessions.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const formatDate = (datetimeStr) => {
    return new Date(datetimeStr).toLocaleDateString("en-GB").replaceAll("/", ".");
  };

  const formatTime = (datetimeStr) => {
    return new Date(datetimeStr).toLocaleTimeString("en-GB", { hour12: false });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert("ยังไม่ได้เลือก session ที่จะลบ");
      return;
    }
    setShowModal(true); // ✅ แสดง modal แทน confirm ธรรมดา
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(`${API_BASE}/api/sessions`, {
        data: { ids: selectedIds },
      });
      alert(res.data.message || "ลบสำเร็จ");
      setSelectedIds([]);
      loadSessions();
    } catch (err) {
      console.error("❌ ลบ session fail:", err);
      alert("เกิดข้อผิดพลาดในการลบ session");
    }
    setShowModal(false);
  };

  return (
    <div className="main-container">
      <div className="video-wrapper">
        <div className="top-row">
          <div className="search-filter-row">
            <input
              type="text"
              placeholder="🔍 search..."
              className="user-search-input"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
            <select value={rowsPerPage} onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}>
              <option value={10}>10 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="delete-button-row">
            <button className="delete-btn" onClick={handleDeleteSelected}>
              <FaTrash className="icon" /> DELETE
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="scroll-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Time-In</th>
                <th>Time-Out</th>
                <th>Username</th>
                <th>File.mp4</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {visibleSessions.map((s, idx) => (
                <tr key={s.session_id}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{formatDate(s.login_time)}</td>
                  <td>{formatTime(s.login_time)}</td>
                  <td>{formatTime(s.logout_time)}</td>
                  <td>{s.firstname} {s.lastname}</td>
                  <td>
                    <a
                      href={`${API_BASE}${s.video_path}`}
                      download
                      className="video-icon-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaFileVideo className="video-icon" />.mp4
                    </a>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(s.session_id)}
                      onChange={() => handleCheckboxChange(s.session_id)}
                    />
                  </td>
                </tr>
              ))}
              {visibleSessions.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: "center" }}>ไม่พบข้อมูล</td></tr>
              )}
              {Array.from({ length: Math.max(0, rowsPerPage - visibleSessions.length) }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td colSpan={7} style={{ height: "40px" }}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <FaAngleLeft />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <FaAngleRight />
          </button>
        </div>
      </div>

      {/* ✅ Confirm Modal */}
      {showModal && (
        <ConfirmModal
          isOpen={showModal}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    <style>{`
      
    
    
    
    `}</style>
    </div>
  );
};

export default Video;
