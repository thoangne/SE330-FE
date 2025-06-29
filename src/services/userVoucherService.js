import httpClient from "./httpClient";

/**
 * Service for user voucher operations
 * Handles voucher validation and application
 * Uses httpClient for authorized requests
 */
export const userVoucherService = {
  // Get all vouchers
  async getAllVouchers() {
    try {
      const response = await httpClient.get("/vouchers");
      return response.data;
    } catch (error) {
      console.error("Error fetching all vouchers:", error);
      throw error;
    }
  },

  // Get valid vouchers for user
  async getValidVouchers(userPoint, totalAmount) {
    try {
      const response = await httpClient.get("/vouchers/valid", {
        params: {
          userPoint,
          totalAmount,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching valid vouchers:", error);
      throw error;
    }
  },

  // Get voucher by code
  async getVoucherByCode(code) {
    try {
      const response = await httpClient.get(`/vouchers/code/${code}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching voucher with code ${code}:`, error);
      throw error;
    }
  },

  // Get voucher by ID
  async getVoucherById(voucherId) {
    try {
      const response = await httpClient.get(`/vouchers/${voucherId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching voucher ${voucherId}:`, error);
      throw error;
    }
  },

  // Get available vouchers for user
  async getAvailableVouchers(userId) {
    try {
      const response = await httpClient.get(`/vouchers/available/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching available vouchers:", error);
      throw error;
    }
  },

  // Validate voucher for user (helper method)
  async validateVoucher(voucher, userId, totalAmount) {
    try {
      // Basic validation checks
      if (this.isVoucherExpired(voucher)) {
        return {
          valid: false,
          message: "Voucher đã hết hạn",
        };
      }

      if (voucher.remaining <= 0) {
        return {
          valid: false,
          message: "Voucher đã hết lượt sử dụng",
        };
      }

      if (totalAmount < voucher.minPurchase) {
        return {
          valid: false,
          message: `Đơn hàng tối thiểu ${voucher.minPurchase.toLocaleString()} đ`,
        };
      }

      return {
        valid: true,
        message: "Voucher hợp lệ",
        discount: this.calculateDiscount(voucher, totalAmount),
      };
    } catch (error) {
      console.error("Error validating voucher:", error);
      return {
        valid: false,
        message: "Không thể kiểm tra voucher",
      };
    }
  },

  // Calculate discount amount
  calculateDiscount(voucher, totalAmount) {
    if (voucher.discountType === "fixed") {
      return voucher.value;
    } else if (
      voucher.discountType === "percent" ||
      voucher.discountType === "percentage"
    ) {
      const discount = (totalAmount * voucher.value) / 100;
      // For percentage vouchers, maxUsage is the maximum discount amount
      return Math.min(discount, voucher.maxUsage || discount);
    }
    return 0;
  },

  // Format voucher discount display
  formatVoucherDiscount(voucher) {
    if (!voucher) return "";

    if (voucher.discountType === "fixed") {
      return `${voucher.value?.toLocaleString()} đ`;
    } else if (
      voucher.discountType === "percent" ||
      voucher.discountType === "percentage"
    ) {
      let text = `${voucher.value}%`;
      // For percentage vouchers, maxUsage is the maximum discount amount
      if (voucher.maxUsage && voucher.maxUsage > 0) {
        text += ` (tối đa ${voucher.maxUsage.toLocaleString()} đ)`;
      }
      return text;
    }
    return "";
  },

  // Check if voucher is expired
  isVoucherExpired(voucher) {
    const now = new Date();
    const expiryDate = new Date(voucher.expiryDate || voucher.expiry_date);
    return now > expiryDate;
  },

  // Check if voucher is available
  isVoucherAvailable(voucher) {
    return (voucher.remaining || 0) > 0 && !this.isVoucherExpired(voucher);
  },

  // Format voucher status
  getVoucherStatus(voucher) {
    if (this.isVoucherExpired(voucher)) {
      return { status: "expired", text: "Đã hết hạn", variant: "secondary" };
    }

    if ((voucher.remaining || 0) <= 0) {
      return {
        status: "used_up",
        text: "Đã hết lượt sử dụng",
        variant: "secondary",
      };
    }

    return { status: "available", text: "Có thể sử dụng", variant: "success" };
  },
};
