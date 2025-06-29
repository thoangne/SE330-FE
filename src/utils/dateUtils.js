/**
 * Utility functions for date and time formatting
 * Provides consistent datetime formatting across the application
 */

/**
 * Format date for backend API calls
 * Backend expects format: YYYY-MM-DDTHH:mm:ss (ISO format without timezone/milliseconds)
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export const formatDateTimeForAPI = (date = new Date()) => {
  // Ensure we have a valid Date object
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  // Check if date is valid
  if (isNaN(date.getTime())) {
    date = new Date();
  }

  // Format as YYYY-MM-DDTHH:mm:ss (ISO format without timezone/milliseconds)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

/**
 * Format date for display to user (Vietnamese format)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateForDisplay = (date) => {
  if (!date) return "";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  return dateObj.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Format date for display without time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateOnly = (date) => {
  if (!date) return "";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  return dateObj.toLocaleDateString("vi-VN");
};

/**
 * Parse date from API response
 * Handles various date formats that might come from backend
 * @param {string} dateString - Date string from API
 * @returns {Date} Parsed Date object
 */
export const parseDateFromAPI = (dateString) => {
  if (!dateString) return null;

  // Handle ISO format without timezone: YYYY-MM-DDTHH:mm:ss
  if (
    typeof dateString === "string" &&
    dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
  ) {
    // Add timezone for proper parsing
    return new Date(dateString + ".000Z");
  }

  // Handle MySQL DATETIME format: YYYY-MM-DD HH:mm:ss
  if (
    typeof dateString === "string" &&
    dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
  ) {
    // Convert to ISO format for parsing
    const isoString = dateString.replace(" ", "T") + ".000Z";
    return new Date(isoString);
  }

  // Handle standard ISO format with timezone
  return new Date(dateString);
};

/**
 * Get current timestamp for API calls
 * @returns {string} Current timestamp in API format
 */
export const getCurrentTimestamp = () => {
  return formatDateTimeForAPI();
};

/**
 * Check if a date is valid
 * @param {Date|string} date - Date to validate
 * @returns {boolean} True if valid
 */
export const isValidDate = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return !isNaN(dateObj.getTime());
};
