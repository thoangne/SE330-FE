import httpClient from "./httpClient";

/**
 * Service for user cart operations
 * Handles cart management for authenticated users
 * Uses httpClient for authorized requests
 */
export const userCartService = {
  // Get cart by user ID
  async getCartByUserId(userId) {
    try {
      const response = await httpClient.get(`/carts/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cart for user ${userId}:`, error);
      throw error;
    }
  },

  // Get cart by cart ID (internal method)
  async getCartById(cartId) {
    try {
      const response = await httpClient.get(`/carts/id/${cartId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cart ${cartId}:`, error);
      throw error;
    }
  },

  // Create cart for user (if no cart exists)
  async createCart(userId) {
    try {
      const response = await httpClient.post(`/carts/create/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error creating cart for user ${userId}:`, error);
      throw error;
    }
  },

  // Add item to user's cart
  async addToCart(userId, productId, quantity) {
    try {
      const response = await httpClient.post(`/carts/${userId}/add`, null, {
        params: {
          productId,
          quantity,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding product ${productId} to cart:`, error);
      throw error;
    }
  },

  // Get cart items (for order creation)
  async getCartItems(cartId) {
    try {
      const response = await httpClient.get(`/carts/${cartId}/items`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cart items for cart ${cartId}:`, error);
      throw error;
    }
  },

  // Remove product from user's cart
  async removeFromCart(userId, productId) {
    try {
      const response = await httpClient.delete(
        `/carts/${userId}/remove/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error removing product ${productId} from cart:`, error);
      throw error;
    }
  },

  // Update quantity (combine remove + add)
  async updateQuantity(userId, productId, newQuantity) {
    try {
      // Remove existing item
      await this.removeFromCart(userId, productId);

      // Add with new quantity
      if (newQuantity > 0) {
        return await this.addToCart(userId, productId, newQuantity);
      }

      return { success: true };
    } catch (error) {
      console.error(`Error updating quantity for product ${productId}:`, error);
      throw error;
    }
  },
};
