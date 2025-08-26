import axios from 'axios';

const API_BASE =
  process.env.REACT_APP_API_URL ||
  (import.meta?.env ? import.meta.env.VITE_API_BASE : '') ||
  'http://localhost:3002';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
