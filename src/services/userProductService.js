import axiosInstance from "../lib/axiosInstance";

/**
 * Service for user-facing product APIs
 * Maps to the actual backend endpoints for product browsing
 */
export const userProductService = {
  // Get all products (no pagination)
  async getAllProducts() {
    try {
      const response = await axiosInstance.get("/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  },

  // Get products with discount (no pagination)
  async getDiscountProducts() {
    try {
      const response = await axiosInstance.get("/products/discount");
      return response.data;
    } catch (error) {
      console.error("Error fetching discount products:", error);
      throw error;
    }
  },

  // Get products by rating (highest rated, no pagination)
  async getHighRatedProducts() {
    try {
      const response = await axiosInstance.get("/products/rating");
      return response.data;
    } catch (error) {
      console.error("Error fetching high-rated products:", error);
      throw error;
    }
  },

  // Get products by category (categoryId in URL path)
  async getProductsByCategory(categoryId) {
    try {
      const response = await axiosInstance.get(
        `/products/category/${categoryId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching products for category ${categoryId}:`,
        error
      );
      throw error;
    }
  },

  // Get product by ID
  async getProductById(productId) {
    try {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  // Get product by slug or ID (auto-detect)
  async getProductBySlugOrId(slugOrId) {
    try {
      // First try to get by ID (if it's a number)
      if (/^\d+$/.test(slugOrId)) {
        return await this.getProductById(slugOrId);
      }

      // If not a number, assume it's a slug and search through all products
      const allProducts = await this.getAllProducts();
      const productBySlug = allProducts.find(
        (product) => product.slug === slugOrId
      );

      if (!productBySlug) {
        throw new Error(`Product not found with slug: ${slugOrId}`);
      }

      return productBySlug;
    } catch (error) {
      console.error(`Error fetching product by slug/id ${slugOrId}:`, error);
      throw error;
    }
  },

  // Search products by name
  async searchProducts(query) {
    try {
      const response = await axiosInstance.get(
        `/products/search?name=${query}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  // For Home page - map existing functions to real API calls
  // Featured products = High rated products (limit on frontend)
  async getFeaturedProducts(limit = 8) {
    try {
      const products = await userProductService.getHighRatedProducts();
      return Array.isArray(products) ? products.slice(0, limit) : [];
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  // Best discount products (limit on frontend)
  async getBestDiscountProducts(limit = 8) {
    try {
      const products = await userProductService.getDiscountProducts();
      return Array.isArray(products) ? products.slice(0, limit) : [];
    } catch (error) {
      console.error("Error fetching best discount products:", error);
      throw error;
    }
  },

  // New products = All products (limit on frontend)
  async getNewProducts(limit = 8) {
    try {
      const products = await userProductService.getAllProducts();
      return Array.isArray(products) ? products.slice(0, limit) : [];
    } catch (error) {
      console.error("Error fetching new products:", error);
      throw error;
    }
  },

  // Daily suggestions = All products (random selection)
  async getDailyProducts(limit = 8) {
    try {
      const products = await userProductService.getAllProducts();
      if (!Array.isArray(products)) return [];

      // Shuffle array and take first 'limit' items
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error("Error fetching daily products:", error);
      throw error;
    }
  },
};
