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
    console.log("Username:", user_id);
    console.log("Password:", password);

    try {
      const response = await axios.post(`${apiBase}/api/login`,
        {
          user_id: user_id,
          password: password
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const userData = response.data.user || response.data.user_info;
      const token = response.data.token || '';

      if (!userData) {
        setError('Invalid response from server');
        return;
      }

      // ✅ Extract name fields and store them
      const user = {
        firstName: userData.first_name || userData.firstname || '',
        lastName: userData.last_name || userData.lastname || '',
        ...userData
      };

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', userData.user_id);

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
