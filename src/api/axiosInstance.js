import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens
} from "./tokenService";

const REMOTE = import.meta.env.VITE_API_BASE_URL || "https://civic-h9ti.onrender.com";

// In development → proxy through Vite → baseURL = ""
// In production   → use REMOTE URL
const baseURL = import.meta.env.DEV ? "" : REMOTE;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Queue for failed requests when refresh is happening
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Attach Access Token to every request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 / 403 → refresh flow
api.interceptors.response.use(
  (res) => res,

  async (err) => {
    const originalRequest = err.config;

    // If access token expired
    if ((err.response?.status === 401 || err.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      // If refresh already happening → queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const refreshUrl = import.meta.env.DEV
          ? "/api/auth/refresh"          // Vite proxy
          : `${REMOTE}/api/auth/refresh`; // Production URL

        const refreshResponse = await axios.post(
          refreshUrl,
          { refreshToken: getRefreshToken() }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        const newRefreshToken = refreshResponse.data.refreshToken;

        // Save tokens
        setAuthTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          loginId: refreshResponse.data.loginId,
        });

        // Update axios default header
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        // Resolve queued requests
        processQueue(null, newAccessToken);

        // Retry the failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Fail all queued requests
        processQueue(refreshError, null);
        clearAuthTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    // If no refresh condition → reject error
    return Promise.reject(err);
  }
);

export default api;
