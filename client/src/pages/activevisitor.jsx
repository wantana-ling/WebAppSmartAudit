
import React, { useState } from 'react';
import '../css/atvt.css'; // Import the CSS file for styling

const mockData = [
  { no: 1, userId: '40001', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 1', duration: '01:10:00' },
  { no: 2, userId: '40002', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 2', duration: '02:15:22' },
  { no: 3, userId: '40003', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 3', duration: '03:05:11' },
  { no: 4, userId: '40004', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 4', duration: '01:55:44' },
  { no: 5, userId: '40005', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 5', duration: '02:10:30' },
  { no: 6, userId: '40006', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 6', duration: '03:25:40' },
  { no: 7, userId: '40007', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 7', duration: '01:35:10' },
  { no: 8, userId: '40008', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 8', duration: '04:00:00' },
  { no: 9, userId: '40009', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 9', duration: '02:20:20' },
  { no: 10, userId: '40010', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 10', duration: '01:50:50' },
  { no: 11, userId: '40011', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 11', duration: '03:10:10' },
  { no: 12, userId: '40012', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 12', duration: '02:40:40' },
  { no: 13, userId: '40013', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 13', duration: '01:25:25' },
  { no: 14, userId: '40014', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 14', duration: '04:05:05' },
  { no: 15, userId: '40015', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 15', duration: '02:10:10' },
  { no: 16, userId: '40016', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 16', duration: '03:30:30' },
  { no: 17, userId: '40017', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 17', duration: '01:45:45' },
  { no: 18, userId: '40018', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 18', duration: '02:55:55' },
  { no: 19, userId: '40019', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 19', duration: '03:05:05' },
  { no: 20, userId: '40020', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 20', duration: '01:40:40' },
  { no: 21, userId: '40021', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 21', duration: '02:12:12' },
  { no: 22, userId: '40022', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 22', duration: '03:22:22' },
  { no: 23, userId: '40023', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 23', duration: '01:33:33' },
  { no: 24, userId: '40024', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 24', duration: '02:44:44' },
  { no: 25, userId: '40025', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 25', duration: '03:55:55' },
  { no: 26, userId: '40026', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 26', duration: '04:11:11' },
  { no: 27, userId: '40027', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 27', duration: '01:01:01' },
  { no: 28, userId: '40028', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 28', duration: '02:22:22' },
  { no: 29, userId: '40029', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 29', duration: '03:33:33' },
  { no: 30, userId: '40030', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 30', duration: '01:10:10' },
  { no: 31, userId: '40031', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 31', duration: '02:20:20' },
  { no: 32, userId: '40032', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 32', duration: '03:30:30' },
  { no: 33, userId: '40033', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 33', duration: '01:40:40' },
  { no: 34, userId: '40034', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 34', duration: '02:50:50' },
  { no: 35, userId: '40035', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 35', duration: '03:00:00' },
  { no: 36, userId: '40036', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 36', duration: '04:10:10' },
  { no: 37, userId: '40037', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 37', duration: '01:15:15' },
  { no: 38, userId: '40038', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 38', duration: '02:25:25' },
  { no: 39, userId: '40039', department: 'Front-IT Infrastructure', username: 'สมชาย สายหน้า 39', duration: '03:35:35' },
  { no: 40, userId: '40040', department: 'Back-IT Infrastructure', username: 'สมศักดิ์ สายหลัง 40', duration: '04:45:45' }
];




const ActiveVisitor = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const filteredData = mockData
    .filter((item) => {
      if (selectedDepartment === 'all') return true;
      if (selectedDepartment === 'front') return item.department === 'Front-IT Infrastructure';
      if (selectedDepartment === 'back') return item.department === 'Back-IT Infrastructure';
      return true;
    })
    .sort((a, b) => Number(a.userId) - Number(b.userId))
    .map((item, index) => ({ ...item, no: index + 1 }));

  const totalData = filteredData.length;
  const totalPages = Math.ceil(totalData / rowsPerPage);

  const paginatedData = filteredData.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
  );
  console.log('Selected:', selectedDepartment);
console.log('Filtered:', filteredData.map(d => d.department));

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
            <option value="front">Front-IT Infrastructure</option>
            <option value="back">Back-IT Infrastructure</option>

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
                  <td><i className="fa fa-eye" /></td>
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

          {/* ปุ่มเลขหน้า */}
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
    </div>
  );
};

export default ActiveVisitor;
