import axios from 'axios';

const API = axios.create({
  // Correct
   baseURL: 'https://resource-management-system-backend.onrender.com/api',
});

// THIS IS THE KEY: It attaches the token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;