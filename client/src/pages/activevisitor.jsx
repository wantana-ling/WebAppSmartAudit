
import React, { useState, useRef, useEffect } from 'react';
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { SlArrowDown, SlLogin } from "react-icons/sl";
import { PAGINATION_OPTIONS, DEFAULT_ROWS_PER_PAGE, MESSAGES, PLACEHOLDERS, MODAL_MESSAGES, ROUTES } from '../constants';
import api from '../api';


const ActiveVisitor = () => {
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const deptMenuRef = useRef(null);
  const [rowsOpen, setRowsOpen] = useState(false);
  const rowsMenuRef = useRef(null);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, deptRes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/departments'),
        ]);
        setUsers(usersRes.data || []);
        setDepartments(deptRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setUsers([]);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Transform users data to match expected format
  const transformedUsers = users
    .filter((user) => user.status === 'active')
    .map((user) => ({
      userId: String(user.user_id),
      department: user.department || 'N/A',
      username: `${user.firstname || ''} ${user.midname || ''} ${user.lastname || ''}`.trim() || 'N/A',
      duration: '00:00:00', // Placeholder - would need API endpoint for actual duration
    }));

  const selectedDeptName =
    selectedDepartment === 'all'
      ? null
      : departments.find((dept) => dept.id === Number(selectedDepartment))?.department_name;

  const filteredData = transformedUsers
    .filter((item) => {
      const matchDepartment = !selectedDeptName || item.department === selectedDeptName;
      const matchSearch = item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.userId.includes(searchQuery);
      return matchDepartment && matchSearch;
    })
    .sort((a, b) => Number(a.userId) - Number(b.userId))
    .map((item, index) => ({ ...item, no: index + 1 }));

    const totalData = filteredData.length;
    const totalPages = Math.ceil(totalData / rowsPerPage);

  const paginatedData = filteredData.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
  );

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center text-gray-500">{MESSAGES.LOADING}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="mx-auto w-full max-w-[1080px] pt-10 lg:pt-20">


        {/* Search + Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-3">
            {/* search */}
            <div className="relative w-full max-w-[520px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 transition-colors group-focus-within:text-[#0DA5D8]"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                placeholder={MESSAGES.SEARCH_PLACEHOLDER}
                className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0DA5D8] focus:border-[#0DA5D8] bg-white shadow-sm hover:shadow-md transition-all duration-200 placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* rows per page */}
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
                  {PAGINATION_OPTIONS.map(n => (
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

            {/* department */}
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
                  {selectedDepartment === "all"
                    ? "All"
                    : departments.find(d => d.id === Number(selectedDepartment))?.department_name || "All"}
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
                    aria-selected={selectedDepartment === "all"}
                    onClick={() => { setSelectedDepartment("all"); setCurrentPage(1); setDeptOpen(false); }}
                    className={`flex h-9 cursor-pointer items-center px-3 text-sm transition-colors duration-150 hover:bg-[#0DA5D8]/10 ${
                      selectedDepartment === "all" ? "bg-[#0DA5D8]/20 font-semibold text-[#0DA5D8]" : "text-gray-800"
                    }`}
                  >
                    All
                  </li>
                  {departments.map(dept => (
                    <li
                      key={dept.id}
                      role="option"
                      aria-selected={selectedDepartment === String(dept.id)}
                      onClick={() => { setSelectedDepartment(String(dept.id)); setCurrentPage(1); setDeptOpen(false); }}
                      className={`flex h-9 cursor-pointer items-center px-3 text-sm transition-colors duration-150 hover:bg-[#0DA5D8]/10 ${
                        selectedDepartment === String(dept.id) ? "bg-[#0DA5D8]/20 font-semibold text-[#0DA5D8]" : "text-gray-800"
                      }`}
                    >
                      {dept.department_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>


        <div className="mx-auto w-full max-w-[1080px] rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden border border-gray-100">
          <div className="w-full max-h-[640px] overflow-y-auto">
            <table className="w-full h-full border-collapse text-sm table-fixed">
              <thead className="sticky top-0 z-10 bg-[#eef2fa] text-[#1B2880] border-b border-gray-200 shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)]">
                <tr className="table w-full table-fixed">
                  <th className="w-[8%] py-3.5 text-center px-3 font-medium">No.</th>
                  <th className="w-[10%] py-3.5 text-left  px-4 font-medium">UserID</th>
                  <th className="w-[24%] py-3.5 text-left  px-3 font-medium">Department</th>
                  <th className="w-[16%] py-3.5 text-left  px-3 font-medium">Device</th>
                  <th className="w-[22%] py-3.5 text-left  px-3 font-medium">Name</th>
                  <th className="w-[12%] py-3.5 text-left  px-3 font-medium">Duration</th>
                  <th className="w-[8%]  py-3.5 text-center px-3 font-medium">View</th>
                </tr>
              </thead>

              <tbody className="block min-h-[500px] max-h-[640px] overflow-y-auto">
                {paginatedData.length === 0 ? (
                  <tr className="table w-full table-fixed">
                    <td colSpan={7} className="py-6 text-center text-gray-500">{MESSAGES.NO_DATA}</td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr
                      key={item.userId}
                      className="table w-full table-fixed border-b border-gray-200 odd:bg-white even:bg-[#FBFCFD] hover:bg-[#F7FAFC] transition-colors"
                    >
                      <td className="w-[8%]  px-3 py-4 text-center align-middle">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="w-[10%] px-4 py-4 align-middle">{item.userId}</td>
                      <td className="w-[24%] px-3 py-4 align-middle">{item.department}</td>
                      <td className="w-[16%] px-3 py-4 align-middle">{PLACEHOLDERS.DEVICE_IP}</td>
                      <td className="w-[22%] px-3 py-4 align-middle">{item.username}</td>
                      <td className="w-[12%] px-3 py-4 align-middle">{item.duration}</td>
                      <td className="w-[8%]  px-3 py-4 text-center align-middle">
                        <FaEye
                          onClick={() => handleViewClick(item)}
                          className="mx-auto cursor-pointer text-[#0DA5D8] hover:brightness-110"
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
        <div className="mx-auto mt-6 flex max-w-[980px] flex-wrap items-center justify-center gap-1.5">
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

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-[fade-in_0.2s_ease]"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="w-[90%] max-w-[400px] rounded-2xl bg-white p-6 md:p-8 text-center shadow-2xl border border-gray-100 animate-[pop-in_0.3s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <SlLogin size={32} className="text-orange-500" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">{MODAL_MESSAGES.CONFIRM_VIEW_SCREEN.TITLE}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                {MODAL_MESSAGES.CONFIRM_VIEW_SCREEN.MESSAGE}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="rounded-xl bg-gray-100 text-gray-700 px-6 py-2.5 text-sm font-medium hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  {MESSAGES.CANCEL}
                </button>
                <button
                  className="rounded-xl bg-gradient-to-r from-[#0DA5D8] to-[#1A2DAC] text-white px-6 py-2.5 text-sm font-semibold hover:shadow-lg transition-all duration-200 shadow-md"
                  onClick={() => {
                    navigate(ROUTES.LIVE_SCREEN, { state: { selectedUser } });
                    setIsModalOpen(false);
                  }}
                >
                  {MESSAGES.CONFIRM}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default ActiveVisitor;
