import axios from "axios";

// const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8006';
const API_BASE = 'http://127.0.0.1:8006';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  // withCredentials: false for token flow
});

// Attach token from localStorage (fallback) on each request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

// Simple 401 handler (tries refresh if you implement it; otherwise redirects)
api.interceptors.response.use(
  res => res,
  async err => {
    const { response } = err;
    if (response && response.status === 401) {
      // Option A: attempt refresh token logic here (see notes below).
      // Option B (simple): clear auth and force login
      localStorage.removeItem('token');
      // You could emit an event or use window.location to redirect:
      window.location.href = '/api/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
