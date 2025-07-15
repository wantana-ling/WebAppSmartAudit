
import React from 'react';
import '../css/atvt.css'; // Import the CSS file for styling

const ActiveVisitor = () => {
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
            <select>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Department</label>
            <select>
              <option value="front">Front-IT Infrastructure</option>
              <option value="back">Back-IT Infrastructure</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Status</label>
            <select>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

        
          <button>+ Add</button>
        
        </div>


        
      </div>
    </div>
  );
};

export default ActiveVisitor;
