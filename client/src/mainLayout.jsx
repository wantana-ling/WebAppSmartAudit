import React from "react";
import Navbar from "./navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const fullName = `${user.firstname || ""} ${user.midname || ""} ${user.lastname || ""}`.trim();

  const hideProfileBar = ["/profile", "/dashboard"].includes(location.pathname);

  return (
    <div className="main-layout">
      <Navbar />

      {/* ✅ ย้ายโปรไฟล์ออกจาก .content */}
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

      <div className="content">
        <Outlet />
      </div>
    <style>{`
    .top-right-profile {
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 10;
    }


    .username {
      font-weight: 600;
      font-size: 16px;
      color: #000;
    }

    .profile-img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      object-fit: cover;
    }
    `}</style>
    </div>
  );
};

export default MainLayout;
