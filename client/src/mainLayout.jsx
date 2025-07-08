import React from "react";
import Navbar from "./navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./css/mainLayout.css";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  const hideProfileBar = ["/profile", "/dashboard"].includes(location.pathname);

  return (
    <div className="main-layout">
      <Navbar />
      <div className="content">
        {/* ✅ เงื่อนไข: แสดงโปรไฟล์เฉพาะบางหน้า */}
        {!hideProfileBar && (
          <div className="top-right-profile">
            <span className="username">{fullName || "Guest"}</span>
            <div className="profile-pic" onClick={() => navigate('/profile')}>
            <button>
              <img
                className="profile-image"
                src={process.env.PUBLIC_URL + "/img/default-profile.jpg"}
                alt="Profile"
              />
            </button>
          </div>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
