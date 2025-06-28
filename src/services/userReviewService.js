import axiosInstance from "../lib/axiosInstance";
import httpClient from "./httpClient";

/**
 * Service for user-facing review APIs
 * Uses axiosInstance for public endpoints (reading reviews)
 * Uses httpClient for authenticated endpoints (creating reviews)
 */
export const userReviewService = {
  // Get all reviews
  async getAllReviews() {
    try {
      const response = await axiosInstance.get("/reviews");
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  // Get review by ID
  async getReviewById(reviewId) {
    try {
      const response = await axiosInstance.get(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching review ${reviewId}:`, error);
      throw error;
    }
  },

  // Get reviews for a specific product
  async getReviewsByProductId(productId) {
    try {
      const response = await axiosInstance.get(`/reviews/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error;
    }
  },

  // Create a new review (requires authentication)
  async createReview(reviewData) {
    try {
      const response = await httpClient.post("/reviews", reviewData);
      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },
};
