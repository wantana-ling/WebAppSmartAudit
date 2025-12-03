import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL?.trim() || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
