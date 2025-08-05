import React from "react";
import Navbar from "./navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./css/mainLayout.css";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const companyName = admin?.company || "Company";

  const hideProfileBar = ["/profile", "/dashboard"].includes(location.pathname);

  return (
    <div className="main-layout">
      <Navbar />

      {!hideProfileBar && (
        <div className="top-right-profile">
          <span className="username">{companyName}</span>
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
    </div>
  );
};

export default MainLayout;
