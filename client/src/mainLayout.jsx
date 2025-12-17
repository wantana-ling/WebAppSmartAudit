import React from "react";
import Navbar from "./navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { STORAGE_KEYS, ROUTES } from './constants';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN) || 'null');
  const companyName = admin?.company || "Company";

  const hideProfileBar = [ROUTES.PROFILE, ROUTES.DASHBOARD].includes(location.pathname);

  return (
    <div className="relative w-full min-h-screen flex">
      <Navbar />

      {!hideProfileBar && (
        <div className="absolute top-3 md:top-4 lg:top-5 right-3 md:right-4 lg:right-5 flex items-center gap-2 z-10">
          <span className="font-semibold text-xs sm:text-sm md:text-base lg:text-[16px] text-black hidden sm:inline">{companyName}</span>
          <button
            onClick={() => navigate(ROUTES.PROFILE)}
            className="inline-flex items-center justify-center rounded-full overflow-hidden"
          >
            <img
              src={process.env.PUBLIC_URL + "/img/default-profile.jpg"}
              alt="Profile"
              className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] md:w-[35px] md:h-[35px] rounded-full object-cover"
            />
          </button>
        </div>
      )}

      <main className="flex-1 ml-[200px] sm:ml-[220px] md:ml-[240px] lg:ml-[260px] p-3 sm:p-4 md:p-5">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
