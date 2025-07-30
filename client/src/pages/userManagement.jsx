import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/userManagement.css";
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
      <div className="user-management-wrapper">
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
                <th>Username</th>
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
      
    
    
    
    `}</style>
    </div>
  );
};

export default UserManagement;
