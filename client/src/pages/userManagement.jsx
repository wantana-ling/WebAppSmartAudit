import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import DeleteUserManagement from "./deleteUserManagement";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  useEffect(() => {
    axios.get(`${apiBase}/api/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("❌ ไม่สามารถดึงข้อมูล user:", err));

    axios.get(`${apiBase}/api/departments`)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("❌ โหลด department ไม่ได้:", err));
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchSearch = user.firstname?.includes(searchText) || user.user_id?.toString().includes(searchText);
    const matchDept = departmentFilter ? user.department?.includes(departmentFilter) : true;
    const matchStatus = statusFilter ? user.status === statusFilter : true;
    return matchSearch && matchDept && matchStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${apiBase}/api/users/${selectedUserId}`);
      setUsers(users.filter(user => user.user_id !== selectedUserId));
      setShowDeleteModal(false);
      setSelectedUserId(null);
    } catch (err) {
      console.error("❌ ลบไม่สำเร็จ:", err);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUserId(null);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="main-container">
      <div className="box-container">
        <div className="top-row">
          <div className="search-filter-row">
            <input
              type="text"
              placeholder="🔍 search..."
              className="user-search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <select value={rowsPerPage} onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}>
              <option value={10}>10 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>

            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
              <option value="">Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.department_name}>{d.department_name}</option>
              ))}
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Status</option>
              <option value="active">ACTIVE</option>
              <option value="inactive">INACTIVE</option>
            </select>
          </div>

          <div className="add-button-row">
            <button className="add-user-btn" onClick={() => navigate("/addUser")}> 
              <FaPlus className="icon" /> ADD
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="scroll-table">
            <thead>
              <tr>
                <th>no.</th>
                <th>UserID</th>
                <th>Department</th>
                <th>Name</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user, index) => (
                <tr key={user.user_id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{user.user_id}</td>
                  <td>{user.department}</td>
                  <td>{[user.firstname, user.midname, user.lastname].filter(Boolean).join(" ")}</td>
                  <td>
                    <span className={user.status === "active" ? "status-active" : "status-inactive"}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => navigate(`/editManageUser/${user.user_id}`)}>
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(user.user_id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {Array.from({ length: Math.max(0, rowsPerPage - visibleUsers.length) }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td colSpan={7} style={{ height: "40px" }}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
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
            &gt;
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteUserManagement
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    <style>{`

    /* === Wrapper กลาง + ขนาดจำกัด === */
    .user-management-wrapper {
      width: 100%;
      max-width: 1100px;
      background-color: #ffffff;
      font-family: 'Prompt', sans-serif;
      margin-top: 50px;
      margin-left: 0;
      margin-right: 0;
      margin-bottom: auto;
    }

    /* === Search + Filters === */
    .search-filter-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .user-search-input {
      width: 50%;
      max-width: 400px;
      min-width: 200px;
    }

    .search-filter-row input[type="text"],
    .search-filter-row select {
      padding: 8px 12px;
      border-radius: 10px;
      border: 1px solid #ccc;
      font-size: 14px;
    }

    /* === Table === */
    table {
      width: 100%;
      border-collapse: collapse;
      background-color: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    th, td {
      padding: 10px 8px; /* ลด padding รวม */
      text-align: left;
      vertical-align: middle;
      padding: 12px 12px;
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
      vertical-align: middle;
    }

    /* === Table spacing / alignment ปรับตามภาพ === */
    th:nth-child(1),
    td:nth-child(1) {
      width: 50px;  /* no. */
      text-align: center;
      padding-left: 4px;
    }

    th:nth-child(2),
    td:nth-child(2) {
      width: 80px;  /* UserID */
      text-align: center;
    }

    th:nth-child(3),
    td:nth-child(3) {
      width: 150px;
      text-align: center;  /* Department */
    }

    th:nth-child(4),
    td:nth-child(4) {
      width: 150px;  /* Username */
      white-space: nowrap;
      overflow: hidden;
      text-align: left;
    }

    th:nth-child(5),
    td:nth-child(5) {
      width: 50px;  /* Status */
      text-align: left;
    }

    th:nth-child(6),
    td:nth-child(6),
    th:nth-child(7) {
      width: 40px;  /* Edit / Delete */
      text-align: center;
      vertical-align: middle;
    }

    th:nth-child(6),
    th:nth-child(7) {
        padding-left: 0px;
    }

    td:nth-child(7) {
        width: 40px;
        text-align: center;
        vertical-align: middle;
    }
    /* === Status Labels === */
    .status-active {
      background-color: #4cd964;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .status-inactive {
      background-color: #ff3b30;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    /* === Scroll Table === */
    .table-container {
      max-height: calc(51px * 10);
      overflow-y: auto;
      border: 1px solid #ddd;        /* ✅ ขอบนอกสุด */
      border-radius: 12px;           /* ✅ มุมมน */
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    }

    .scroll-table thead,
    .scroll-table tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }

    .scroll-table {
      border-collapse: collapse;
      width: 100%;
    }

    .scroll-table tbody {
      display: block;
      max-height: none;
      overflow-y: auto;
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

    .edit-btn:hover {
      color: #007bff;
    }

    .delete-btn:hover {
      color: #ff3b30;
    }

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
      margin-top: 40px;
      margin-bottom: -10px;
    }

    .add-user-btn {
      background-color: var(--green-color);
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

    /* === Pagination === */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 24px;
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
    `}</style>
    </div>
  );
};

export default UserManagement;
