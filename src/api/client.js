import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://ai-travel-planner-backend-pgr6.onrender.com';

const api = axios.create({ baseURL });

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wayfarer_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, clear it so the UI falls back to the
// signed-out state instead of silently failing every subsequent request.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wayfarer_token');
      localStorage.removeItem('wayfarer_user');
    }
    return Promise.reject(err);
  }
);

/** Pulls a readable message out of an axios error for display in the UI. */
export function extractErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  return err?.response?.data?.message || fallback;
}

export default api;
