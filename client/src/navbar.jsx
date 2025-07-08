import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChartBar, FaUserEdit, FaVideo, FaDesktop, FaSignOutAlt, FaUsers, FaUser, FaCog } from "react-icons/fa";
const Navbar = () => {

  const location = useLocation();

  return (
    <div className="navbar-box">
      <div className="navbar">
        <div className="navbar-logo">
          <img className="logo-img" src="/img/Logo-SmartAudit.png" alt="smartAudit-logo" />
        </div>
        <div className="menu">
          <ul>
            <li className={`main-menu ${location.pathname === "/dashboard" ? "active" : ""}`}>
              <Link to="/dashboard">
                <FaChartBar  className="icon" />
                <span className="menu-label">Dashboard</span>
              </Link>
            </li>
            <li className={`main-menu ${location.pathname === "/acticveVisitor" ? "active" : ""}`}>
              <Link to="/acticveVisitor">
                <FaUser  className="icon" />
                <span className="menu-label">Active Visitor</span>
              </Link>
            </li>
            <li className={`main-menu ${location.pathname === "/userManagement" ? "active" : ""}`}>
              <Link to="/userManagement">
                <FaUserEdit className="icon" />
                <span className="menu-label">User Management</span>
              </Link>
            </li>
            <li className={`main-menu ${location.pathname === "/deviceManagement" ? "active" : ""}`}>
              <Link to="/deviceManagement">
                <FaDesktop className="icon" />
                <span className="menu-label">Device Management</span>
              </Link>
            </li>
            <li className={`main-menu ${location.pathname === "/department" ? "active" : ""}`}>
              <Link to="/department">
                <FaUsers className="icon" />
                <span className="menu-label">Department</span>
              </Link>
            </li>
            <li className={`main-menu ${location.pathname === "/video" ? "active" : ""}`}>
              <Link to="/video">
                <FaVideo className="icon" />
                <span className="menu-label">Activity Video</span>
              </Link>
            </li>
            <li className={`main-menu ${location.pathname === "/setting" ? "active" : ""}`}>
              <Link to="/setting">
                <FaCog className="icon" />
                <span className="menu-label">Setting</span>
              </Link>
            </li>
          </ul>
        </div>

      </div>
      <li className="logout">
        <Link to="/">
          <FaSignOutAlt className="icon" />
          <span className="menu-label">   Logout</span>
        </Link>
      </li>
    </div>
  );
};

export default Navbar;
