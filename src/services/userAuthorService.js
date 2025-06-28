import axiosInstance from "../lib/axiosInstance";

/**
 * Service for user-facing author APIs
 */
export const userAuthorService = {
  // Get all authors
  async getAllAuthors() {
    try {
      const response = await axiosInstance.get("/authors");
      return response.data;
    } catch (error) {
      console.error("Error fetching authors:", error);
      throw error;
    }
  },

  // Get author by ID
  async getAuthorById(authorId) {
    try {
      const response = await axiosInstance.get(`/authors/${authorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching author ${authorId}:`, error);
      throw error;
    }
  },
};
