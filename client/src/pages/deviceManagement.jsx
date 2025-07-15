import React, { useEffect, useState } from "react";
import "../css/deviceManagement.css";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import ConfirmModal from "./deleteDevice";

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
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
  }, []);

  const fetchDevices = () => {
    axios.get(`${apiBase}/api/devices`)
      .then((res) => setDevices(res.data))
      .catch((err) => console.error("❌ โหลด devices ไม่ได้", err));
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
              <option value="Accounting">Accounting</option>
              <option value="Sales">Sales</option>
              <option value="IT Support">IT Support</option>
              <option value="Development">Development</option>
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
                    <button className="edit-btn" onClick={() => navigate("/editDevice")}><FaEdit /></button>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteClick(d.id)}><FaTrash /></button>
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
    </div>
  );
};

export default DeviceManagement;
