import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import api from "../api";
import ConfirmModal from "./deleteDevice";

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [rowsOpen, setRowsOpen] = useState(false);
  const rowsMenuRef = useRef(null);
  const [deptOpen, setDeptOpen] = useState(false);
  const deptMenuRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (rowsMenuRef.current && !rowsMenuRef.current.contains(e.target)) setRowsOpen(false);
      if (deptMenuRef.current && !deptMenuRef.current.contains(e.target)) setDeptOpen(false);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    api.get('/api/devices').then(r => setDevices(r.data || [])).catch(console.error);
    api.get('/api/departments').then(r => setDepartments(r.data || [])).catch(console.error);
  }, []);

  const filtered = devices
    .filter(d => {
      const key = `${d.name || ""} ${d.ip || ""}`.toLowerCase();
      const matchSearch = key.includes(search.toLowerCase());
      const matchDept = filterDept === "all" || d.department === filterDept;
      return matchSearch && matchDept;
    })
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map((d, i) => ({ ...d, no: i + 1 }));

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const startIdx = (currentPage - 1) * rowsPerPage;
  const pageData = filtered.slice(startIdx, startIdx + rowsPerPage);

  useEffect(() => { setCurrentPage(1); }, [search, filterDept, rowsPerPage]);

  const handleDeleteClick = (id) => { setSelectedId(id); setShowModal(true); };
  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      await api.delete(`/api/devices/${selectedId}`);
      setShowModal(false);
      setSelectedId(null);
      const r = await api.get('/api/devices');
      setDevices(r.data || []);
    } catch (e) {
      console.error(e);
      setShowModal(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="mx-auto w-full max-w-[1080px] pt-10 lg:pt-20">
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-full max-w-[520px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or IP..."
                className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0DA5D8] bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative inline-flex items-center gap-2" ref={rowsMenuRef}>
              <button
                type="button"
                onClick={() => setRowsOpen(v => !v)}
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
                  {[10, 50, 100].map(n => (
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

            <div className="relative inline-flex items-center gap-2" ref={deptMenuRef}>
              <button
                type="button"
                onClick={() => setDeptOpen(v => !v)}
                aria-haspopup="listbox"
                aria-expanded={deptOpen}
                aria-controls="dept-menu"
                className="inline-flex h-10 min-w-[240px] items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
              >
                <span className="font-medium">Department</span>
                <span className="truncate">
                  {filterDept === "all" ? "All" : filterDept}
                </span>
                <SlArrowDown className={`transition ${deptOpen ? "rotate-180" : ""}`} />
              </button>

              {deptOpen && (
                <ul
                  id="dept-menu"
                  role="listbox"
                  className="absolute left-0 top-[calc(100%+6px)] z-30 w-[240px] max-h-60 overflow-y-auto list-none rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                >
                  <li
                    role="option"
                    aria-selected={filterDept === "all"}
                    onClick={() => { setFilterDept("all"); setCurrentPage(1); setDeptOpen(false); }}
                    className={`flex h-9 cursor-pointer items-center px-3 text-sm hover:bg-indigo-50 ${
                      filterDept === "all" ? "bg-indigo-50 font-semibold text-indigo-700" : "text-gray-800"
                    }`}
                  >
                    All
                  </li>
                  {departments.map((d) => (
                    <li
                      key={d.id}
                      role="option"
                      aria-selected={filterDept === d.department_name}
                      onClick={() => { setFilterDept(d.department_name); setCurrentPage(1); setDeptOpen(false); }}
                      className={`flex h-9 cursor-pointer items-center px-3 text-sm hover:bg-indigo-50 ${
                        filterDept === d.department_name ? "bg-indigo-50 font-semibold text-indigo-700" : "text-gray-800"
                      }`}
                    >
                      {d.department_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="ml-auto">
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                onClick={() => navigate("/addDevice")}
              >
                <FaPlus /> ADD
              </button>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1080px] rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <div className="w-full max-h-[640px] overflow-y-auto">
            <table className="w-full h-full border-collapse text-sm table-fixed">
              <thead className="sticky top-0 z-10 bg-[#eef2fa] text-[#1B2880] border-b border-gray-200 shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)]">
                <tr className="table w-full table-fixed">
                  <th className="w-[8%]  py-3.5 text-center px-3 font-medium">No.</th>
                  <th className="w-[20%] py-3.5 text-left  px-3 font-medium">Server / Device Name</th>
                  <th className="w-[20%] py-3.5 text-left  px-3 font-medium">IP / Hostname</th>
                  <th className="w-[20%] py-3.5 text-left  px-3 font-medium">Department</th>
                  <th className="w-[15%] py-3.5 text-center px-3 font-medium">Active Users</th>
                  <th className="w-[6%]  py-3.5 text-center px-3 font-medium">Edit</th>
                  <th className="w-[10%]  py-3.5 text-center px-3 font-medium">Delete</th>
                </tr>
              </thead>

              <tbody className="block min-h-[500px] max-h-[640px] overflow-y-auto">
                {pageData.length === 0 ? (
                  <tr className="table w-full table-fixed">
                    <td colSpan={7} className="py-6 text-center text-gray-500">No data found</td>
                  </tr>
                ) : (
                  pageData.map((d, i) => (
                    <tr
                      key={d.id}
                      className="table w-full table-fixed border-b border-gray-200 odd:bg-white even:bg-[#FBFCFD] hover:bg-[#F7FAFC] transition-colors"
                    >
                      <td className="w-[8%]  px-3 py-4 text-center align-middle">{startIdx + i + 1}</td>
                      <td className="w-[20%] px-3 py-4 align-middle">{d.name}</td>
                      <td className="w-[20%] px-3 py-4 align-middle">{d.ip}</td>
                      <td className="w-[20%] px-3 py-4 align-middle">{d.department}</td>
                      <td className="w-[15%] px-3 py-4 text-center align-middle">{d.active_users}</td>
                      <td className="w-[6%]  px-3 py-4 text-center align-middle">
                        <button
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => navigate(`/editDevice/${d.id}`)}
                          aria-label="Edit"
                        >
                          <FaEdit className="mx-auto" />
                        </button>
                      </td>
                      <td className="w-[10%]  px-3 py-4 text-center align-middle">
                        <button
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteClick(d.id)}
                          aria-label="Delete"
                        >
                          <FaTrash className="mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mx-auto mt-5 flex max-w-[980px] flex-wrap items-center justify-center gap-1.5">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white"
          >
            {"<"}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`min-w-9 rounded-lg border px-3 py-1.5 text-sm transition hover:bg-[#0DA5D8] hover:text-white ${
                page === currentPage ? "bg-[#0DA5D8] text-white border-[#0DA5D8] font-semibold" : "bg-white border-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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

        <ConfirmModal
          isOpen={showModal}
          onCancel={() => setShowModal(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

export default DeviceManagement;
