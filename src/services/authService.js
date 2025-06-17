import httpClient, { ENDPOINTS } from "./httpClient";
import { MOCK_USER, MOCK_TOKEN } from "./mockData";
/* import { toast } from "react-hot-toast"; */

export const login = async (email, password) => {
  // Mock API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // Mock authentication
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      // Save mock token
      localStorage.setItem("accessToken", MOCK_TOKEN);

      return {
        success: true,
        data: {
          user: MOCK_USER,
          accessToken: MOCK_TOKEN,
        },
        message: "Đăng nhập thành công",
      };
    }

    return {
      success: false,
      data: null,
      message: "Email hoặc mật khẩu không đúng",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      data: null,
      message: "Có lỗi xảy ra khi đăng nhập",
    };
  }
};

export const logout = async () => {
  try {
    await httpClient.post(ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("accessToken");
    // Additional cleanup if needed
  }
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
