import React from "react";
import Navbar from "./navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const companyName = admin?.company || "Company";

  const hideProfileBar = ["/profile", "/dashboard"].includes(location.pathname);

  return (
    <div className="relative w-full min-h-screen flex">
      <Navbar />

      {!hideProfileBar && (
        <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
          <span className="font-semibold text-[16px] text-black">{companyName}</span>
          <button
            onClick={() => navigate("/profile")}
            className="inline-flex items-center justify-center rounded-full overflow-hidden"
          >
            <img
              src={process.env.PUBLIC_URL + "/img/default-profile.jpg"}
              alt="Profile"
              className="w-[35px] h-[35px] rounded-full object-cover"
            />
          </button>
        </div>
      )}

      <main className="flex-1 ml-[21vw] p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
