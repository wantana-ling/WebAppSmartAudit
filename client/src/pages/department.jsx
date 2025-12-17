import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import api from "../api";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./deleteDepartment";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // dropdown สำหรับ Show row (สไตล์เดียวกับ ActiveVisitor)
  const [rowsOpen, setRowsOpen] = useState(false);
  const rowsMenuRef = useRef(null);

  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const fetchDepartments = () => {
    api
      .get('/api/departments')
      .then((res) => setDepartments(res.data || []))
      .catch((err) => console.error("❌ โหลด department ไม่ได้", err));
  };

  useEffect(() => { fetchDepartments(); }, []);

  // ปิด dropdown เมื่อคลิกนอกกรอบ
  useEffect(() => {
    const handler = (e) => {
      if (rowsMenuRef.current && !rowsMenuRef.current.contains(e.target)) setRowsOpen(false);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  // filter + sort + index เหมือน pattern ของ activevisitor
  const filtered = departments
    .filter((d) => (d?.department_name || "").toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => String(a.department_name).localeCompare(String(b.department_name)))
    .map((d, i) => ({ ...d, no: i + 1 }));

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageData = filtered.slice(startIndex, startIndex + rowsPerPage);



  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };
  const confirmDelete = () => {
    if (!selectedId) return;
    api
      .delete(`/api/departments/${selectedId}`)
      .then(() => { setShowModal(false); setSelectedId(null); fetchDepartments(); })
      .catch((err) => { console.error("❌ ลบไม่สำเร็จ:", err); setShowModal(false); });
  };
  const cancelDelete = () => { setShowModal(false); setSelectedId(null); };

  // reset หน้าเมื่อเงื่อนไขเปลี่ยน
  useEffect(() => { setCurrentPage(1); }, [searchText, rowsPerPage]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="mx-auto w-full max-w-[900px] pt-6 lg:pt-10 px-4">
        {/* Search + Filters (สไตล์ ActiveVisitor) */}
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* Search bar with icon */}
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
                placeholder="Search department..."
                className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0DA5D8]"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Show row (custom dropdown แบบเดียวกัน) */}
            <div className="relative inline-flex items-center gap-2" ref={rowsMenuRef}>
              <button
                type="button"
                onClick={() => setRowsOpen((v) => !v)}
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
                  {[10, 50, 100].map((n) => (
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

            {/* ปุ่ม ADD */}
            <div className="ml-auto">
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                onClick={() => navigate("/addDepartment")}
              >
                <FaPlus /> ADD
              </button>
            </div>
          </div>
        </div>

        {/* การ์ดตาราง (หัว sticky + เลื่อน tbody) */}
        <div className="mx-auto w-full max-w-[900px] rounded-xl bg-white shadow-md ring-1 ring-gray-200 overflow-hidden border border-gray-100">
          <div className="w-full max-h-[500px] overflow-y-auto">
            <table className="w-full h-full border-collapse text-sm table-fixed">
              <thead className="sticky top-0 z-10 bg-[#eef2fa] text-[#1B2880] border-b border-gray-200 shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)]">
                <tr className="table w-full table-fixed">
                  <th className="w-[13%] py-2.5 text-center px-2 font-medium text-xs">No.</th>
                  <th className="w-[40%] py-2.5 text-center px-3 font-medium text-xs">Department Name</th>
                  <th className="w-[23%] py-2.5 text-center px-2 font-medium text-xs">Edit</th>
                  <th className="w-[24%] py-2.5 text-center px-2 font-medium text-xs">Delete</th>
                </tr>
              </thead>

              <tbody className="block min-h-[400px] max-h-[500px] overflow-y-auto">
                {pageData.length === 0 ? (
                  <tr className="table w-full table-fixed">
                    <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">No data found</td>
                  </tr>
                ) : (
                  pageData.map((d, i) => (
                    <tr
                      key={d.id}
                      className="table w-full table-fixed border-b border-gray-200 odd:bg-white even:bg-[#FBFCFD] hover:bg-[#F7FAFC] transition-colors"
                    >
                      <td className="w-[13%] px-2 py-2.5 text-center align-middle text-xs">{startIndex + i + 1}</td>
                      <td className="w-[40%] px-3 py-2.5 text-center align-middle text-xs truncate">{d.department_name}</td>
                      <td className="w-[23%] px-2 py-2.5 text-center align-middle">
                        <button
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => navigate(`/editDepartment/${d.id}`)}
                          aria-label="Edit"
                        >
                          <FaEdit className="mx-auto text-sm" />
                        </button>
                      </td>
                      <td className="w-[24%] px-2 py-2.5 text-center align-middle">
                        <button
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteClick(d.id)}
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

        {/* Confirm Modal */}
        {showModal && (
          <ConfirmModal
            isOpen={showModal}
            onCancel={cancelDelete}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Department;
