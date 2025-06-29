import httpClient from "./httpClient";
import { formatDateTimeForAPI } from "../utils/dateUtils";

/**
 * Service for user payment operations
 * Handles payment creation and management
 * Uses httpClient for authorized requests
 */
export const userPaymentService = {
  // Create a payment
  async createPayment(paymentData) {
    try {
      const response = await httpClient.post("/payments", paymentData);
      return response.data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  },

  // Get payment by ID
  async getPaymentById(paymentId) {
    try {
      const response = await httpClient.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment ${paymentId}:`, error);
      throw error;
    }
  },

  // Get payment detail by order ID
  async getPaymentDetailByOrderId(orderId) {
    try {
      const response = await httpClient.get(`/payments/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching payment detail for order ${orderId}:`,
        error
      );
      throw error;
    }
  },

  // Get payments by order ID (deprecated - use getPaymentDetailByOrderId)
  async getPaymentsByOrderId(orderId) {
    try {
      const response = await httpClient.get(`/user/payments/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for order ${orderId}:`, error);
      throw error;
    }
  },

  // Update payment status
  async updatePayment(paymentId, updateData) {
    try {
      const response = await httpClient.patch(
        `/payments/${paymentId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating payment ${paymentId}:`, error);
      throw error;
    }
  },

  // Delete payment
  async deletePayment(paymentId) {
    try {
      const response = await httpClient.delete(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting payment ${paymentId}:`, error);
      throw error;
    }
  },

  // Helper function to format payment data for API
  formatPaymentData(orderId, method, customerInfo, voucherCode = null) {
    return {
      orderid: orderId,
      method,
      status: "Pending",
      paidAt: formatDateTimeForAPI(),
      vouchercode: voucherCode,
      address: customerInfo.address,
      phone: customerInfo.phone,
      name: customerInfo.name,
    };
  },

  // Create payment for order
  async createPaymentForOrder(
    orderId,
    method,
    customerInfo,
    voucherCode = null
  ) {
    try {
      const paymentData = this.formatPaymentData(
        orderId,
        method,
        customerInfo,
        voucherCode
      );
      return await this.createPayment(paymentData);
    } catch (error) {
      console.error("Error creating payment for order:", error);
      throw error;
    }
  },

  // Mark payment as paid
  async markAsPaid(paymentId) {
    try {
      const updateData = {
        status: "PAID",
        paymentDate: formatDateTimeForAPI(),
      };
      return await this.updatePayment(paymentId, updateData);
    } catch (error) {
      console.error(`Error marking payment ${paymentId} as paid:`, error);
      throw error;
    }
  },
};
