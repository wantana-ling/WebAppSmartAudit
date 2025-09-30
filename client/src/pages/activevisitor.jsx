
import React, { useState, useRef} from 'react';
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { SlArrowDown,SlLogin  } from "react-icons/sl";



const mockData = [
  { no: 1, userId: '40001', department: 'Front-IT Infrastructure', username: 'James Anderson', duration: '01:10:00' },
  { no: 2, userId: '40002', department: 'Back-IT Infrastructure', username: 'Emily Johnson', duration: '02:15:22' },
  { no: 3, userId: '40003', department: 'Network Operations', username: 'William Smith', duration: '03:05:11' },
  { no: 4, userId: '40004', department: 'Database Management', username: 'Olivia Brown', duration: '01:55:44' },
  { no: 5, userId: '40005', department: 'Security Operations', username: 'Benjamin Lee', duration: '02:10:30' },
  { no: 6, userId: '40006', department: 'Cloud Services', username: 'Sophia Wilson', duration: '03:25:40' },
  { no: 7, userId: '40007', department: 'Technical Support', username: 'Daniel Taylor', duration: '01:35:10' },
  { no: 8, userId: '40008', department: 'Software Development', username: 'Mia Davis', duration: '04:00:00' },
  { no: 9, userId: '40009', department: 'Front-IT Infrastructure', username: 'Alexander Moore', duration: '02:20:20' },
  { no: 10, userId: '40010', department: 'Back-IT Infrastructure', username: 'Charlotte Martinez', duration: '01:50:50' },
  { no: 11, userId: '40011', department: 'Network Operations', username: 'Michael Thomas', duration: '03:10:10' },
  { no: 12, userId: '40012', department: 'Database Management', username: 'Amelia Garcia', duration: '02:40:40' },
  { no: 13, userId: '40013', department: 'Security Operations', username: 'Elijah Rodriguez', duration: '01:25:25' },
  { no: 14, userId: '40014', department: 'Cloud Services', username: 'Harper Martinez', duration: '04:05:05' },
  { no: 15, userId: '40015', department: 'Technical Support', username: 'Lucas Hernandez', duration: '02:10:10' },
  { no: 16, userId: '40016', department: 'Software Development', username: 'Evelyn Lopez', duration: '03:30:30' },
  { no: 17, userId: '40017', department: 'Front-IT Infrastructure', username: 'Henry Clark', duration: '01:45:45' },
  { no: 18, userId: '40018', department: 'Back-IT Infrastructure', username: 'Abigail Lewis', duration: '02:55:55' },
  { no: 19, userId: '40019', department: 'Network Operations', username: 'Sebastian Young', duration: '03:05:05' },
  { no: 20, userId: '40020', department: 'Database Management', username: 'Emily Hall', duration: '01:40:40' },
  { no: 21, userId: '40021', department: 'Security Operations', username: 'Jack Allen', duration: '02:12:12' },
  { no: 22, userId: '40022', department: 'Cloud Services', username: 'Lily Wright', duration: '03:22:22' },
  { no: 23, userId: '40023', department: 'Technical Support', username: 'Owen Scott', duration: '01:33:33' },
  { no: 24, userId: '40024', department: 'Software Development', username: 'Zoey Adams', duration: '02:44:44' },
  { no: 25, userId: '40025', department: 'Front-IT Infrastructure', username: 'Leo Nelson', duration: '03:55:55' },
  { no: 26, userId: '40026', department: 'Back-IT Infrastructure', username: 'Aria Baker', duration: '04:11:11' },
  { no: 27, userId: '40027', department: 'Network Operations', username: 'David Gonzalez', duration: '01:01:01' },
  { no: 28, userId: '40028', department: 'Database Management', username: 'Grace Perez', duration: '02:22:22' },
  { no: 29, userId: '40029', department: 'Security Operations', username: 'Nathan Hill', duration: '03:33:33' },
  { no: 30, userId: '40030', department: 'Cloud Services', username: 'Avery Rivera', duration: '01:10:10' },
  { no: 31, userId: '40031', department: 'Technical Support', username: 'Gabriel Torres', duration: '02:20:20' },
  { no: 32, userId: '40032', department: 'Software Development', username: 'Scarlett Ramirez', duration: '03:30:30' },
  { no: 33, userId: '40033', department: 'Front-IT Infrastructure', username: 'Isaac Wood', duration: '01:40:40' },
  { no: 34, userId: '40034', department: 'Back-IT Infrastructure', username: 'Chloe Brooks', duration: '02:50:50' },
  { no: 35, userId: '40035', department: 'Network Operations', username: 'Matthew Bennett', duration: '03:00:00' },
  { no: 36, userId: '40036', department: 'Database Management', username: 'Ella Gray', duration: '04:10:10' },
  { no: 37, userId: '40037', department: 'Security Operations', username: 'Wyatt James', duration: '01:15:15' },
  { no: 38, userId: '40038', department: 'Cloud Services', username: 'Sofia Hughes', duration: '02:25:25' },
  { no: 39, userId: '40039', department: 'Technical Support', username: 'Luke Price', duration: '03:35:35' },
  { no: 40, userId: '40040', department: 'Software Development', username: 'Hannah Russell', duration: '04:45:45' },
  { no: 41, userId: '40041', department: 'Network Operations', username: 'John Smith', duration: '01:10:00' },
  { no: 42, userId: '40042', department: 'Database Management', username: 'Emily Johnson', duration: '02:20:20' },
  { no: 43, userId: '40043', department: 'Security Operations', username: 'Michael Brown', duration: '03:05:11' },
  { no: 44, userId: '40044', department: 'Cloud Services', username: 'Sarah Davis', duration: '01:50:50' },
  { no: 45, userId: '40045', department: 'Technical Support', username: 'David Wilson', duration: '02:30:30' },
  { no: 46, userId: '40046', department: 'Software Development', username: 'Emma Miller', duration: '04:00:00' },
  { no: 47, userId: '40047', department: 'Front-IT Infrastructure', username: 'Daniel Anderson', duration: '02:22:22' },
  { no: 48, userId: '40048', department: 'Back-IT Infrastructure', username: 'Olivia Thomas', duration: '01:33:33' },
  { no: 49, userId: '40049', department: 'Network Operations', username: 'James Jackson', duration: '03:55:55' },
  { no: 50, userId: '40050', department: 'Database Management', username: 'Sophia White', duration: '01:25:25' },
  { no: 51, userId: '40051', department: 'Security Operations', username: 'Benjamin Harris', duration: '03:10:10' },
  { no: 52, userId: '40052', department: 'Cloud Services', username: 'Isabella Martin', duration: '02:44:44' },
  { no: 53, userId: '40053', department: 'Technical Support', username: 'Alexander Lee', duration: '01:55:55' },
  { no: 54, userId: '40054', department: 'Software Development', username: 'Mia Walker', duration: '03:00:00' },
  { no: 55, userId: '40055', department: 'Front-IT Infrastructure', username: 'Elijah Hall', duration: '02:35:35' },
  { no: 56, userId: '40056', department: 'Back-IT Infrastructure', username: 'Abigail Allen', duration: '01:45:45' },
  { no: 57, userId: '40057', department: 'Network Operations', username: 'Logan Young', duration: '03:25:25' },
  { no: 58, userId: '40058', department: 'Database Management', username: 'Charlotte Hernandez', duration: '04:05:05' },
  { no: 59, userId: '40059', department: 'Security Operations', username: 'Lucas King', duration: '02:15:15' },
  { no: 60, userId: '40060', department: 'Cloud Services', username: 'Amelia Wright', duration: '01:20:20' },
  { no: 61, userId: '40061', department: 'Technical Support', username: 'Henry Lopez', duration: '03:30:30' },
  { no: 62, userId: '40062', department: 'Software Development', username: 'Evelyn Scott', duration: '02:50:50' },
  { no: 63, userId: '40063', department: 'Front-IT Infrastructure', username: 'Jack Green', duration: '01:35:35' },
  { no: 64, userId: '40064', department: 'Back-IT Infrastructure', username: 'Harper Adams', duration: '03:40:40' },
  { no: 65, userId: '40065', department: 'Network Operations', username: 'Sebastian Baker', duration: '02:05:05' },
  { no: 66, userId: '40066', department: 'Database Management', username: 'Ella Gonzalez', duration: '04:15:15' },
  { no: 67, userId: '40067', department: 'Security Operations', username: 'Aiden Nelson', duration: '01:10:10' },
  { no: 68, userId: '40068', department: 'Cloud Services', username: 'Luna Carter', duration: '02:12:12' },
  { no: 69, userId: '40069', department: 'Technical Support', username: 'Matthew Mitchell', duration: '03:03:03' },
  { no: 70, userId: '40070', department: 'Software Development', username: 'Grace Perez', duration: '04:30:30' },
  { no: 71, userId: '40071', department: 'Front-IT Infrastructure', username: 'Joseph Roberts', duration: '01:50:50' },
  { no: 72, userId: '40072', department: 'Back-IT Infrastructure', username: 'Aria Turner', duration: '03:20:20' },
  { no: 73, userId: '40073', department: 'Network Operations', username: 'Samuel Phillips', duration: '02:02:02' },
  { no: 74, userId: '40074', department: 'Database Management', username: 'Scarlett Campbell', duration: '04:40:40' },
  { no: 75, userId: '40075', department: 'Security Operations', username: 'Levi Parker', duration: '01:12:12' },
  { no: 76, userId: '40076', department: 'Cloud Services', username: 'Victoria Evans', duration: '03:18:18' },
  { no: 77, userId: '40077', department: 'Technical Support', username: 'Daniel Edwards', duration: '02:34:34' },
  { no: 78, userId: '40078', department: 'Software Development', username: 'Chloe Collins', duration: '01:01:01' },
  { no: 79, userId: '40079', department: 'Front-IT Infrastructure', username: 'Nathan Stewart', duration: '02:45:45' },
  { no: 80, userId: '40080', department: 'Back-IT Infrastructure', username: 'Zoe Sanchez', duration: '03:13:13' }
];


