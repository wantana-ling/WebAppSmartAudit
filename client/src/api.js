import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL?.trim() || 'http://192.168.121.195:3002';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // เพื่อให้ cookie JWT ไปกับ request
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
