import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";

// Simplified version for testing
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Mock login for testing
          await new Promise((resolve) => setTimeout(resolve, 1000));

          if (email === "test@example.com" && password === "password123") {
            const mockUser = {
              id: 1,
              email,
              name: "Test User",
            };
            localStorage.setItem("accessToken", "mock-token");
            set({ user: mockUser, isAuthenticated: true });
            toast.success("Đăng nhập thành công");
            return { success: true };
          }

          set({ error: "Email hoặc mật khẩu không đúng" });
          toast.error("Email hoặc mật khẩu không đúng");
          return { success: false, message: "Email hoặc mật khẩu không đúng" };
        } catch {
          set({ error: "Đăng nhập thất bại" });
          toast.error("Đăng nhập thất bại");
          return { success: false, message: "Đăng nhập thất bại" };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        set({ user: null, isAuthenticated: false, error: null });
        toast.success("Đăng xuất thành công");
      },
      clearError: () => set({ error: null }),

      // Initialize from localStorage
      initFromStorage: () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
