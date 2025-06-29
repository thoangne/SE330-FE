import httpClient, { ENDPOINTS } from "./httpClient";
import axiosInstance from "../lib/axiosInstance";

export const login = async (email, password) => {
  try {
    const response = await httpClient.post(ENDPOINTS.LOGIN, {
      email,
      password,
    });

    const { data } = response;

    if (data.success && data.accessToken) {
      // Save access token to localStorage
      localStorage.setItem("accessToken", data.accessToken);

      // Save user data
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        data: {
          user: data.user,
          accessToken: data.accessToken,
        },
        message: data.message || "Đăng nhập thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: data.message || "Đăng nhập thất bại",
    };
  } catch (error) {
    console.error("Login error:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Có lỗi xảy ra khi đăng nhập";

    return {
      success: false,
      data: null,
      message: errorMessage,
    };
  }
};

export const register = async (email) => {
  try {
    const response = await httpClient.post(ENDPOINTS.REGISTER, {
      email,
    });

    const { data } = response;

    // Check for successful response (201 Created)
    if (response.status === 201 || data.success) {
      return {
        success: true,
        data: data,
        message:
          data.message ||
          "Đăng ký thành công! Vui lòng kiểm tra email để nhận thông tin đăng nhập.",
      };
    }

    return {
      success: false,
      data: null,
      message: data.message || "Đăng ký thất bại",
    };
  } catch (error) {
    console.error("Register error:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Có lỗi xảy ra khi đăng ký";

    return {
      success: false,
      data: null,
      message: errorMessage,
    };
  }
};

export const logout = async () => {
  try {
    // Call logout endpoint to invalidate refresh token on server
    await httpClient.post(ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error("Logout error:", error);
    // Even if logout API fails, we still clear local data
  } finally {
    // Clear all local authentication data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
};

export const refreshToken = async () => {
  try {
    const response = await httpClient.post(ENDPOINTS.REFRESH_TOKEN);
    const { data } = response;

    if (data.success && data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      return {
        success: true,
        accessToken: data.accessToken,
      };
    }

    throw new Error("Invalid refresh response");
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    if (userStr && accessToken) {
      return {
        user: JSON.parse(userStr),
        accessToken,
        isAuthenticated: true,
      };
    }

    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
    };
  }
};

export const checkAuthStatus = () => {
  const accessToken = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");

  return !!(accessToken && user);
};

export const forgotPassword = async (email) => {
  try {
    const response = await httpClient.post(ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });

    if (response.data && response.status === 200) {
      return {
        success: true,
        message: response.data?.message || "Email reset mật khẩu đã được gửi",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Gửi email thất bại",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Có lỗi xảy ra khi gửi email",
    };
  }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const response = await httpClient.post(ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword,
      confirmPassword,
    });

    if (response.data && response.status === 200) {
      return {
        success: true,
        message: response.data?.message || "Đặt lại mật khẩu thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Đặt lại mật khẩu thất bại",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi đặt lại mật khẩu",
    };
  }
};

export const updateUserInfo = async (userData, userId) => {
  try {
    // Use userId from parameter or get from stored user data
    const userIdToUse = userId || JSON.parse(localStorage.getItem("user"))?.id;

    if (!userIdToUse) {
      return {
        success: false,
        data: null,
        message: "Không tìm thấy thông tin user để cập nhật",
      };
    }

    console.log(
      "🔍 UpdateUserInfo: Calling PATCH /users/" + userIdToUse,
      userData
    );
    const response = await httpClient.patch(`/users/${userIdToUse}`, userData);

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: response.data?.message || "Cập nhật thông tin thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Cập nhật thông tin thất bại",
    };
  } catch (error) {
    console.error("Update user info error:", error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin",
    };
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await httpClient.get(`/users/${userId}`);

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin người dùng thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Không thể lấy thông tin người dùng",
    };
  } catch (error) {
    console.error("Get user by ID error:", error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy thông tin người dùng",
    };
  }
};

