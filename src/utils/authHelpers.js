// Helper functions for authentication

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const getUserRole = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.role;
    } catch {
      return null;
    }
  }
  return null;
};

export const isAdmin = () => {
  const role = getUserRole();
  return role === "ADMIN";
};

export const isUser = () => {
  const role = getUserRole();
  return role === "USER";
};

export const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};
