import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle Token Expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // DEBUG: See the actual message from the backend
      console.error("Backend Auth Error:", error.response.data.message);
      
      // Only logout if it's a real expiration, not a logic error
      if (error.response.data.message === "Not authorized, token failed") {
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
export default api;