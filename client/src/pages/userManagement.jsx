import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit, FaCircle } from "react-icons/fa";
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

          <div className="add-button-row">
            <button className="add-user-btn" onClick={() => navigate("/addUser")}>
              <FaPlus className="icon" /> ADD
            </button>
          </div>
        </div>

        <div className="table-form">
          <table>
            <thead>
              <tr>
                <th>No.</th>
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
                      <FaCircle/>&nbsp;{user.status.toUpperCase()}
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

    /* === Status Labels === */
    .status-active {
      border-radius: 20px;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .status-active fa-circle {
      color: green;
      font-size: 14px;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .status-inactive {
      border-radius: 20px;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    /* Table part */
    .table-form {
      width: 100%;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .table-form table {
      width: 100%;
      border-collapse: collapse;
    }

    .table-form table thead,
    .table-form table tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }

    .table-form table thead {
      background-color: #f5f5f5;
      position: sticky;
      top: 0;
      z-index: 2;
      border-bottom: 1px solid #ccc;
    }

    .table-form table tbody {
      display: block;
      max-height: 440px;
      overflow-y: scroll;
      scrollbar-width: none;
      -ms-overflow-style: none;
      position: relative;
    }

    .table-form th,
    .table-form td {
      padding: 12px 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-bottom: 1px solid #eee;
    }

    .table-form th:nth-child(1),
    .table-form td:nth-child(1) {
      width: 10%;
      text-align: center;
    }

    .table-form th:nth-child(2),
    .table-form td:nth-child(2) {
      padding-left:1rem;
      width: 10%;
      text-align: left;
    }
    .table-form td:nth-child(3),
    .table-form th:nth-child(3) {
      text-align: left;
      width: 20%;
    }

    .table-form th:nth-child(4),
    .table-form td:nth-child(4) {
      
      text-align: left;
      width: 15%;
    }

    .table-form th:nth-child(5),
    .table-form td:nth-child(5) {
      
      text-align: left;
      width: 20%;
    }

    .table-form th:nth-child(6),
    .table-form td:nth-child(6) {
      width: 10%;
      text-align: left;
    }

    .table-form th:nth-child(7),
    .table-form td:nth-child(7) {
      width: 10%;
      text-align: center;
    }

      /* Table part */

    .edit-btn, .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      transition: 0.2s ease;
    }

    .edit-btn:hover {
      color: #007bff;
    }

    .delete-btn:hover {
      color: #ff3b30;
    }

    .add-button-row {
      margin-left: auto; /* ดันปุ่มไปขวาสุด */
      display: flex;
      align-items: center;
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
      font-size: 14px;
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

export default UserManagement;
