import httpClient from "../services/httpClient";
import { create } from "zustand";

const useOrderStore = create((set, get) => ({
  orders: [],
  error: null,
  isLoading: false,
  stat: (orders) => orders.length,
  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await httpClient.get("/orders");
      set({ orders: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  addOrder: async (order) => {
    set({ isLoading: true });
    try {
      const response = await httpClient.post("/orders", order);
      set({ orders: [...get().orders, response.data], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true });
    try {
      const response = await httpClient.patch(
        `/orders/${orderId}/status?status=${status}`
      );
      set({
        orders: get().orders.map((o) =>
          o.id === orderId ? { ...o, status: status } : o
        ),
        isLoading: false,
      });
      return { success: true, data: response.data };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
  deleteOrder: async (id) => {
    set({ isLoading: true });
    try {
      await httpClient.delete(`/orders/${id}`);
      set({
        orders: get().orders.filter((o) => o.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useOrderStore;
