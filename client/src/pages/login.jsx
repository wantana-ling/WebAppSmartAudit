import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  useEffect(() => {
    setError("");
    localStorage.removeItem("user_id");
    localStorage.removeItem("admin");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${apiBase}/api/login`,
        { user_id, password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      const adminData = res.data.admin_info;
      if (!adminData) { setError("Invalid response from server"); return; }
      localStorage.setItem("user_id", adminData.user_id);
      localStorage.setItem("admin", JSON.stringify(adminData));
      navigate("/dashboard");
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
      <div className="h-full flex flex-col md:flex-row justify-between items-center py-10 overflow-hidden">
        <div className="min-w-[50vw] text-center px-4">
          <img src="../img/company_logo.JPG" alt="company_logo" className="w-3/5 mx-auto" />
        </div>

        <div className="min-w-[50vw] h-full rounded-l-[60px] bg-gradient-to-b from-[#1A2DAC] to-[#0B1246] flex justify-center px-6">
          <div className="w-full max-w-[560px] flex flex-col justify-center items-center text-white gap-5">
            <h1 className="text-3xl font-bold">Login</h1>
            {error && <p className="text-red-400">{error}</p>}

            <form onSubmit={handleLogin} className="w-full">
              <div className="flex flex-col gap-5">
                <input
                  type="text"
                  value={user_id}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  placeholder="Username"
                  className="w-full px-5 py-5 rounded-2xl bg-[#F1F3FF] text-base text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#4DB1D6]"
                />

                <div className="relative flex items-center">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="w-full px-5 py-5 rounded-2xl bg-[#F1F3FF] text-base text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#4DB1D6]"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-5 text-[20px] text-gray-400"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-5 py-5 rounded-2xl bg-[#4DB1D6] text-white text-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed hover:brightness-110 transition"
                >
                  {loading ? "Logging in..." : "Login"}
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
