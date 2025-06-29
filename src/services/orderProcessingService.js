import { userOrderService } from "./userOrderService";
import { userPaymentService } from "./userPaymentService";
import { addPointsToUserWithTier } from "./authService";
import { formatDateTimeForAPI } from "../utils/dateUtils";

/**
 * Comprehensive order processing service
 * Handles the complete order lifecycle including payment and points
 */
export const orderProcessingService = {
  /**
   * Create a complete order with payment
   * @param {Object} orderData - Order information
   * @param {Object} paymentData - Payment information
   * @param {Object} userInfo - User information
   * @returns {Promise<Object>} Result with order and payment details
   */
  async createOrderWithPayment(orderData, paymentData, userInfo) {
    try {
      console.log("🛒 OrderProcessing: Creating order with payment", {
        orderData,
        paymentData,
        userInfo,
      });

      // Step 1: Create the order with PENDING status
      const orderResult = await userOrderService.createOrder({
        userId: userInfo.id,
        orderDate: formatDateTimeForAPI(),
        status: "PENDING",
        items: orderData.items,
      });

      console.log("🛒 OrderProcessing: Order created:", orderResult);

      if (!orderResult || !orderResult.id) {
        throw new Error("Failed to create order");
      }

      // Step 2: Create payment record
      const paymentStatus = paymentData.method === "COD" ? "PENDING" : "PAID";

      const paymentRecord = await userPaymentService.createPayment({
        orderid: orderResult.id,
        method: paymentData.method,
        status: paymentStatus,
        paidAt: formatDateTimeForAPI(),
        vouchercode: paymentData.voucherCode || null,
        address: paymentData.address,
        phone: paymentData.phone,
        name: paymentData.name,
      });

      console.log("🛒 OrderProcessing: Payment created:", paymentRecord);

      // Step 3: If payment is immediate (not COD), add points
      if (paymentStatus === "PAID") {
        await this.addPointsForOrder(userInfo.id, orderResult.totalAmount);
      }

      return {
        success: true,
        data: {
          order: orderResult,
          payment: paymentRecord,
        },
        message: "Đặt hàng thành công!",
      };
    } catch (error) {
      console.error(
        "🛒 OrderProcessing: Error creating order with payment:",
        error
      );
      return {
        success: false,
        data: null,
        message: error.message || "Có lỗi xảy ra khi đặt hàng",
      };
    }
  },

  /**
   * Add points to user account based on order value
   * @param {number} userId - User ID
   * @param {number} orderTotal - Order total amount
   * @returns {Promise<Object>} Points addition result
   */
  async addPointsForOrder(userId, orderTotal) {
    try {
      console.log(
        "🏆 OrderProcessing: Adding points for order with dynamic tier",
        { userId, orderTotal }
      );

      // Use the new function that automatically gets user's tier multiplier
      const pointsResult = await addPointsToUserWithTier(userId, orderTotal);

      if (pointsResult.success) {
        console.log(
          "🏆 OrderProcessing: Points added successfully:",
          pointsResult.data
        );
      }

      return pointsResult;
    } catch (error) {
      console.error("🏆 OrderProcessing: Error adding points:", error);
      return {
        success: false,
        message: "Không thể cộng điểm tích lũy",
      };
    }
  },

  /**
   * Confirm COD payment and add points
   * @param {number} paymentId - Payment ID
   * @param {number} userId - User ID
   * @param {number} orderTotal - Order total amount
   * @returns {Promise<Object>} Confirmation result
   */
  async confirmCODPayment(paymentId, userId, orderTotal) {
    try {
      console.log("💰 OrderProcessing: Confirming COD payment", {
        paymentId,
        userId,
        orderTotal,
      });

      // Update payment status to PAID
      const paymentResult = await userPaymentService.updatePayment(paymentId, {
        status: "PAID",
        paymentDate: formatDateTimeForAPI(),
      });

      console.log("💰 OrderProcessing: Payment updated:", paymentResult);

      // Add points for COD payment
      const pointsResult = await this.addPointsForOrder(userId, orderTotal);

      return {
        success: true,
        data: {
          payment: paymentResult,
          points: pointsResult.data,
        },
        message: "Xác nhận thanh toán thành công!",
      };
    } catch (error) {
      console.error("💰 OrderProcessing: Error confirming COD payment:", error);
      return {
        success: false,
        data: null,
        message: "Có lỗi xảy ra khi xác nhận thanh toán",
      };
    }
  },

  /**
   * Cancel order and clean up payment
   * @param {number} orderId - Order ID
   * @param {number} paymentId - Payment ID (optional)
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelOrderWithPayment(orderId, paymentId = null) {
    try {
      console.log("❌ OrderProcessing: Cancelling order", {
        orderId,
        paymentId,
      });

      // Cancel the order
      const orderResult = await userOrderService.cancelOrder(orderId);
      console.log("❌ OrderProcessing: Order cancelled:", orderResult);

      // Delete payment if exists
      let paymentResult = null;
      if (paymentId) {
        try {
          paymentResult = await userPaymentService.deletePayment(paymentId);
          console.log("❌ OrderProcessing: Payment deleted:", paymentResult);
        } catch (error) {
          console.warn("❌ OrderProcessing: Could not delete payment:", error);
        }
      }

      return {
        success: true,
        data: {
          order: orderResult,
          payment: paymentResult,
        },
        message: "Hủy đơn hàng thành công!",
      };
    } catch (error) {
      console.error("❌ OrderProcessing: Error cancelling order:", error);
      return {
        success: false,
        data: null,
        message: "Có lỗi xảy ra khi hủy đơn hàng",
      };
    }
  },

  /**
   * Confirm order delivery (user action)
   * @param {number} orderId - Order ID
   * @param {Object} paymentDetail - Payment details
   * @param {Object} userInfo - User information
   * @returns {Promise<Object>} Delivery confirmation result
   */
  async confirmDelivery(orderId, paymentDetail, userInfo) {
    try {
      console.log("📦 OrderProcessing: Confirming delivery", {
        orderId,
        paymentDetail,
        userInfo,
      });

      // Update order status to DELIVERED
      const orderResult = await userOrderService.confirmDelivery(orderId);
      console.log("📦 OrderProcessing: Order status updated:", orderResult);

      let paymentResult = null;
      let pointsResult = null;

      // If COD and not yet paid, confirm payment and add points
      if (
        paymentDetail &&
        paymentDetail.method === "COD" &&
        paymentDetail.status !== "PAID"
      ) {
        const codResult = await this.confirmCODPayment(
          paymentDetail.id,
          userInfo.id,
          paymentDetail.totalamount
        );

        if (codResult.success) {
          paymentResult = codResult.data.payment;
          pointsResult = codResult.data.points;
        }
      }

      return {
        success: true,
        data: {
          order: orderResult,
          payment: paymentResult,
          points: pointsResult,
        },
        message: "Xác nhận giao hàng thành công!",
      };
    } catch (error) {
      console.error("📦 OrderProcessing: Error confirming delivery:", error);
      return {
        success: false,
        data: null,
        message: "Có lỗi xảy ra khi xác nhận giao hàng",
      };
    }
  },
};
