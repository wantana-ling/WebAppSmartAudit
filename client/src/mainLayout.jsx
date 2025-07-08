import React from "react";
import Navbar from "./navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
