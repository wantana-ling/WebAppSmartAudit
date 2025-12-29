import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL?.trim();

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
