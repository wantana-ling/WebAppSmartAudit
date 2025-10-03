import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import axios from "axios";
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
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const fetchDepartments = () => {
    axios
      .get(`${apiBase}/api/departments`)
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

  // ล็อคความสูงให้ไม่หด (โทนเดียวกับ activevisitor)
  const ROWS_LOCK_MIN = 10;
  const minRows = Math.max(ROWS_LOCK_MIN, rowsPerPage);
  const placeholderCount = Math.max(0, minRows - pageData.length);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };
  const confirmDelete = () => {
    if (!selectedId) return;
    axios
      .delete(`${apiBase}/api/departments/${selectedId}`)
      .then(() => { setShowModal(false); setSelectedId(null); fetchDepartments(); })
      .catch((err) => { console.error("❌ ลบไม่สำเร็จ:", err); setShowModal(false); });
  };
  const cancelDelete = () => { setShowModal(false); setSelectedId(null); };

  // reset หน้าเมื่อเงื่อนไขเปลี่ยน
  useEffect(() => { setCurrentPage(1); }, [searchText, rowsPerPage]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="mx-auto w-full max-w-[1080px] pt-10 lg:pt-20">
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
                className="inline-flex h-10 min-w-[130px] items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
              >
                <span className="font-medium">Show row</span>
                <span className="text-gray-600">{rowsPerPage}</span>
                <SlArrowDown className={`transition ${rowsOpen ? "rotate-180" : ""}`} />
              </button>

              {rowsOpen && (
                <ul
                  id="rows-menu"
                  role="listbox"
                  className="absolute left-0 top-[calc(100%+6px)] z-30 w-full list-none rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                >
                  {[10, 50, 100].map((n) => (
                    <li
                      key={n}
                      role="option"
                      aria-selected={rowsPerPage === n}
                      onClick={() => { setRowsPerPage(n); setCurrentPage(1); setRowsOpen(false); }}
                      className={`flex h-9 cursor-pointer items-center justify-between px-3 text-sm hover:bg-indigo-50 ${
                        rowsPerPage === n ? "bg-indigo-50 font-semibold text-indigo-700" : "text-gray-800"
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
        <div className="mx-auto w-full max-w-[1080px] rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <div className="w-full max-h-[640px] overflow-y-auto">
            <table className="w-full h-full border-collapse text-sm table-fixed">
              <thead className="sticky top-0 z-10 bg-[#f9fafc] text-[#1B2880] border-b border-gray-200">
                <tr className="table w-full table-fixed">
                  <th className="w-[13%] py-3 text-center font-semibold">No.</th>
                  <th className="w-[40%] py-3 text-center font-semibold">Department Name</th>
                  <th className="w-[20%] py-3 text-center font-semibold">Edit</th>
                  <th className="w-[20%] py-3 text-center font-semibold">Delete</th>
                </tr>
              </thead>

              <tbody className="block min-h-[500px] max-h-[640px] overflow-y-auto">
                {pageData.length === 0 ? (
                  <tr className="table w-full table-fixed">
                    <td colSpan={4} className="py-6 text-center text-gray-500">ไม่พบข้อมูล</td>
                  </tr>
                ) : (
                  pageData.map((d, i) => (
                    <tr
                      key={d.id}
                      className="table w-full table-fixed border-b border-gray-200 odd:bg-white even:bg-[#FBFCFD] hover:bg-[#F7FAFC] transition-colors"
                    >
                      <td className="w-[13%] px-4 py-3 text-center">{startIndex + i + 1}</td>
                      <td className="w-[40%] px-4 py-3 text-center">{d.department_name}</td>
                      <td className="w-[20%] px-4 py-3 text-center">
                        <button
                          className="rounded-full p-2 text-blue-600 hover:bg-blue-50"
                          onClick={() => navigate(`/editDepartment/${d.id}`)}
                        >
                          <FaEdit />
                        </button>
                      </td>
                      <td className="w-[20%] px-4 py-3 text-center">
                        <button
                          className="rounded-full p-2 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteClick(d.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* Pagination (โทนเดียวกับ ActiveVisitor) */}
        <div className="mx-auto mt-5 flex max-w-[980px] flex-wrap items-center justify-center gap-1.5">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white"
          >
            {"<"}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`min-w-9 rounded-lg border px-3 py-1.5 text-sm transition hover:bg-[#0DA5D8] hover:text-white ${
                page === currentPage
                  ? "bg-[#0DA5D8] text-white border-[#0DA5D8] font-semibold"
                  : "bg-white border-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white"
          >
            {">"}
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white"
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
