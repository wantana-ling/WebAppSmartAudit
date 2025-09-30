import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChartBar, FaUserEdit, FaVideo, FaDesktop, FaSignOutAlt, FaUsers, FaUser, FaCog
} from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  const liBase =
    "group relative pl-[10px] pr-[110px] py-[15px] ml-[20px] mb-[20px] rounded-l-[30px]";
  const linkBase =
    "w-full ml-[10px] text-white no-underline flex items-center gap-[10px] transition-all duration-500";
  const linkHover = "group-hover:ml-[30px] group-hover:font-medium";
  const activeShell =
    "bg-white text-[#0B1246] rounded-tl-full rounded-bl-full";
  const activeCurveBefore =
    "before:content-[''] before:absolute before:right-0 before:-top-[50px] before:w-[50px] before:h-[50px] before:rounded-full before:shadow-[35px_35px_0_10px_#ffffff]";
  const activeCurveAfter =
    "after:content-[''] after:absolute after:right-0 after:-bottom-[50px] after:w-[50px] after:h-[50px] after:rounded-full after:shadow-[35px_-35px_0_10px_#ffffff]";

  return (
    <aside className="fixed w-[21vw] h-screen bg-gradient-to-b from-[#1A2DAC] to-[#0B1246] rounded-r-[40px] flex flex-col justify-between">
      <div className="flex flex-col text-white overflow-hidden py-[30px] gap-[60px]">
        <div className="text-center -mt-[10px] -mb-[40px]">
          <img
            className="w-[100px] h-[100px] mx-auto md:w-[100px] md:h-[100px] w-[60px] h-[60px]"
            src="/img/Logo-SmartAudit.png"
            alt="smartAudit-logo"
          />
        </div>

        <nav className="px-0">
          <ul>
            <li
              className={`${liBase} ${
                isActive("/dashboard")
                  ? `${activeShell} ${activeCurveBefore} ${activeCurveAfter}`
                  : ""
              }`}
            >
              <Link
                to="/dashboard"
                className={`${linkBase} ${linkHover} ${
                  isActive("/dashboard") ? "!text-[#0B1246]" : ""
                }`}
              >
                <FaChartBar className="icon text-[24px]" />
                <span className="menu-label hidden md:inline">Dashboard</span>
              </Link>
            </li>

            <li
              className={`${liBase} ${
                isActive("/acticveVisitor")
                  ? `${activeShell} ${activeCurveBefore} ${activeCurveAfter}`
                  : ""
              } md:pl-[10px] md:pr-0 md:ml-[10px]`}
            >
              <Link
                to="/acticveVisitor"
                className={`${linkBase} ${linkHover} ${
                  isActive("/acticveVisitor") ? "!text-[#0B1246]" : ""
                }`}
              >
                <FaUser className="icon text-[24px]" />
                <span className="menu-label hidden md:inline">Active Visitor</span>
              </Link>
            </li>

            <li
              className={`${liBase} ${
                isActive("/userManagement")
                  ? `${activeShell} ${activeCurveBefore} ${activeCurveAfter}`
                  : ""
              }`}
            >
              <Link
                to="/userManagement"
                className={`${linkBase} ${linkHover} ${
                  isActive("/userManagement") ? "!text-[#0B1246]" : ""
                }`}
              >
                <FaUserEdit className="icon text-[24px]" />
                <span className="menu-label hidden md:inline">User Management</span>
              </Link>
            </li>

            <li
              className={`${liBase} ${
                isActive("/deviceManagement")
                  ? `${activeShell} ${activeCurveBefore} ${activeCurveAfter}`
                  : ""
              }`}
            >
              <Link
                to="/deviceManagement"
                className={`${linkBase} ${linkHover} ${
                  isActive("/deviceManagement") ? "!text-[#0B1246]" : ""
                }`}
              >
                <FaDesktop className="icon text-[24px]" />
                <span className="menu-label hidden md:inline">Device Management</span>
              </Link>
            </li>

            <li
              className={`${liBase} ${
                isActive("/department")
                  ? `${activeShell} ${activeCurveBefore} ${activeCurveAfter}`
                  : ""
              }`}
            >
              <Link
                to="/department"
                className={`${linkBase} ${linkHover} ${
                  isActive("/department") ? "!text-[#0B1246]" : ""
                }`}
              >
                <FaUsers className="icon text-[24px]" />
                <span className="menu-label hidden md:inline">Department</span>
              </Link>
            </li>

            <li
              className={`${liBase} ${
                isActive("/video")
                  ? `${activeShell} ${activeCurveBefore} ${activeCurveAfter}`
                  : ""
              }`}
            >
              <Link
                to="/video"
                className={`${linkBase} ${linkHover} ${
                  isActive("/video") ? "!text-[#0B1246]" : ""
                }`}
              >
                <FaVideo className="icon text-[24px]" />
                <span className="menu-label hidden md:inline">Activity Video</span>
              </Link>
            </li>

            <li
              className={`${liBase} ${
                isActive("/setting")
                  ? `${activeShell} ${activeCurveBefore} ${activeCurveAfter}`
                  : ""
              }`}
            >
              <Link
                to="/setting"
                className={`${linkBase} ${linkHover} ${
                  isActive("/setting") ? "!text-[#0B1246]" : ""
                }`}
              >
                <FaCog className="icon text-[24px]" />
                <span className="menu-label hidden md:inline">Setting</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <ul className="list-none text-center m-[50px] mb-[50px]">
        <li>
          <Link
            to="/"
            className="text-white no-underline flex items-center justify-center gap-2 hover:underline font-extralight"
          >
            <FaSignOutAlt className="icon text-[24px]" />
            <span className="menu-label hidden md:inline">Logout</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Navbar;
