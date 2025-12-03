import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartBar, FaUserEdit, FaVideo, FaDesktop, FaSignOutAlt, FaUsers, FaUser, FaCog
} from "react-icons/fa";
import { STORAGE_KEYS, ROUTES, MESSAGES } from './constants';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // ลบข้อมูลใน localStorage
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.ADMIN);
    // Redirect ไปหน้า login
    navigate(ROUTES.LOGIN, { replace: true });
  };
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  const liBase =
    "group relative pl-[8px] md:pl-[10px] pr-[60px] md:pr-[90px] lg:pr-[110px] py-[12px] md:py-[15px] ml-[10px] md:ml-[15px] lg:ml-[20px] mb-[15px] md:mb-[20px] rounded-l-[20px] md:rounded-l-[25px] lg:rounded-l-[30px]";
  const linkBase =
    "w-full ml-[8px] md:ml-[10px] text-white no-underline flex items-center gap-[8px] md:gap-[10px] transition-all duration-500 text-sm md:text-base";
  const linkHover = "group-hover:ml-[20px] md:group-hover:ml-[25px] lg:group-hover:ml-[30px] group-hover:font-medium";
  const activeShell =
    "bg-white text-[#0B1246] rounded-tl-full rounded-bl-full";
  const activeCurveBefore =
    "before:content-[''] before:absolute before:right-0 before:-top-[50px] before:w-[50px] before:h-[50px] before:rounded-full before:shadow-[35px_35px_0_10px_#ffffff]";
  const activeCurveAfter =
    "after:content-[''] after:absolute after:right-0 after:-bottom-[50px] after:w-[50px] after:h-[50px] after:rounded-full after:shadow-[35px_-35px_0_10px_#ffffff]";

  return (
    <aside className="fixed w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] xl:w-[280px] 2xl:w-[300px] 3xl:w-[320px] 4xl:w-[360px] h-screen bg-gradient-to-b from-[#1A2DAC] to-[#0B1246] rounded-r-[20px] md:rounded-r-[30px] lg:rounded-r-[40px] flex flex-col justify-between z-50">
      <div className="flex flex-col text-white overflow-hidden py-[20px] md:py-[25px] lg:py-[30px] gap-[40px] md:gap-[50px] lg:gap-[60px]">
        <div className="text-center -mt-[5px] md:-mt-[10px] -mb-[30px] md:-mb-[40px]">
          <img
            className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] lg:w-[90px] lg:h-[90px] xl:w-[100px] xl:h-[100px] mx-auto"
            src="/img/Logo-SmartAudit.png"
            alt="smartAudit-logo"
          />
        </div>

      <nav className="px-0">
        <ul className="flex flex-col gap-2">
          {/* Dashboard */}
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
              <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
                <FaChartBar className="text-[16px] md:text-[18px] lg:text-[20px]" />
              </div>
              <span className="menu-label text-xs md:text-sm lg:text-base">Dashboard</span>
            </Link>
          </li>

          {/* Active Visitor */}
          <li
            className={`${liBase} ${
              isActive("/activeVisitor")
                ? `${activeShell} ${activeCurveBefore} ${activeCurveAfter}`
                : ""
            }`}
          >
            <Link
              to="/activeVisitor"
              className={`${linkBase} ${linkHover} ${
                isActive("/activeVisitor") ? "!text-[#0B1246]" : ""
              }`}
            >
              <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
                <FaUser className="text-[16px] md:text-[17px] lg:text-[18px]" />
              </div>
              <span className="menu-label text-xs md:text-sm lg:text-base">Active Visitor</span>
            </Link>
          </li>

          {/* User Management */}
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
              <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
                <FaUserEdit className="text-[16px] md:text-[17px] lg:text-[18px]" />
              </div>
              <span className="menu-label text-xs md:text-sm lg:text-base">User Management</span>
            </Link>
          </li>

          {/* Device Management */}
          <li
            className={`${liBase} ${
              ["/deviceManagement", "/addDevice"].includes(location.pathname)
                ? `${activeShell} ${activeCurveBefore} ${activeCurveAfter}`
                : ""
            }`}
          >
            <Link
              to="/deviceManagement"
              className={`${linkBase} ${linkHover} ${
                ["/deviceManagement", "/addDevice"].includes(location.pathname)
                  ? "!text-[#0B1246]"
                  : ""
              }`}
            >

              <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
                <FaDesktop className="text-[16px] md:text-[18px] lg:text-[20px]" />
              </div>
              <span className="menu-label text-xs md:text-sm lg:text-base">Device Management</span>
            </Link>
          </li>

          {/* Department */}
          <li
            className={`${liBase} ${
              ["/department","addDepartment","editDepartment/"].includes(location.pathname)
                ? `${activeShell} ${activeCurveBefore} ${activeCurveAfter}`
                : ""
            }`}
          >
            <Link
              to="/department"
              className={`${linkBase} ${linkHover} ${
                ["/department","addDepartment","editDepartment/"].includes(location.pathname)
                  ? "!text-[#0B1246]"
                  : ""
              }`}
            >
              <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
                <FaUsers className="text-[16px] md:text-[18px] lg:text-[20px]" />
              </div>
              <span className="menu-label text-xs md:text-sm lg:text-base">Department</span>
            </Link>
          </li>

          {/* Activity Video */}
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
              <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
                <FaVideo className="text-[16px] md:text-[18px] lg:text-[20px]" />
              </div>
              <span className="menu-label text-xs md:text-sm lg:text-base">Activity Video</span>
            </Link>
          </li>

          {/* Setting */}
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
              <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
                <FaCog className="text-[16px] md:text-[18px] lg:text-[20px]" />
              </div>
              <span className="menu-label text-xs md:text-sm lg:text-base">Setting</span>
            </Link>
          </li>
        </ul>
      </nav>

      </div>

      <ul className="list-none text-center m-[30px] md:m-[40px] lg:m-[50px] mb-[30px] md:mb-[40px] lg:mb-[50px]">
        <li>
          <button
            onClick={handleLogout}
            className="text-white no-underline flex items-center justify-center gap-2 hover:underline font-extralight text-sm md:text-base bg-transparent border-none cursor-pointer w-full"
          >
            <FaSignOutAlt className="icon text-[18px] md:text-[20px] lg:text-[24px]" />
            <span className="menu-label">{MESSAGES.LOGOUT}</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Navbar;
