import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";
import {
  login as loginAPI,
  logout as logoutAPI,
  getCurrentUser,
  checkAuthStatus,
} from "../services/authService";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isInitialized: false, // Track if auth has been initialized

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const authData = getCurrentUser();
        set({
          user: authData.user,
          isAuthenticated: authData.isAuthenticated,
          isInitialized: true,
        });
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await loginAPI(email, password);

          if (result.success) {
            set({
              user: result.data.user,
              isAuthenticated: true,
              error: null,
            });
            toast.success(result.message);
            return { success: true };
          } else {
            set({ error: result.message });
            toast.error(result.message);
            return { success: false, message: result.message };
          }
        } catch (error) {
          const errorMessage = error.message || "Đăng nhập thất bại";
          set({ error: errorMessage });
          toast.error(errorMessage);
          return { success: false, message: errorMessage };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await logoutAPI();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
          toast.success("Đăng xuất thành công");
        }
      },

      // Check if user is still authenticated (called on app init)
      checkAuth: () => {
        const isAuth = checkAuthStatus();
        if (isAuth) {
          const authData = getCurrentUser();
          set({
            user: authData.user,
            isAuthenticated: true,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => set({ error: null }),

      // Update user profile
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
        // Update localStorage as well
        const currentUser = get().user;
        if (currentUser) {
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
