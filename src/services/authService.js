import httpClient, { ENDPOINTS } from "./httpClient";

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

export const getUserInfo = async () => {
  try {
    const response = await httpClient.get(ENDPOINTS.USER_INFO);

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin user thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || "Lấy thông tin user thất bại",
    };
  } catch (error) {
    console.error("Get user info error:", error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Có lỗi xảy ra khi lấy thông tin user",
    };
  }
};

export const updateUserInfo = async (userData) => {
  try {
    const response = await httpClient.put(ENDPOINTS.USERS_UPDATE, userData);

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

const authService = {
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserInfo,
  updateUserInfo,
};

export default authService;
