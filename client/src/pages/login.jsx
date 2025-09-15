import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';

const Login = () => {
  const [user_id, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:3002";

  useEffect(() => {
    setError('');
    localStorage.removeItem('user_id');
    localStorage.removeItem('admin');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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

      localStorage.setItem('user_id', adminData.user_id);
      localStorage.setItem('admin', JSON.stringify(adminData));
 
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many attempts. Please wait a moment.');
      } else if (err.response?.status === 401) {
        setError('Invalid user_id or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
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

                <button type='submit' disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    <style>{`
    .login-page {
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 40px 0px;
      overflow: hidden;
    }

    .login-logo {
        min-width: 50vw;
        text-align: center;
    }

    .login-logo img {
        width: 60%;
        text-align: center;
    }

    .login-background {
        min-width: 50vw;
        height: 100%;
        border-radius: 60px 0px 0px 60px;
        background: var(--background-gradient);
        display: flex;
        justify-content: center;
    }

    .login-input {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        gap: 20px;
    }


    .login-form {
        min-width: 30vw;
        display: flex;
        flex-direction: column;
        gap: 20px;
        
    }

    .login-input input {
        width: 100%;
        border: none;
        padding: 20px;
        border-radius: 20px;
        background-color: var(--input-color);
        font-size: medium;
    }

    .login-input button {
        width: 100%;
        border: none;
        padding: 20px;
        border-radius: 20px;
        background-color: var(--ligthblue-color);
        font-size: large;
        font-weight: 600;
        color: white;
    }
    .container {
      width: 100%;
      height: 100vh;
    }
    `}</style>
    </div>
  );
};

export default Login;
