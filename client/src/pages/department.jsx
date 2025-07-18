import React, { useEffect, useState } from "react";
import "../css/department.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./deleteDepartment"; // ✅ import modal

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false); // ✅ ใช้ตัวเดียวให้ตรงกัน

  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const fetchDepartments = () => {
    axios
      .get(`${apiBase}/api/departments`)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("❌ โหลด department ไม่ได้", err));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filtered = departments.filter((d) =>
    (d?.department_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const paddedRows = Math.max(0, rowsPerPage - filtered.length);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    axios
      .delete(`${apiBase}/api/departments/${selectedId}`)
      .then(() => {
        console.log("✅ ลบสำเร็จ");
        setShowModal(false);
        setSelectedId(null);
        fetchDepartments();
      })
      .catch((err) => {
        console.error("❌ ลบไม่สำเร็จ:", err);
        setShowModal(false);
      });
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  return (
    <div className="main-container">
      <div className="department-wrapper">
        <div className="top-row">
          <div className="search-filter-row">
            <input
              type="text"
              placeholder="🔍 search..."
              className="user-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value={5}>Show row 5</option>
              <option value={10}>Show row 10</option>
            </select>
          </div>
          <div className="add-button-row">
            <button
              className="add-user-btn"
              onClick={() => navigate("/addDepartment")}
            >
              <FaPlus /> ADD
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="scroll-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Department Name</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, rowsPerPage).map((d, i) => (
                <tr key={d.id}>
                  <td>{i + 1}</td>
                  <td>{d.department_name}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/editDepartment/${d.id}`)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(d.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {Array.from({ length: paddedRows }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td colSpan={4} style={{ height: "40px" }}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal confirm ลบ */}
      {showModal && (
        <ConfirmModal
          isOpen={showModal}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default Department;
