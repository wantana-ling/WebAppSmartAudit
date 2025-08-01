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
      <div className="device-management-wrapper">
        <div className="top-row">
          <div className="search-filter-row">
            <input
              type="text"
              placeholder="🔍 search..."
              className="user-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
            </select>
            <select onChange={(e) => setFilterDept(e.target.value)} value={filterDept}>
              <option value="">Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.department_name}>
                  {dept.department_name}
                </option>
              ))}
            </select>
          </div>

          <div className="add-button-row">
            <button className="add-user-btn" onClick={() => navigate("/addDevice")}>
              <FaPlus /> ADD
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="scroll-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
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
    .main-container {
      margin-left: 21vw;
      width: 79vw;
      padding: 20px;
      box-sizing: border-box;
    }

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

    .add-button-row {
      display: flex;
      justify-content: flex-end;
      flex-shrink: 0;
    }

    /* === Input + Select === */
    .search-filter-row input[type="text"],
    .search-filter-row select {
      padding: 8px 12px;
      border-radius: 10px;
      border: 1px solid #ccc;
      font-size: 14px;
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
    `}</style>
    </div>
  );
};

export default DeviceManagement;
