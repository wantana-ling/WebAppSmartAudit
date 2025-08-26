import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import DeleteUserManagement from "./deleteUserManagement";

const mockData = [
  { no: 1, userId: '40001', department: 'Front-IT Infrastructure', name: 'James Anderson', status: 'Active' },
  { no: 2, userId: '40002', department: 'Back-IT Infrastructure', name: 'Emily Johnson', status: 'Inactive' },
  { no: 3, userId: '40003', department: 'Network Operations', name: 'William Smith', status: 'Active' },
  { no: 4, userId: '40004', department: 'Database Management', name: 'Olivia Brown', status: 'Inactive' },
  { no: 5, userId: '40005', department: 'Security Operations', name: 'Benjamin Lee', status: 'Active' },
  { no: 6, userId: '40006', department: 'Cloud Services', name: 'Sophia Wilson', status: 'Active' },
  { no: 7, userId: '40007', department: 'Technical Support', name: 'Daniel Taylor', status: 'Inactive' },
  { no: 8, userId: '40008', department: 'Software Development', name: 'Mia Davis', status: 'Active' },
  { no: 9, userId: '40009', department: 'Front-IT Infrastructure', name: 'Alexander Moore', status: 'Active' },
  { no: 10, userId: '40010', department: 'Back-IT Infrastructure', name: 'Charlotte Martinez', status: 'Inactive' },
  { no: 11, userId: '40011', department: 'Network Operations', name: 'Michael Thomas', status: 'Active' },
  { no: 12, userId: '40012', department: 'Database Management', name: 'Amelia Garcia', status: 'Inactive' },
  { no: 13, userId: '40013', department: 'Security Operations', name: 'Elijah Rodriguez', status: 'Active' },
  { no: 14, userId: '40014', department: 'Cloud Services', name: 'Harper Martinez', status: 'Active' },
  { no: 15, userId: '40015', department: 'Technical Support', name: 'Lucas Hernandez', status: 'Inactive' },
  { no: 16, userId: '40016', department: 'Software Development', name: 'Evelyn Lopez', status: 'Active' },
  { no: 17, userId: '40017', department: 'Front-IT Infrastructure', name: 'Henry Clark', status: 'Inactive' },
  { no: 18, userId: '40018', department: 'Back-IT Infrastructure', name: 'Abigail Lewis', status: 'Active' },
  { no: 19, userId: '40019', department: 'Network Operations', name: 'Sebastian Young', status: 'Inactive' },
  { no: 20, userId: '40020', department: 'Database Management', name: 'Emily Hall', status: 'Active' },
  { no: 21, userId: '40021', department: 'Security Operations', name: 'Jack Allen', status: 'Inactive' },
  { no: 22, userId: '40022', department: 'Cloud Services', name: 'Lily Wright', status: 'Active' },
  { no: 23, userId: '40023', department: 'Technical Support', name: 'Owen Scott', status: 'Active' },
  { no: 24, userId: '40024', department: 'Software Development', name: 'Zoey Adams', status: 'Inactive' },
  { no: 25, userId: '40025', department: 'Front-IT Infrastructure', name: 'Leo Nelson', status: 'Active' },
  { no: 26, userId: '40026', department: 'Back-IT Infrastructure', name: 'Aria Baker', status: 'Active' },
  { no: 27, userId: '40027', department: 'Network Operations', name: 'David Gonzalez', status: 'Inactive' },
  { no: 28, userId: '40028', department: 'Database Management', name: 'Grace Perez', status: 'Active' },
  { no: 29, userId: '40029', department: 'Security Operations', name: 'Nathan Hill', status: 'Inactive' },
  { no: 30, userId: '40030', department: 'Cloud Services', name: 'Avery Rivera', status: 'Active' }
];


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

  const filteredUsers = mockData.filter((user) => {
    const matchSearch = user.firstname?.includes(searchText) || user.user_id?.toString().includes(searchText);
    const matchDept = departmentFilter ? user.department?.includes(departmentFilter) : true;
    const matchStatus = statusFilter ? user.status === statusFilter : true;
    return matchSearch && matchDept && matchStatus;
  });


  const totalPages = Math.ceil(mockData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleUsers = mockData.slice(startIndex, startIndex + rowsPerPage);

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

            <div className="filter-item">
              <label>Department</label>
              <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                <option value="">Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.department_name}>{d.department_name}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">Status</option>
                  <option value="active">ACTIVE</option>
                  <option value="inactive">INACTIVE</option>
              </select>
            </div>
          </div>
          <div className="add-user-container">
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
                <tr key={user.userId}>
                  <td>{startIndex + index + 1}</td>
                  <td>{user.userId}</td>
                  <td>{user.department}</td>
                  <td>{user.name}</td>
                  {/* <td>{[user.firstname, user.midname, user.lastname].filter(Boolean).join(" ")}</td> */}
                  <td>
                    <span className={user.status === "Active" ? "status-active" : "status-inactive"}>
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
              {Array.from({ length: Math.max(0, rowsPerPage - mockData.length) }).map((_, idx) => (
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
    .search-box {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 6px;
        width: 60%;
        box-sizing: border-box;
        padding: 5px;
    }
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
      gap: 20px;
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
    
    .add-user-container {
      margin-left: auto;
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

    .search-input {
      all: unset;
      width: 100%;
      padding: 5px;
      border-radius: 6px;
      font-size: 14px;
    }

    .size-6 {
      height: 2rem;
      color: #b4b4b4;
      padding-right: 5px;
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

export default UserManagement;
