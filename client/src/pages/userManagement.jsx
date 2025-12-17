import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import DeleteModal from "./deleteUserManagement";


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);


  // dropdown states
  const [rowsOpen, setRowsOpen] = useState(false);
  const rowsMenuRef = useRef(null);
  const [deptOpen, setDeptOpen] = useState(false);
  const deptMenuRef = useRef(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const statusMenuRef = useRef(null);


  const navigate = useNavigate();

  // close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (rowsMenuRef.current && !rowsMenuRef.current.contains(e.target)) setRowsOpen(false);
      if (deptMenuRef.current && !deptMenuRef.current.contains(e.target)) setDeptOpen(false);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    api.get('/api/users')
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error("❌ ไม่สามารถดึงข้อมูล user:", err));

    api.get('/api/departments')
      .then((res) => setDepartments(res.data || []))
      .catch((err) => console.error("❌ โหลด department ไม่ได้:", err));
  }, []);

  // ----- filter + sort เหมือน activevisitor -----
  const filteredUsers = users
    .filter((u) => {
      const matchDept = departmentFilter === "all" || u.department?.includes(departmentFilter);
      const matchStatus = !statusFilter || String(u.status).toLowerCase() === statusFilter.toLowerCase();
      const key = `${u.firstname || ""} ${u.lastname || ""} ${u.name || ""} ${u.user_id || ""}`.toLowerCase();
      const matchSearch = key.includes(searchText.toLowerCase());
      return matchDept && matchStatus && matchSearch;
    })
    .sort((a, b) => Number(a.user_id) - Number(b.user_id))
    .map((u, idx) => ({ ...u, no: idx + 1 }));

  const totalData = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalData / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const confirmDelete = () => {
  if (!selectedUserId) return;
  api.delete(`/api/users/${selectedUserId}`)
    .then(() => api.get('/api/users'))
    .then(res => setUsers(res.data || []))
    .catch(err => console.error("❌ ลบไม่สำเร็จ:", err))
    .finally(() => { setShowModal(false); setSelectedUserId(null); });
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedUserId(null);
  };



  // reset page when filter changes
  useEffect(() => { setCurrentPage(1); }, [searchText, departmentFilter, statusFilter, rowsPerPage]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="mx-auto w-full max-w-[900px] pt-6 lg:pt-10 px-4">  
        {/* Search + Filters (โคลนโทนจาก ActiveVisitor) */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* search */}
            <div className="relative w-full max-w-[520px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400"
                viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0DA5D8] bg-white"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* rows per page dropdown (สไตล์เดียวกับ ActiveVisitor) */}
            <div className="relative inline-flex items-center gap-2" ref={rowsMenuRef}>
              <button
                type="button"
                onClick={() => setRowsOpen(v => !v)}
                aria-haspopup="listbox"
                aria-expanded={rowsOpen}
                aria-controls="rows-menu"
                className="inline-flex h-10 min-w-[130px] items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 shadow-sm hover:shadow-md outline-none focus:ring-2 focus:ring-[#0DA5D8] focus:border-[#0DA5D8] transition-all duration-200"
              >
                <span className="font-medium">Show row</span>
                <span className="text-gray-600">{rowsPerPage}</span>
                <SlArrowDown className={`transition-transform duration-200 ${rowsOpen ? "rotate-180" : ""}`} />
              </button>

              {rowsOpen && (
                <ul
                  id="rows-menu"
                  role="listbox"
                  className="absolute left-0 top-[calc(100%+6px)] z-30 w-full list-none rounded-xl border border-gray-200 bg-white py-1 shadow-lg animate-[pop-in_0.2s_ease]"
                >
                  {[10, 50, 100].map(n => (
                    <li
                      key={n}
                      role="option"
                      aria-selected={rowsPerPage === n}
                      onClick={() => { setRowsPerPage(n); setCurrentPage(1); setRowsOpen(false); }}
                      className={`flex h-9 cursor-pointer items-center justify-between px-3 text-sm transition-colors duration-150 hover:bg-[#0DA5D8]/10 ${
                        rowsPerPage === n ? "bg-[#0DA5D8]/20 font-semibold text-[#0DA5D8]" : "text-gray-800"
                      }`}
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* department dropdown */}
            <div className="relative inline-flex items-center gap-2" ref={deptMenuRef}>
              <button
                type="button"
                onClick={() => setDeptOpen(v => !v)}
                aria-haspopup="listbox"
                aria-expanded={deptOpen}
                aria-controls="dept-menu"
                className="inline-flex h-10 min-w-[240px] items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 shadow-sm hover:shadow-md outline-none focus:ring-2 focus:ring-[#0DA5D8] focus:border-[#0DA5D8] transition-all duration-200"
              >
                <span className="font-medium">Department</span>
                <span className="truncate text-gray-600">
                  {departmentFilter === "all" ? "All" : departmentFilter}
                </span>
                <SlArrowDown className={`transition-transform duration-200 ${deptOpen ? "rotate-180" : ""}`} />
              </button>

              {deptOpen && (
                <ul
                  id="dept-menu"
                  role="listbox"
                  className="absolute left-0 top-[calc(100%+6px)] z-30 w-[240px] max-h-60 overflow-y-auto list-none rounded-xl border border-gray-200 bg-white py-1 shadow-lg animate-[pop-in_0.2s_ease] scrollbar-thin"
                >
                  <li
                    role="option"
                    aria-selected={departmentFilter === "all"}
                    onClick={() => { setDepartmentFilter("all"); setCurrentPage(1); setDeptOpen(false); }}
                    className={`flex h-9 cursor-pointer items-center px-3 text-sm transition-colors duration-150 hover:bg-[#0DA5D8]/10 ${
                      departmentFilter === "all" ? "bg-[#0DA5D8]/20 font-semibold text-[#0DA5D8]" : "text-gray-800"
                    }`}
                  >
                    All
                  </li>
                  {departments.map((d) => (
                    <li
                      key={d.id || d.department_name}
                      role="option"
                      aria-selected={departmentFilter === d.department_name}
                      onClick={() => { setDepartmentFilter(d.department_name); setCurrentPage(1); setDeptOpen(false); }}
                      className={`flex h-9 cursor-pointer items-center px-3 text-sm transition-colors duration-150 hover:bg-[#0DA5D8]/10 ${
                        departmentFilter === d.department_name ? "bg-[#0DA5D8]/20 font-semibold text-[#0DA5D8]" : "text-gray-800"
                      }`}
                    >
                      {d.department_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* status */}
            <div className="relative inline-flex items-center gap-2" ref={statusMenuRef}>
              <button
                type="button"
                onClick={() => setStatusOpen(v => !v)}
                aria-haspopup="listbox"
                aria-expanded={statusOpen}
                aria-controls="status-menu"
                className="inline-flex h-10 min-w-[160px] items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 shadow-sm hover:shadow-md outline-none focus:ring-2 focus:ring-[#0DA5D8] focus:border-[#0DA5D8] transition-all duration-200"
              >
                <span className="font-medium">Status</span>
                <span className="truncate text-gray-600">
                  {statusFilter === "" ? "All" : statusFilter.toUpperCase()}
                </span>
                <SlArrowDown className={`transition-transform duration-200 ${statusOpen ? "rotate-180" : ""}`} />
              </button>

              {statusOpen && (
                <ul
                  id="status-menu"
                  role="listbox"
                  className="absolute left-0 top-[calc(100%+6px)] z-30 w-[160px] max-h-60 overflow-y-auto list-none rounded-xl border border-gray-200 bg-white py-1 shadow-lg animate-[pop-in_0.2s_ease]"
                >
                  <li
                    role="option"
                    aria-selected={statusFilter === ""}
                    onClick={() => { setStatusFilter(""); setCurrentPage(1); setStatusOpen(false); }}
                    className={`flex h-9 cursor-pointer items-center px-3 text-sm transition-colors duration-150 hover:bg-[#0DA5D8]/10 ${
                      statusFilter === "" ? "bg-[#0DA5D8]/20 font-semibold text-[#0DA5D8]" : "text-gray-800"
                    }`}
                  >
                    All
                  </li>
                  <li
                    role="option"
                    aria-selected={statusFilter === "active"}
                    onClick={() => { setStatusFilter("active"); setCurrentPage(1); setStatusOpen(false); }}
                    className={`flex h-9 cursor-pointer items-center px-3 text-sm transition-colors duration-150 hover:bg-[#0DA5D8]/10 ${
                      statusFilter === "active" ? "bg-[#0DA5D8]/20 font-semibold text-[#0DA5D8]" : "text-gray-800"
                    }`}
                  >
                    ACTIVE
                  </li>
                  <li
                    role="option"
                    aria-selected={statusFilter === "inactive"}
                    onClick={() => { setStatusFilter("inactive"); setCurrentPage(1); setStatusOpen(false); }}
                    className={`flex h-9 cursor-pointer items-center px-3 text-sm transition-colors duration-150 hover:bg-[#0DA5D8]/10 ${
                      statusFilter === "inactive" ? "bg-[#0DA5D8]/20 font-semibold text-[#0DA5D8]" : "text-gray-800"
                    }`}
                  >
                    INACTIVE
                  </li>
                </ul>
              )}
            </div>


            <button
              onClick={() => navigate("/addUser")}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
            >
              <FaPlus /> ADD
            </button>
          </div>
        </div>

        {/* Table (หัวตาราง sticky, โทนเดียวกับ ActiveVisitor) */}
        <div className="mx-auto w-full max-w-[900px] rounded-xl bg-white shadow-md ring-1 ring-gray-200 overflow-hidden border border-gray-100">
          <div className="w-full max-h-[500px] overflow-y-auto">
            <table className="w-full h-full border-collapse text-sm table-fixed">
              <thead className="sticky top-0 z-10 bg-[#eef2fa] text-[#1B2880] border-b border-gray-200 shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)]">
                <tr className="table w-full table-fixed">
                  <th className="w-[8%] py-2.5 text-center px-2 font-medium text-xs">No.</th>
                  <th className="w-[12%] py-2.5 text-left px-3 font-medium text-xs">UserID</th>
                  <th className="w-[22%] py-2.5 text-left px-3 font-medium text-xs">Department</th>
                  <th className="w-[28%] py-2.5 text-left px-3 font-medium text-xs">Name</th>
                  <th className="w-[12%] py-2.5 text-left px-2 font-medium text-xs">Status</th>
                  <th className="w-[9%] py-2.5 text-center px-2 font-medium text-xs">Edit</th>
                  <th className="w-[9%] py-2.5 text-center px-2 font-medium text-xs">Delete</th>
                </tr>
              </thead>

              {/* ล็อคความสูง ~10 แถวเหมือน activevisitor */}
              <tbody className="block min-h-[400px] max-h-[500px] overflow-y-auto">
                {visibleUsers.length === 0 ? (
                  <tr className="table w-full table-fixed">
                    <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">No data found</td>
                  </tr>
                ) : (
                  visibleUsers.map((u, idx) => (
                    <tr
                      key={u.user_id ?? u.userId ?? idx}
                      className="table w-full table-fixed border-b border-gray-200 odd:bg-white even:bg-[#FBFCFD] hover:bg-[#F7FAFC] transition-colors"
                    >
                      <td className="w-[8%] px-2 py-2.5 text-center align-middle text-xs">{startIndex + idx + 1}</td>
                      <td className="w-[12%] px-3 py-2.5 align-middle text-xs">{u.user_id ?? u.userId}</td>
                      <td className="w-[22%] px-3 py-2.5 align-middle text-xs truncate">{u.department}</td>
                      <td className="w-[28%] px-3 py-2.5 align-middle text-xs truncate">{u.name ?? `${u.firstname || ""} ${u.midname || ""} ${u.lastname || ""}`.trim()}</td>
                      <td className="w-[12%] px-2 py-2.5 align-middle">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                          ${String(u.status).toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          <svg viewBox="0 0 8 8" className="w-1.5 h-1.5 fill-current"><circle cx="4" cy="4" r="4"/></svg>
                          {String(u.status).toUpperCase()}
                        </span>
                      </td>
                      <td className="w-[9%] px-2 py-2.5 text-center align-middle">
                        <button
                          onClick={() => navigate(`/editManageUser/${u.user_id}`)}
                          className="text-blue-600 hover:text-blue-700"
                          aria-label="Edit"
                        >
                          <FaEdit className="mx-auto text-sm" />
                        </button>
                      </td>
                      <td className="w-[9%] px-2 py-2.5 text-center align-middle">
                        <button
                          onClick={() => handleDelete(u.user_id)}
                          className="text-red-600 hover:text-red-700"
                          aria-label="Delete"
                        >
                          <FaTrash className="mx-auto text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {showModal && (
              <DeleteModal
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
              />
            )}

          </div>
        </div>

        {/* Pagination */}
        <div className="mx-auto mt-4 flex max-w-[900px] flex-wrap items-center justify-center gap-1.5">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white hover:border-[#0DA5D8] hover:shadow-md disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:border-gray-300 disabled:hover:shadow-none"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white hover:border-[#0DA5D8] hover:shadow-md disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:border-gray-300 disabled:hover:shadow-none"
          >
            {"<"}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:shadow-md ${
                page === currentPage
                  ? "bg-gradient-to-r from-[#0DA5D8] to-[#1A2DAC] text-white border-[#0DA5D8] font-semibold shadow-md"
                  : "bg-white border-gray-300 hover:bg-[#0DA5D8] hover:text-white hover:border-[#0DA5D8]"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white hover:border-[#0DA5D8] hover:shadow-md disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:border-gray-300 disabled:hover:shadow-none"
          >
            {">"}
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white hover:border-[#0DA5D8] hover:shadow-md disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:border-gray-300 disabled:hover:shadow-none"
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
