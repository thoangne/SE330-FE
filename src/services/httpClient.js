import axios from "axios";
import { toast } from "react-hot-toast";

// Use environment variable to determine if we should use proxy or direct URL
const USE_PROXY = import.meta.env.VITE_USE_PROXY === "true";
const API_DIRECT_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://quanlynhasach-be.onrender.com/api";

export const API_BASE_URL =
  USE_PROXY && import.meta.env.DEV ? "/api" : API_DIRECT_URL;

export const ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REGISTER: "/users/register",
  REFRESH_TOKEN: "/auth/refresh-token",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  USERS_UPDATE: "/users",
};

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increase timeout for slower connections
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Log configuration info in development
if (import.meta.env.DEV) {
  console.log("🔗 HTTP Client Configuration:");
  console.log("   Base URL:", API_BASE_URL);
  console.log("   Use Proxy:", USE_PROXY);
  console.log("   Direct URL:", API_DIRECT_URL);
}

// Request interceptor
httpClient.interceptors.request.use(
  async (config) => {
    // Don't add token to login/register/forgot-password endpoints
    const noAuthEndpoints = [
      ENDPOINTS.LOGIN,
      ENDPOINTS.REGISTER,
      ENDPOINTS.FORGOT_PASSWORD,
      ENDPOINTS.RESET_PASSWORD,
    ];

    const isNoAuthEndpoint = noAuthEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (!isNoAuthEndpoint) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If another request is already refreshing the token, wait for it
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh token using cookie
        const response = await httpClient.post(ENDPOINTS.REFRESH_TOKEN);
        const { accessToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        httpClient.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;

        processQueue(null, accessToken);

        // Retry the original request
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // If refresh token is expired, logout user
        localStorage.removeItem("accessToken");

        // Import useAuthStore dynamically to avoid circular dependencies
        const { useAuthStore } = await import("../stores/useAuthStore");
        useAuthStore.getState().logout();

        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If the error is not 401 or we've already tried to refresh
    return Promise.reject(error);
  }
);

export default httpClient;