const mockDepartments = [
  { id: 1, name: 'Front-IT Infrastructure' }, 
  { id: 2, name: 'Back-IT Infrastructure' },
  { id: 3, name: 'Network Operations' },
  { id: 4, name: 'Database Management' },
  { id: 5, name: 'Security Operations' },
  { id: 6, name: 'Cloud Services' },
  { id: 7, name: 'Technical Support' },
  { id: 8, name: 'Software Development' }
];


const ActiveVisitor = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  const selectedDeptName =
    selectedDepartment === 'all'
      ? null
      : mockDepartments.find((dept) => dept.id === Number(selectedDepartment))?.name;

  const filteredData = mockData
    .filter((item) => {
      const matchDepartment = !selectedDeptName || item.department === selectedDeptName;

      const matchSearch = item.username.toLowerCase().includes(searchQuery.toLowerCase());

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

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="mx-auto w-full max-w-[1080px] ">

        {/* Search + Filters */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* search */}
            <div className="relative w-full max-w-[520px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400"
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
                placeholder="Search..."
                className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0DA5D8] bg-white"
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

            {/* department */}
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
                  {selectedDepartment === "all"
                    ? "All"
                    : mockDepartments.find(d => d.id === selectedDepartment)?.name}
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
                    aria-selected={selectedDepartment === "all"}
                    onClick={() => { setSelectedDepartment("all"); setCurrentPage(1); setDeptOpen(false); }}
                    className={`flex h-9 cursor-pointer items-center px-3 text-sm hover:bg-indigo-50 ${
                      selectedDepartment === "all" ? "bg-indigo-50 font-semibold text-indigo-700" : "text-gray-800"
                    }`}
                  >
                    All
                  </li>
                  {mockDepartments.map(dept => (
                    <li
                      key={dept.id}
                      role="option"
                      aria-selected={selectedDepartment === dept.id}
                      onClick={() => { setSelectedDepartment(dept.id); setCurrentPage(1); setDeptOpen(false); }}
                      className={`flex h-9 cursor-pointer items-center px-3 text-sm hover:bg-indigo-50 ${
                        selectedDepartment === dept.id ? "bg-indigo-50 font-semibold text-indigo-700" : "text-gray-800"
                      }`}
                    >
                      {dept.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1080px] rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <div className="w-full max-h-[560px] overflow-y-auto">
            <table className="w-full border-collapse text-sm table-fixed">
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

              <tbody className="block max-h-[500px] overflow-y-auto">
                {paginatedData.length === 0 ? (
                  <tr className="table w-full table-fixed">
                    <td colSpan={7} className="py-6 text-center text-gray-500">ไม่พบข้อมูล</td>
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
                      <td className="w-[16%] px-3 py-4 align-middle">192.134.xx.xx</td>
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

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="w-[300px] rounded-2xl bg-white p-6 text-center shadow-2xl animate-[pop-in_0.2s_ease]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 flex justify-center text-yellow-600">
                <SlLogin size={40} />
              </div>
              <h3 className="mb-1 text-lg font-semibold">Are You Sure?</h3>
              <p className="text-gray-600">
                The user will be notified
                <br />
                that you are viewing their screen in real time.
              </p>
              <div className="mt-5 flex justify-around">
                <button
                  className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-[rgba(13,149,216,0.8)] px-4 py-2 text-white hover:bg-[rgba(13,149,216,0.6)]"
                  onClick={() => {
                    navigate("liveScreen", { state: { selectedUser } });
                    setIsModalOpen(false);
                  }}
                >
                  Confirm
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
