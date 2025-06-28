import axiosInstance from "../lib/axiosInstance";

/**
 * Service for user-facing compose APIs (author-product relationships)
 */
export const userComposeService = {
  // Get all compose relationships
  async getAllComposes() {
    try {
      const response = await axiosInstance.get("/compose");
      return response.data;
    } catch (error) {
      console.error("Error fetching compose relationships:", error);
      throw error;
    }
  },

  // Get authors for a specific product
  async getAuthorsByProductId(productId) {
    try {
      const response = await axiosInstance.get(`/compose/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching authors for product ${productId}:`, error);
      throw error;
    }
  },

  // Get products by a specific author
  async getProductsByAuthorId(authorId) {
    try {
      const response = await axiosInstance.get(`/compose/author/${authorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for author ${authorId}:`, error);
      throw error;
    }
  },
};
