import axios from 'axios';

// Central axios instance. Every service file imports this instead of
// calling axios directly, so auth headers and error handling stay in one place.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('astrowatch_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized response handling: normalize error messages and force a
// logout if the token has expired/is invalid.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('astrowatch_token');
      localStorage.removeItem('astrowatch_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    const message =
      error.response?.data?.message ||
      (error.request && !error.response
        ? 'Cannot reach the server. Please check your connection.'
        : 'Something went wrong. Please try again.');

    return Promise.reject({ ...error, message });
  }
);

export default api;
