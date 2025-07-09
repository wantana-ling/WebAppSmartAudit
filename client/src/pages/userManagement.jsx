import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/userManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  useEffect(() => {
    axios.get(`${apiBase}/api/users`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("❌ ไม่สามารถดึงข้อมูล user:", err);
      });
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchSearch = user.firstname?.includes(searchText) || user.user_id?.toString().includes(searchText);
    const matchDept = departmentFilter ? user.department?.includes(departmentFilter) : true;
    const matchStatus = statusFilter ? user.status === statusFilter : true;
    return matchSearch && matchDept && matchStatus;
  });

  const paddedRows = Math.max(0, rowsPerPage - filteredUsers.length);
  const visibleUsers = filteredUsers.slice(0, rowsPerPage);

  const handleEdit = (user) => {
    console.log("🖊️ Edit user:", user);
  };

  const handleDelete = (userId) => {
    if (window.confirm("❗แน่ใจว่าจะลบผู้ใช้นี้?")) {
      console.log("🗑️ Delete user ID:", userId);
    }
  };

  return (
    <div className="main-container">
      <div className="user-management-wrapper">
        <div className="search-filter-row">
          <input
            type="text"
            placeholder="🔍 search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>

          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
            <option value="">Department</option>
            <option value="Front">Front-IT Infrastructure</option>
            <option value="Back">Back-IT Infrastructure</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Status</option>
            <option value="active">ACTIVE</option>
            <option value="inactive">INACTIVE</option>
          </select>
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
                  <td>{index + 1}</td>
                  <td>{user.user_id}</td>
                  <td>{user.department}</td>
                  <td>{[user.firstname, user.midname, user.lastname].filter(Boolean).join(" ")}</td>
                  <td>
                    <span className={user.status === "active" ? "status-active" : "status-inactive"}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(user)}>✏️</button>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(user.user_id)}>🗑️</button>
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
      </div>
    </div>
  );
};

export default UserManagement;
