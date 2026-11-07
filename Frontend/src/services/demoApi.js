import axios from 'axios';

// Ensure baseURL terminates with '/api/demo' without duplicate slashes
const resolveDemoBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const base = envUrl ? envUrl.trim().replace(/\/+$/, '') : 'http://localhost:5000/api';
  const cleanBase = base.endsWith('/api') ? base : `${base}/api`;
  return `${cleanBase}/demo`;
};

const demoApi = axios.create({
  baseURL: resolveDemoBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach dedicated demo token to headers
demoApi.interceptors.request.use(
  (config) => {
    const storedDemo = localStorage.getItem('fixmate_demo_session');
    if (storedDemo) {
      try {
        const parsed = JSON.parse(storedDemo);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {
        localStorage.removeItem('fixmate_demo_session');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized for demo sessions
demoApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isDemoLogin = error.config?.url?.includes('/auth/login');
      if (!isDemoLogin) {
        localStorage.removeItem('fixmate_demo_session');
      }
    }
    return Promise.reject(error);
  }
);

export default demoApi;

