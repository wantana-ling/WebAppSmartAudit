
import React, { useState } from 'react';
import '../css/atvt.css'; // Import the CSS file for styling
import { FaEye } from "react-icons/fa";
import { FaUserSecret } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



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
    <div className="main-container-def">
      <div className="box-container-def">
        <div className="search-box-def">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>

          <input
            type="text"
            placeholder="Search..."
            className="search-input-def"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset page ไปหน้าแรกเวลา search
            }}
          />

        </div>
        <div className="filter-box-def">
          <div className="filter-item">
            <label>Show row</label>
            <select
                    value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset ไปหน้า 1
              }}
            >
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            
          </div>

          <div className="filter-item">
            <label>Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All</option>
              {mockDepartments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>

          </div>

        </div>
        <div className="table-def">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>UserID</th>
                <th>Department</th>
                <th>Username</th>
                <th>Duration</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.userId}>
                  <td>{(currentPage - 1) * rowsPerPage + index + 1}</td> {/* แสดงลำดับจริง */}
                  <td>{item.userId}</td>
                  <td>{item.department}</td>
                  <td>{item.username}</td>
                  <td>{item.duration}</td>
                  <td><FaEye onClick={() => handleViewClick(item)} style={{ cursor: 'pointer' }} /></td>
                </tr>
              ))}
            </tbody>


          </table>
        </div>
        <div className="pagination-def">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            {'<<'}
          </button>
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            {'<'}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={page === currentPage ? 'active' : ''}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            {'>'}
          </button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
            {'>>'}
          </button>
        </div>



        


      </div>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content alert" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon"><FaUserSecret size={40} className="text-yellow-600" /></div>
              <h3>Are You Sure?</h3>
              <p>
                The user will be notified<br />
                that you are viewing their screen in real time.
              </p>
              <div className="modal-buttons">
                <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="btn-confirm" onClick={() => {
                  navigate('liveScreen', {
                    state: { selectedUser }
                  });
                  setIsModalOpen(false);
                }}>Confirm</button>
              </div>
            </div>
          </div>
        )}
    </div>
    
  );
};

export default ActiveVisitor;
