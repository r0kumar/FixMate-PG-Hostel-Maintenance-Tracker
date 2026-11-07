import axios from 'axios';

// Ensure baseURL properly terminates with '/api' without trailing slashes or duplicate segments
const resolveBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return 'http://localhost:5000/api';

  const cleanUrl = envUrl.trim().replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach real Bearer token to headers
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('fixmate_real_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {
        localStorage.removeItem('fixmate_real_user');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized for real user sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't wipe storage on initial login attempt failure
      const isLoginOrRegister =
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/register');
      if (!isLoginOrRegister) {
        localStorage.removeItem('fixmate_real_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
