import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmModal from "./deleteDepartment"; // ✅ Modal ที่มีปุ่มยืนยัน/ยกเลิก
import {
  FaFileVideo,
  FaAngleLeft,
  FaAngleRight,
  FaTrash,
  Faplus
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
      <div className="box-container">
        <div className="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1); // reset page ไปหน้าแรกเวลา search
              }}
            />

        </div>
        <div className="filter-box">
            <div className="filter-item">
              <label>Show row</label>
              <select
                      value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1); // reset ไปหน้า 1
                }}
              >
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              
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
    /* === Top Row (Search + Filter + Delete) === */
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
    }

    .search-filter-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      flex: 1;
    }

    .user-search-input {
      width: 50%;
      max-width: 400px;
      min-width: 200px;
    }

    .search-filter-row input[type="text"],
    .search-filter-row input[type="date"],
    .search-filter-row select {
      padding: 8px 12px;
      border-radius: 10px;
      border: 1px solid #ccc;
      font-size: 14px;
    }

    /* === Delete Button === */
    .delete-button-row {
      display: flex;
      justify-content: flex-end;
      flex-shrink: 0;
      margin-top: 40px;
      margin-bottom: -10px;
    }

    .delete-btn {
      background-color: #ef4444 !important;
      color: white !important;
      font-weight: 500;
      border: none;
      border-radius: 6px;
      padding: 4px 12px;
      font-size: 13px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .delete-btn:hover {
      background-color: #dc2626ac;
    }

    /* === Table === */
    .table-container {
      max-height: calc(51px * 10);
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    }

    .scroll-table {
      width: 100%;
      border-collapse: collapse;
      background-color: #fff;
    }

    .scroll-table thead,
    .scroll-table tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }

    .scroll-table tbody {
      display: block;
      overflow-y: auto;
      max-height: none;
    }

    th, td {
      padding: 12px;
      text-align: left;
      vertical-align: middle;
    }

    th {
      background-color: #f0f2fa;
      color: #00209F;
      font-weight: 600;
      font-size: 14px;
    }

    td {
      font-size: 14px;
      color: #333;
      border-top: 1px solid #eee;
    }

    /* === Column Specific === */
    th:nth-child(1), td:nth-child(1) { width: 50px; text-align: center; }
    th:nth-child(2), td:nth-child(2) { width: 100px; text-align: center; }
    th:nth-child(3), td:nth-child(3) { width: 100px; text-align: center; }
    th:nth-child(4), td:nth-child(4) { width: 100px; text-align: center; }
    th:nth-child(5), td:nth-child(5) { width: 150px; text-align: left; }
    th:nth-child(6), td:nth-child(6) { width: 120px; text-align: center; }
    th:nth-child(7), td:nth-child(7) { width: 60px; text-align: center; }

    /* === Download Icon === */
    .video-icon-link {
      color: #007bff;
      text-decoration: none;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .video-icon-link:hover {
      text-decoration: underline;
    }

    /* === Pagination === */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 24px;
      padding-bottom: 30px;
    }

    .pagination button {
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      background-color: white;
      color: #111;
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease, border-color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pagination button:hover:not(:disabled) {
      border-color: #aaa;
    }

    .pagination button.active {
      background-color: #fd924c;
      color: white;
      border-color: #fd924c;
    }

    .pagination button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    
    .filter-box {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }
    .filter-box label {
      font-size: 14px;
      color: #000000;
      margin-right: 8px;
    }
    .filter-item {
      padding: 6px 12px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: #fff;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .filter-item select {
      border: none;
      background: transparent;
      font-size: 14px;
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      padding: 4px 8px;
    }
    `}</style>
    </div>
  );
};

export default Video;
