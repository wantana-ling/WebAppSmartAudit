import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import ConfirmModal from "./deleteDevice";

const ROW_H = 48; // ความสูงต่อแถวโดยประมาณ (px)

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  useEffect(() => {
    fetchDevices();
    fetchDepartments();
  }, []);

  const fetchDevices = () => {
    axios
      .get(`${apiBase}/api/devices`)
      .then((res) => setDevices(res.data || []))
      .catch((err) => console.error("❌ โหลด devices ไม่ได้", err));
  };

  const fetchDepartments = () => {
    axios
      .get(`${apiBase}/api/departments`)
      .then((res) => setDepartments(res.data || []))
      .catch((err) => console.error("❌ โหลด departments ไม่ได้", err));
  };

  // filter & paginate
  const filteredDevices = devices.filter((d) => {
    const key = `${d.name || ""} ${d.ip || ""}`.toLowerCase();
    const matchSearch = key.includes(search.toLowerCase());
    const matchDept = !filterDept || d.department === filterDept;
    return matchSearch && matchDept;
  });

  const totalPages = Math.max(1, Math.ceil(filteredDevices.length / rowsPerPage));
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginated = filteredDevices.slice(startIdx, startIdx + rowsPerPage);
  const paddedRows = Math.max(0, rowsPerPage - paginated.length);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    axios
      .delete(`${apiBase}/api/devices/${selectedId}`)
      .then(() => {
        setShowModal(false);
        setSelectedId(null);
        fetchDevices();
      })
      .catch((err) => {
        console.error("❌ ลบไม่สำเร็จ:", err);
        setShowModal(false);
      });
  };

  // reset page เมื่อเปลี่ยนเงื่อนไข
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterDept, rowsPerPage]);

  return (
    <div className="min-h-screen w-full flex items-start justify-center pt-10 pb-12">
      <div className="w-[95%] max-w-[1100px]">
        {/* Top controls */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full max-w-[420px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name or IP..."
              className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0DA5D8]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm">
              <span className="text-gray-800">Show row</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="appearance-none bg-transparent pl-1 pr-6 outline-none"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm">
              <span className="text-gray-800">Department</span>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="appearance-none bg-transparent pl-1 pr-6 outline-none"
              >
                <option value="">All</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.department_name}>
                    {d.department_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add button */}
          <div className="ml-auto">
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
              onClick={() => navigate("/addDevice")}
            >
              <FaPlus /> ADD
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <div className="w-full">
            <table className="w-full table-fixed border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-[#eef2fa] text-[#1B2880] border-b border-gray-200 shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)]">
                <tr className="table w-full table-fixed">
                  <th className="w-[8%]  px-3 py-3.5 text-center font-medium">ID</th>
                  <th className="w-[28%] px-3 py-3.5 text-left font-medium">Server / Device Name</th>
                  <th className="w-[20%] px-3 py-3.5 text-left font-medium">IP / Hostname</th>
                  <th className="w-[22%] px-3 py-3.5 text-left font-medium">Department</th>
                  <th className="w-[10%] px-3 py-3.5 text-center font-medium">Active Users</th>
                  <th className="w-[6%]  px-3 py-3.5 text-center font-medium">Edit</th>
                  <th className="w-[6%]  px-3 py-3.5 text-center font-medium">Delete</th>
                </tr>
              </thead>

              {/* tbody เลื่อนเอง + ล็อคความสูงตาม rowsPerPage */}
              <tbody
                className="block overflow-y-auto divide-y divide-gray-200"
                style={{
                  minHeight: `${rowsPerPage * ROW_H}px`,
                  maxHeight: `${rowsPerPage * ROW_H}px`,
                }}
              >
                {paginated.map((d, i) => (
                  <tr
                    key={d.id}
                    className="table w-full table-fixed odd:bg-white even:bg-[#FBFCFD] hover:bg-[#F7FAFC] transition-colors"
                  >
                    <td className="w-[8%]  px-3 py-3 text-center align-middle">
                      {startIdx + i + 1}
                    </td>
                    <td className="w-[28%] px-3 py-3 align-middle">{d.name}</td>
                    <td className="w-[20%] px-3 py-3 align-middle">{d.ip}</td>
                    <td className="w-[22%] px-3 py-3 align-middle">{d.department}</td>
                    <td className="w-[10%] px-3 py-3 text-center align-middle">{d.active_users}</td>
                    <td className="w-[6%]  px-3 py-3 text-center align-middle">
                      <button
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => navigate(`/editDevice/${d.id}`)}
                        aria-label="Edit"
                      >
                        <FaEdit className="mx-auto" />
                      </button>
                    </td>
                    <td className="w-[6%]  px-3 py-3 text-center align-middle">
                      <button
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(d.id)}
                        aria-label="Delete"
                      >
                        <FaTrash className="mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* เติมแถวเปล่าให้คงความสูง */}
                {Array.from({ length: paddedRows }).map((_, idx) => (
                  <tr key={`pad-${idx}`} className="table w-full table-fixed">
                    <td className="px-3 py-3 text-transparent select-none" colSpan={7}>
                      &nbsp;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
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
