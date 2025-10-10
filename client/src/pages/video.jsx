import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaFileVideo, FaTrash } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import ConfirmModal from "./deleteDepartment";

const Video = () => {
  const [sessions, setSessions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [rowsOpen, setRowsOpen] = useState(false);
  const rowsMenuRef = useRef(null);

  const API_BASE = "http://192.168.121.195:3002";

  useEffect(() => {
    axios.get(`${API_BASE}/api/sessions`)
      .then((res) => setSessions(res.data || []))
      .catch(console.error);
  }, []);

  const filtered = sessions.filter((s) =>
    `${s.firstname} ${s.lastname}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const startIdx = (currentPage - 1) * rowsPerPage;
  const pageData = filtered.slice(startIdx, startIdx + rowsPerPage);

  // format date/time
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB").replaceAll("/", ".");
  const fmtTime = (d) => new Date(d).toLocaleTimeString("en-GB", { hour12: false });

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="mx-auto w-full max-w-[1080px] pt-10 lg:pt-20">

        {/* Search */}
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* Search bar */}
            <div className="relative w-full max-w-[520px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0DA5D8]"
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>

          {/* Filter (row per page + delete) → แยกออกมาอยู่อีกบรรทัด */}
          <div className="flex items-center gap-3">
            {/* Rows per page */}
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
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 ${
                        rowsPerPage === n ? "bg-indigo-50 font-semibold text-indigo-700" : ""
                      }`}
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Delete button */}
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
          {/* กรอบสโครล กำหนดสูงขั้นต่ำ/สูงสุด */}
          <div className="w-full min-h-[520px] max-h-[640px] overflow-y-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10 bg-[#f9fafc] text-[#1B2880]">
                {/* ใช้กริดกำหนดความกว้างคอลัมน์ให้ตรงกันทุกแถว */}
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

              {/* ทำ tbody เป็น block + min-h เพื่อ “ยืด” ให้เต็ม */}
              <tbody className="block min-h-[500px]">
                {pageData.length === 0 ? (
                  <tr className="grid grid-cols-[6%_12%_12%_12%_24%_22%_12%]">
                    <td className="col-span-7 py-6 text-center text-gray-500 border-b">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                ) : (
                  pageData.map((s, i) => (
                    <tr
                      key={s.session_id}
                      className="grid grid-cols-[6%_12%_12%_12%_24%_22%_12%] border-b even:bg-[#FBFCFD] hover:bg-[#F7FAFC] transition-colors"
                    >
                      <td className="py-4 text-center">{startIdx + i + 1}</td>
                      <td className="py-4 text-center">{fmtDate(s.login_time)}</td>
                      <td className="py-4 text-center">{fmtTime(s.login_time)}</td>
                      <td className="py-4 text-center">{fmtTime(s.logout_time)}</td>
                      <td className="py-4 text-center">{s.firstname} {s.lastname}</td>
                      <td className="py-4 text-center">
                        <a
                          href={`${API_BASE}${s.video_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          <FaFileVideo /> .mp4
                        </a>
                      </td>
                      <td className="py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(s.session_id)}
                          onChange={() =>
                            setSelectedIds(prev =>
                              prev.includes(s.session_id)
                                ? prev.filter(id => id !== s.session_id)
                                : [...prev, s.session_id]
                            )
                          }
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
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="min-w-9 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#0DA5D8] hover:text-white"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
            onCancel={() => setShowModal(false)}
            onConfirm={async () => {
              await axios.delete(`${API_BASE}/api/sessions`, { data: { ids: selectedIds }});
              setSelectedIds([]);
              setShowModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Video;
  