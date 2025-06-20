/**
 * CORS and API URL utilities
 */

export const getApiBaseUrl = () => {
  // Check environment variable first
  const USE_PROXY = import.meta.env.VITE_USE_PROXY === "true";
  const API_DIRECT_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://quanlynhasach-be.onrender.com/api";

  // If proxy is disabled or we're in production, use direct URL
  if (!USE_PROXY || !import.meta.env.DEV) {
    return API_DIRECT_URL;
  }

  // Otherwise use proxy
  return "/api";
};
