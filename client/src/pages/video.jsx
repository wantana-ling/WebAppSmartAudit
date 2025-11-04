import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { FaFileVideo, FaTrash } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import ConfirmModal from "./deleteDepartment";

const API_BASE = "http://192.168.121.195:3002";

const Video = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [rowsOpen, setRowsOpen] = useState(false);
  const rowsMenuRef = useRef(null);

  // --- helpers ---
  const basename = (p) => (typeof p === "string" ? p.split(/[\\/]/).pop() : "");
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
      const { data } = await axios.get(`${API_BASE}/api/videos`, {
        params: {
          page: currentPage,
          limit: rowsPerPage,
          search: searchText || undefined,
        },
      });

      const list = Array.isArray(data?.data) ? data.data.map(normalizeVideo) : [];
      setRows(list);
      setTotal(data?.total ?? list.length);
      setTotalPages(data?.totalPages ?? Math.max(1, Math.ceil((data?.total ?? list.length) / rowsPerPage)));
    } catch (err) {
      console.error("fetch /api/videos error:", err);
      setRows([]);
      setTotal(0);
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
      <div className="mx-auto w-full max-w-[1080px] pt-10 lg:pt-20">

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
                className="inline-flex h-10 min-w-[130px] items-center justify-between gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
              >
                <span className="font-medium">Show row</span>
                <span className="text-gray-600">{rowsPerPage}</span>
                <SlArrowDown className={`transition ${rowsOpen ? "rotate-180" : ""}`} />
              </button>
              {rowsOpen && (
                <ul className="absolute left-0 top-[calc(100%+6px)] z-30 w-full rounded-xl border bg-white shadow-lg">
                  {[10, 50, 100].map((n) => (
                    <li
                      key={n}
                      onClick={() => { setRowsPerPage(n); setCurrentPage(1); setRowsOpen(false); }}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 ${rowsPerPage === n ? "bg-indigo-50 font-semibold text-indigo-700" : ""}`}
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600"
              onClick={() => selectedIds.length ? setShowModal(true) : alert("ยังไม่ได้เลือก")}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mx-auto w-full max-w-[1080px] rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <div className="w-full min-h-[520px] max-h-[640px] overflow-y-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10 bg-[#eef2fa] text-[#1B2880]">
                <tr className="grid grid-cols-[6%_12%_12%_12%_24%_22%_12%] border-b">
                  <th className="py-3 text-center">No.</th>
                  <th className="py-3 text-center">Date</th>
                  <th className="py-3 text-center">Time-In</th>
                  <th className="py-3 text-center">Time-Out</th>
                  <th className="py-3 text-center px-2">User</th>
                  <th className="py-3 text-center">File</th>
                  <th className="py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="block min-h-[500px]">
                {rows.length === 0 ? (
                  <tr className="grid grid-cols-[6%_12%_12%_12%_24%_22%_12%]">
                    <td className="col-span-7 py-6 text-center text-gray-500 border-b">ไม่พบข้อมูล</td>
                  </tr>
                ) : (
                  rows.map((s, i) => (
                    <tr key={s.id} className="grid grid-cols-[6%_12%_12%_12%_24%_22%_12%] border-b even:bg-[#FBFCFD] hover:bg-[#F7FAFC] transition-colors">
                      <td className="py-4 text-center">{(currentPage - 1) * rowsPerPage + i + 1}</td>
                      <td className="py-4 text-center">{fmtDate(s.date)}</td>
                      <td className="py-4 text-center">{fmtTime(s.timeIn)}</td>
                      <td className="py-4 text-center">{fmtTime(s.timeOut)}</td>
                      <td className="py-4 text-center">{s.user || "-"}</td>
                      <td className="py-4 text-center">
                        {s.file ? (
                          <a
                            href="#!"
                            title={s.file}
                            className="inline-flex items-center justify-center hover:text-[#0DA5D8]"
                          >
                            <FaFileVideo />
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(s.id)}
                          onChange={() => toggleSelect(s.id)}
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
        <div className="mx-auto mt-5 flex max-w-[980px] flex-wrap items-center justify-center gap-1.5">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white">{"<<"}</button>
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white">{"<"}</button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => setCurrentPage(page)}
              className={`min-w-9 rounded-lg border px-3 py-1.5 text-sm transition hover:bg-[#0DA5D8] hover:text-white ${
                page === currentPage ? "bg-[#0DA5D8] text-white border-[#0DA5D8] font-semibold" : "bg-white border-gray-300"
              }`}>{page}</button>
          ))}

          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white">{">"}</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white">{">>"}</button>
        </div>

        {/* Confirm Modal */}
        {showModal && (
          <ConfirmModal
            isOpen={showModal}
            onCancel={() => setShowModal(false)}
            onConfirm={async () => {
              try {
                await axios.delete(`${API_BASE}/api/videos`, { data: { ids: selectedIds } });
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
      </div>
    </div>
  );
};

export default Video;
