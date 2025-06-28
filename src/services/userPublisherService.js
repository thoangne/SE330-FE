import axiosInstance from "../lib/axiosInstance";

/**
 * Service for user-facing publisher APIs
 */
export const userPublisherService = {
  // Get all publishers
  async getAllPublishers() {
    try {
      const response = await axiosInstance.get("/publishers");
      return response.data;
    } catch (error) {
      console.error("Error fetching publishers:", error);
      throw error;
    }
  },

  // Get publisher by ID
  async getPublisherById(publisherId) {
    try {
      const response = await axiosInstance.get(`/publishers/${publisherId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching publisher ${publisherId}:`, error);
      throw error;
    }
  },
};
