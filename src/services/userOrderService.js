import httpClient from "./httpClient";
import { formatDateTimeForAPI } from "../utils/dateUtils";

/**
 * Service for user order operations
 * Handles order creation and management for authenticated users
 * Uses httpClient for authorized requests
 */
export const userOrderService = {
  // Create an order
  async createOrder(orderData) {
    try {
      const response = await httpClient.post("/orders", orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Get orders by user ID
  async getOrdersByUserId(userId) {
    try {
      const response = await httpClient.get(`/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
      throw error;
    }
  },

  // Get order by ID (find from user orders list)
  async getOrderById(orderId, userId) {
    try {
      const orders = await this.getOrdersByUserId(userId);
      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }
      return order;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // Helper function to format order data for API
  formatOrderData(userId, cartItems, additionalData = {}) {
    return {
      userId,
      orderDate: formatDateTimeForAPI(),
      status: "PENDING",
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      ...additionalData,
    };
  },

  // Create order from cart items
  async createOrderFromCart(userId, cartItems, additionalData = {}) {
    try {
      const orderData = this.formatOrderData(userId, cartItems, additionalData);
      return await this.createOrder(orderData);
    } catch (error) {
      console.error("Error creating order from cart:", error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const response = await httpClient.patch(
        `/orders/${orderId}/status`,
        null,
        {
          params: { status },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating order ${orderId} status to ${status}:`,
        error
      );
      throw error;
    }
  },

  // Cancel order
  async cancelOrder(orderId) {
    try {
      return await this.updateOrderStatus(orderId, "CANCELLED");
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  },

  // Confirm order delivery
  async confirmDelivery(orderId) {
    try {
      return await this.updateOrderStatus(orderId, "DELIVERED");
    } catch (error) {
      console.error(`Error confirming delivery for order ${orderId}:`, error);
      throw error;
    }
  },

  // Helper function to format order total amount
  formatOrderTotal(order) {
    // Try different possible field names for order total
    const total =
      order.total_amount ||
      order.totalAmount ||
      order.total ||
      order.amount ||
      0;

    // Ensure it's a number
    const numericTotal =
      typeof total === "number" ? total : parseFloat(total) || 0;

    return numericTotal.toLocaleString("vi-VN");
  },
};
