import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api";
import { STORAGE_KEYS, MESSAGES, ROUTES, PLACEHOLDERS } from '../constants';

const Login = () => {
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ตรวจสอบว่าถ้า login แล้วให้ redirect ไป dashboard
    const admin = localStorage.getItem(STORAGE_KEYS.ADMIN);
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    
    if (admin && userId) {
      // ถ้ามี path ที่พยายามเข้าถึงก่อนหน้า ให้ไปที่ path นั้น
      const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
      return;
    }

    setError("");
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.ADMIN);
  }, [navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post('/api/login', { user_id, password });
      const adminData = res.data.admin_info;
      if (!adminData) { setError("Invalid response from server"); return; }
      localStorage.setItem(STORAGE_KEYS.USER_ID, adminData.user_id);
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(adminData));
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      if (err.response?.status === 429) setError("Too many attempts. Please wait a moment.");
      else if (err.response?.status === 401) setError("Invalid user_id or password");
      else setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="h-full flex flex-col md:flex-row justify-between items-center py-6 sm:py-8 md:py-10 overflow-hidden">
        <div className="w-full md:min-w-[50vw] text-center px-4 sm:px-6 md:px-8 py-6 md:py-0">
          <img src="../img/company_logo.JPG" alt="company_logo" className="w-2/3 sm:w-3/5 md:w-3/5 mx-auto max-w-[300px] md:max-w-none" />
        </div>

        <div className="min-w-[50vw] h-full rounded-l-[60px] bg-gradient-to-b from-[#1A2DAC] to-[#0B1246] flex justify-center px-6">
          <div className="w-full max-w-[560px] flex flex-col justify-center items-center text-white gap-5">
            <h1 className="text-3xl font-bold">Login</h1>
            {error && <p className="text-red-400">{error}</p>}

            <form onSubmit={handleLogin} className="w-full">
              <div className="flex flex-col gap-4 md:gap-5">
                <input
                  type="text"
                  value={user_id}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder={PLACEHOLDERS.USERNAME}
                  className="w-full px-4 py-3 md:px-5 md:py-4 lg:py-5 rounded-xl md:rounded-2xl bg-[#F1F3FF] text-sm md:text-base text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#4DB1D6]"
                />

                <div className="relative flex items-center">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder={PLACEHOLDERS.PASSWORD}
                    className="w-full px-4 py-3 md:px-5 md:py-4 lg:py-5 rounded-xl md:rounded-2xl bg-[#F1F3FF] text-sm md:text-base text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#4DB1D6] pr-10 md:pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 md:right-4 lg:right-5 text-[18px] md:text-[20px] text-gray-400"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 md:px-5 md:py-4 lg:py-5 rounded-xl md:rounded-2xl bg-[#4DB1D6] text-white text-base md:text-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed hover:brightness-110 transition"
                >
                  {loading ? MESSAGES.LOGGING_IN : MESSAGES.LOGIN}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
