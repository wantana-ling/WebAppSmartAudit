import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./mainLayout";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Permission from "./pages/permission";
import Video from "./pages/video";
import EditUser from "./pages/editUser";
import UserManagement from "./pages/userManagement";
import DeviceManagement from "./pages/deviceManagement";
import Department from "./pages/department";
import Setting from "./pages/setting";
import AddUser from "./pages/addUser";
import EditMagnageUser from "./pages/editManageUser"; 
import DeleteUserManagement from "./pages/deleteUserManagement";
import AddDevice from "./pages/addDevice";
import DeleteDevice from "./pages/deleteDevice";
import EditDevice from "./pages/editDevice";
import AddDepartment from "./pages/addDepartment";
import EditDepartment from "./pages/editDepartment";
import DeleteDepartment from "./pages/deleteDepartment";
import ActiveVisitor from "./pages/activevisitor"; 
import LiveScreen from "./pages/livescreen";
import Test from "./pages/test";
const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />

        
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/permission" element={<Permission />} />
          <Route path="/video" element={<Video />} />
          <Route path="/passwordEdit" element={<EditUser />} />
          <Route path="/userManagement" element={<UserManagement />} />
          <Route path="/deviceManagement" element={<DeviceManagement />} />
          <Route path="/department" element={<Department />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/editManageUser/:id" element={<EditMagnageUser />} />
          <Route path="/deleteUserManagement" element={<DeleteUserManagement />} />
          <Route path="/addDevice" element={<AddDevice />} />
          <Route path="/deleteDevice" element={<DeleteDevice />} />
          <Route path="/editDevice/:id" element={<EditDevice />} />
          <Route path="/addDepartment" element={<AddDepartment />} />
          <Route path="/editDepartment/:id" element={<EditDepartment />} />
          <Route path="/deleteDepartment" element={<DeleteDepartment />} />
          <Route path="acticveVisitor/*" element={<ActiveVisitor />} />
          <Route path="acticveVisitor/liveScreen" element={<LiveScreen />} />
          <Route path="/Test" element={<Test />} />
        </Route>
      </Routes>
  );
};

export default App;
