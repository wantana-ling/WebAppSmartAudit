import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./mainLayout";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Permission from "./pages/permission";
import Video from "./pages/video";
import PasswordEdit from "./pages/passwordEdit";

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />

        
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/permission" element={<Permission />} />
          <Route path="/video" element={<Video />} />
          <Route path="/passwordEdit" element={<PasswordEdit />} />
        </Route>
      </Routes>
  );
};

export default App;
