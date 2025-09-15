import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import ConfirmModal from "./deleteDevice";

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  useEffect(() => {
    fetchDevices();
    fetchDepartments();
  }, []);

  const fetchDevices = () => {
    axios.get(`${apiBase}/api/devices`)
      .then((res) => setDevices(res.data))
      .catch((err) => console.error("❌ โหลด devices ไม่ได้", err));
  };

  const fetchDepartments = () => {
    axios.get(`${apiBase}/api/departments`)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("❌ โหลด departments ไม่ได้", err));
  };

  const filteredDevices = devices.filter(d =>
    (d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.ip?.includes(search)) &&
    (!filterDept || d.department === filterDept)
  );

  const totalPages = Math.ceil(filteredDevices.length / rowsPerPage);
  const paginated = filteredDevices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const paddedRows = Math.max(0, rowsPerPage - paginated.length);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    axios.delete(`${apiBase}/api/devices/${selectedId}`)
      .then(() => {
        console.log("✅ ลบสำเร็จ");
        setShowModal(false);
        setSelectedId(null);
        fetchDevices();
      })
      .catch(err => {
        console.error("❌ ลบไม่สำเร็จ:", err);
        setShowModal(false);
      });
  };

  return (
    <div className="main-container">
      <div className="box-container">
        <div className="top-row">
          <div className="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
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

            <div className="filter-item">
              <label>Department</label>
              <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                <option value="">Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.department_name}>{d.department_name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="add-user-container">
              <button className="add-user-btn" onClick={() => navigate("/addDevice")}> 
                <FaPlus className="icon" /> ADD
              </button>
          </div>
        </div>

        <div className="table-container">
          <table className="scroll-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Server / Device Name</th>
                <th>IP / Hostname</th>
                <th>Department</th>
                <th>Active Users</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((d, i) => (
                <tr key={d.id}>
                  <td>{(currentPage - 1) * rowsPerPage + i + 1}</td>
                  <td>{d.name}</td>
                  <td>{d.ip}</td>
                  <td>{d.department}</td>
                  <td>{d.active_users}</td>
                  <td>
                    <button className="edit-btn" onClick={() => navigate(`/editDevice/${d.id}`)}><FaEdit /></button>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteClick(d.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {Array.from({ length: paddedRows }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td colSpan={7} style={{ height: "40px" }}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ConfirmModal
          isOpen={showModal}
          onCancel={() => setShowModal(false)}
          onConfirm={confirmDelete}
        />
      </div>
    <style>{`


    /* === Wrapper กลาง + ขนาดจำกัด === */
    .device-management-wrapper {
      width: 100%;
      max-width: 1100px;
      background-color: #ffffff;
      font-family: 'Prompt', sans-serif;
      margin-top: 50px;
      margin-left: 0;
      margin-right: 0;
      margin-bottom: auto;
    }

    /* === กล่องควบคุมด้านบน === */
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .user-search-input {
      width: 50%;
      max-width: 400px;
      min-width: 200px;
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

    /* === Column Widths === */
    th:nth-child(1), td:nth-child(1) { width: 20px; text-align: center; }
    th:nth-child(2), td:nth-child(2) { width: 50px; text-align: left; }
    th:nth-child(3), td:nth-child(3) { width: 100px; text-align: left; }
    th:nth-child(4), td:nth-child(4) { width: 200px; text-align: left; }
    th:nth-child(5), td:nth-child(5) { width: 20px; text-align: center; }
    th:nth-child(6), td:nth-child(6) { width: 20px;}
    th:nth-child(7), td:nth-child(7) {
      width: 20px;
      text-align: center;
      vertical-align: middle;
    }

    /* === ปุ่ม Edit/Delete === */
    .edit-btn, .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      transition: 0.2s ease;
    }

    .edit-btn:hover { color: #007bff; }
    .delete-btn:hover { color: #ff3b30; }

    /* === ปุ่ม Add === */
    .add-user-btn {
      background-color: #22c55e;
      color: white;
      font-weight: 500;
      border: none;
      border-radius: 6px;
      padding: 4px 12px;
      font-size: 13px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .add-user-btn:hover {
      background-color: #16a34a;
    }
        .filter-box {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
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

    .filter-box label {
      font-size: 14px;
      color: #000000;
      margin-right: 8px;
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

export default DeviceManagement;
