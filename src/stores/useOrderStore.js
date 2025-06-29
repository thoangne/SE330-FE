import axiosInstance from "./../lib/axiosInstance";
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
  updateOrder: async (id, order) => {
    set({ isLoading: true });
    try {
      const response = await httpClient.put(`/orders/${id}`, order);
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
