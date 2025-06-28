import axiosInstance from "../lib/axiosInstance";

/**
 * Service for user-facing category APIs
 */
export const userCategoryService = {
  // Get all categories
  async getAllCategories() {
    try {
      const response = await axiosInstance.get("/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get category by ID
  async getCategoryById(categoryId) {
    try {
      const response = await axiosInstance.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      throw error;
    }
  },
};
