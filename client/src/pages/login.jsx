import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';

const Login = () => {
  const [user_id, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  const apiBase = process.env.REACT_APP_API_URL || "http://192.168.121.195:3002";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiBase}/api/login`,
        {
          user_id,
          password
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const adminData = response.data.admin_info;

      if (!adminData) {
        setError('Invalid response from server');
        return;
      }

      // ✅ เก็บ user_id ไว้ใน localStorage
      localStorage.setItem('user_id', adminData.user_id);
      localStorage.setItem('admin', JSON.stringify(adminData));

      navigate('/dashboard');
    } catch (err) {
      setError('Invalid user_id or password');
    }
  };

  return (
    <div className='container'>
      <div className='login-page'>
        <div className='login-logo'>
          <img src="../img/company_logo.JPG" alt="" />
        </div>
        <div className='login-background'>
          <div className='login-input'>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
              <div className='login-form'>
                <input
                  type="text"
                  value={user_id}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  placeholder='Username'
                />

                <div className="password-container">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder='Password'
                  />
                  <span onClick={() => setShow(!show)}>
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <button type='submit'>
                  Login
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
