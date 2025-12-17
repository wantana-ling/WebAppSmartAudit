import React, { useEffect, useState, useRef, useCallback } from "react";
import api from "../api";
import { FaFileVideo, FaTrash } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import ConfirmModal from "./deleteDepartment";
import AlertModal from "../components/AlertModal";

const Video = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: "info", title: "", message: "" });

  const [rowsOpen, setRowsOpen] = useState(false);
  const rowsMenuRef = useRef(null);

  // --- helpers ---
  const normalizeVideo = (v) => ({
    id: v.id,
    date: v.date,                                     // 'YYYY-MM-DD' จาก API
    timeIn: v.timeIn ?? v.start ?? "",                // map start -> timeIn
    timeOut: v.timeOut ?? v.stop ?? "",               // map stop  -> timeOut
    user: v.user ?? v.username ?? v.target ?? "-",    // เผื่อ API อนาคต
    file: v.file ?? v.recording_path ?? "",           // map path -> file
    duration: v.duration ?? "",
  });

  const fetchVideos = useCallback(async () => {
    try {
      const { data } = await api.get('/api/videos', {
        params: {
          page: currentPage,
          limit: rowsPerPage,
          search: searchText || undefined,
        },
      });

      const list = Array.isArray(data?.data) ? data.data.map(normalizeVideo) : [];
      setRows(list);
      setTotalPages(data?.totalPages ?? Math.max(1, Math.ceil((data?.total ?? list.length) / rowsPerPage)));
    } catch (err) {
      console.error("fetch /api/videos error:", err);
      setRows([]);
      setTotalPages(1);
    }
  }, [currentPage, rowsPerPage, searchText]);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  useEffect(() => {
    const onClick = (e) => {
      if (rowsMenuRef.current && !rowsMenuRef.current.contains(e.target)) setRowsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const fmtDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      // รองรับทั้ง 'YYYY-MM-DD' และ ISO
      const d = new Date(dateStr);
      if (!isNaN(d)) {
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yy = String(d.getFullYear());
        return `${dd}.${mm}.${yy}`;
      }
      const [y, m, d2] = String(dateStr).split(/[-/]/);
      return `${d2}.${m}.${y}`;
    } catch { return String(dateStr); }
  };
  const fmtTime = (t) => (t ? String(t).slice(0, 8) : "-"); // ถ้าเป็น 'HH:MM:SS' จะคงเดิม

  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="mx-auto w-full max-w-[900px] pt-6 lg:pt-10 px-4">

        {/* Search */}
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-full max-w-[520px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search by user / target / file..."
                className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0DA5D8]"
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
                onKeyDown={(e) => { if (e.key === "Enter") fetchVideos(); }}
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

            <button
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600"
              onClick={() => selectedIds.length ? setShowModal(true) : setAlertModal({ isOpen: true, type: "warning", title: "Warning", message: "Please select at least one item" })}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mx-auto w-full max-w-[900px] rounded-xl bg-white shadow-md ring-1 ring-gray-200 overflow-hidden border border-gray-100">
          <div className="w-full max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10 bg-[#eef2fa] text-[#1B2880] border-b border-gray-200 shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)]">
                <tr className="grid grid-cols-[6%_12%_12%_12%_24%_22%_12%] border-b">
                  <th className="py-2.5 text-center px-2 font-medium text-xs">No.</th>
                  <th className="py-2.5 text-center px-2 font-medium text-xs">Date</th>
                  <th className="py-2.5 text-center px-2 font-medium text-xs">Time-In</th>
                  <th className="py-2.5 text-center px-2 font-medium text-xs">Time-Out</th>
                  <th className="py-2.5 text-center px-2 font-medium text-xs">User</th>
                  <th className="py-2.5 text-center px-2 font-medium text-xs">File</th>
                  <th className="py-2.5 text-center px-2 font-medium text-xs">Action</th>
                </tr>
              </thead>

              <tbody className="block min-h-[400px] max-h-[500px] overflow-y-auto">
                {rows.length === 0 ? (
                  <tr className="grid grid-cols-[6%_12%_12%_12%_24%_22%_12%]">
                    <td className="col-span-7 py-8 text-center text-gray-500 text-sm border-b">No data found</td>
                  </tr>
                ) : (
                  rows.map((s, i) => (
                    <tr key={s.id} className="grid grid-cols-[6%_12%_12%_12%_24%_22%_12%] border-b odd:bg-white even:bg-[#FBFCFD] hover:bg-[#F7FAFC] transition-colors">
                      <td className="py-2.5 text-center align-middle text-xs px-2">{(currentPage - 1) * rowsPerPage + i + 1}</td>
                      <td className="py-2.5 text-center align-middle text-xs px-2">{fmtDate(s.date)}</td>
                      <td className="py-2.5 text-center align-middle text-xs px-2">{fmtTime(s.timeIn)}</td>
                      <td className="py-2.5 text-center align-middle text-xs px-2">{fmtTime(s.timeOut)}</td>
                      <td className="py-2.5 text-center align-middle text-xs px-2 truncate">{s.user || "-"}</td>
                      <td className="py-2.5 text-center align-middle px-2">
                        {s.file ? (
                          <a
                            href="#!"
                            title={s.file}
                            className="inline-flex items-center justify-center hover:text-[#0DA5D8]"
                          >
                            <FaFileVideo className="text-sm" />
                          </a>
                        ) : (
                          <span className="text-xs">-</span>
                        )}
                      </td>
                      <td className="py-2.5 text-center align-middle px-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(s.id)}
                          onChange={() => toggleSelect(s.id)}
                          className="cursor-pointer"
                        />
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
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
            onCancel={() => setShowModal(false)}
            onConfirm={async () => {
              try {
                await api.delete('/api/videos', { data: { ids: selectedIds } });
                setSelectedIds([]);
                setShowModal(false);
                fetchVideos();
              } catch (e) {
                console.error("delete error:", e);
                setShowModal(false);
              }
            }}
          />
        )}

        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={() => setAlertModal({ isOpen: false, type: "info", title: "", message: "" })}
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
        />
      </div>
    </div>
  );
};

export default Video;
