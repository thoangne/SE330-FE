import axiosInstance from "./../lib/axiosInstance";
import { create } from "zustand";

const useOrderStore = create((set, get) => ({
  orders: [],
  error: null,
  isLoading: false,
  stat: (orders) => orders.length,
  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/orders");
      set({ orders: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  addOrder: async (order) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/orders", order);
      set({ orders: [...get().orders, response.data], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateOrder: async (id, order) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/orders/${id}`, order);
      set({
        orders: get().orders.map((o) =>
          o.id === id ? { ...o, ...response.data } : o
        ),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  deleteOrder: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/orders/${id}`);
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
