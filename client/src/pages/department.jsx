import React, { useEffect, useState } from "react";
import "../css/department.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const paddedRows = Math.max(0, rowsPerPage - filtered.length);

  return (
    <div className="main-container">
      <div className="department-wrapper">
        <div className="top-row">
          <div className="search-filter-row">
            <input
              type="text"
              placeholder="🔍 search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
              <option value={5}>Show row 5</option>
              <option value={10}>Show row 10</option>
            </select>
          </div>
          <div className="add-button-row">
            <button className="add-user-btn" onClick={() => navigate("/addDepartment")}> <FaPlus /> ADD </button>
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
                  <td>{d.name}</td>
                  <td>
                    <button className="edit-btn">
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button className="delete-btn">
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
    </div>
  );
};

export default Department;
