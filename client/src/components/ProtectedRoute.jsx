import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { STORAGE_KEYS, ROUTES } from '../constants';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // ตรวจสอบว่ามี admin ใน localStorage หรือไม่
  const admin = localStorage.getItem(STORAGE_KEYS.ADMIN);
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);

  // ถ้ายังไม่ login ให้ redirect ไปหน้า login พร้อมเก็บ path ที่พยายามเข้าถึง
  if (!admin || !userId) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