// Update user points
export const updateUserPoints = async (userId, newPoints) => {
  try {
    console.log("🏆 AuthService: Updating user points:", { userId, newPoints });

    const response = await axiosInstance.patch(`/users/${userId}`, {
      point: newPoints,
    });

    const { data } = response;

    if (data) {
      console.log("🏆 AuthService: Points updated successfully:", data);
      return {
        success: true,
        data: data,
        message: "Cập nhật điểm thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: "Cập nhật điểm thất bại",
    };
  } catch (error) {
    console.error("🏆 AuthService: Error updating user points:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Có lỗi xảy ra khi cập nhật điểm";

    return {
      success: false,
      data: null,
      message: errorMessage,
    };
  }
};

// Calculate points earned from order
export const calculatePointsEarned = (orderTotal, tierMultiplier) => {
  const basePoints = Math.floor(orderTotal); // 1 point per 1 VND
  const earnedPoints = Math.floor(basePoints * tierMultiplier);
  console.log("🏆 AuthService: Calculating points:", {
    orderTotal,
    tierMultiplier,
    basePoints,
    earnedPoints,
  });
  return earnedPoints;
};

// Add points to user account
export const addPointsToUser = async (userId, orderTotal, tierMultiplier) => {
  try {
    console.log("🏆 AuthService: Adding points to user:", {
      userId,
      orderTotal,
      tierMultiplier,
    });

    // Get current user points
    const userResult = await getUserById(userId);
    if (!userResult.success) {
      throw new Error("Failed to get user data");
    }

    const currentPoints = userResult.data.point || userResult.data.points || 0;
    const pointsToAdd = calculatePointsEarned(orderTotal, tierMultiplier);
    const newTotalPoints = currentPoints + pointsToAdd;

    console.log("🏆 AuthService: Points calculation:", {
      currentPoints,
      pointsToAdd,
      newTotalPoints,
    });

    // Update user points
    const updateResult = await updateUserPoints(userId, newTotalPoints);

    if (updateResult.success) {
      return {
        success: true,
        data: {
          pointsAdded: pointsToAdd,
          newTotal: newTotalPoints,
          previousTotal: currentPoints,
        },
        message: `Đã cộng ${pointsToAdd} điểm vào tài khoản`,
      };
    }

    return updateResult;
  } catch (error) {
    console.error("🏆 AuthService: Error adding points to user:", error);
    return {
      success: false,
      data: null,
      message: "Có lỗi xảy ra khi cộng điểm",
    };
  }
};

// Get user's current tier multiplier
export const getUserTierMultiplier = async (userId) => {
  try {
    console.log("🏆 AuthService: Getting tier multiplier for user:", userId);

    // Get user details to get their current points
    const userResult = await getUserById(userId);
    if (!userResult.success) {
      throw new Error("Failed to get user data");
    }

    const userPoints = userResult.data.point || userResult.data.points || 0;
    console.log("🏆 AuthService: User points:", userPoints);

    // Import userPromotionService dynamically to avoid circular imports
    const { userPromotionService } = await import("./userServices");
    const tierResult = await userPromotionService.getUserTierMultiplier(
      userPoints
    );

    if (tierResult.success) {
      console.log(
        "🏆 AuthService: Tier multiplier retrieved:",
        tierResult.data
      );
      return {
        success: true,
        data: tierResult.data,
        message: "Lấy thông tin hạng thành viên thành công",
      };
    }

    return tierResult;
  } catch (error) {
    console.error("🏆 AuthService: Error getting tier multiplier:", error);
    return {
      success: false,
      data: {
        tierMultiplier: 1, // Default fallback
        rank: "BRONZE",
        pointsRequired: 0,
        userPoints: 0,
      },
      message: "Không thể lấy thông tin hạng thành viên, sử dụng mặc định",
    };
  }
};

// Add points to user account with dynamic tier multiplier
export const addPointsToUserWithTier = async (userId, orderTotal) => {
  try {
    console.log(
      "🏆 AuthService: Adding points with tier calculation for user:",
      userId
    );

    // Get user's current tier multiplier
    const tierResult = await getUserTierMultiplier(userId);
    const tierMultiplier = tierResult.data?.tierMultiplier || 1;

    console.log("🏆 AuthService: Using tier multiplier:", tierMultiplier);

    // Add points using the tier multiplier
    return await addPointsToUser(userId, orderTotal, tierMultiplier);
  } catch (error) {
    console.error("🏆 AuthService: Error adding points with tier:", error);
    return {
      success: false,
      data: null,
      message: "Có lỗi xảy ra khi cộng điểm",
    };
  }
};

const authService = {
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateUserInfo,
  getUserById,
  register,
};

export default authService;
