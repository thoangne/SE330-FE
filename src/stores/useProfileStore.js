import { create } from "zustand";
import {
  mockUserProfile,
  mockOrders,
  mockNotifications,
  mockWishlist,
} from "../services/mockData";

const useProfileStore = create((set) => ({
  userProfile: null,
  orders: [],
  notifications: [],
  wishlist: [],
  isLoading: false,
  error: null,

  fetchUserProfile: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve(mockUserProfile), 500)
      );
      set({ userProfile: response, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve(mockOrders), 500)
      );
      set({ orders: response, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve(mockNotifications), 500)
      );
      set({ notifications: response, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve(mockWishlist), 500)
      );
      set({ wishlist: response, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateProfile: async (updatedData) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      set((state) => ({
        userProfile: { ...state.userProfile, ...updatedData },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useProfileStore;
