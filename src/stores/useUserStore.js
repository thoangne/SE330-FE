import axiosInstance from "./../lib/axiosInstance";
import httpClient from "../services/httpClient";
import { create } from "zustand";

const useUserStore = create((set, get) => ({
  users: [],
  error: null,
  isLoading: false,
  stat: (users) => users.length,
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await httpClient.get("/users");
      set({ users: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  addUser: async (user) => {
    set({ isLoading: true });
    try {
      const response = await httpClient.post("/users", user);
      set({ users: [...get().users, response.data], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateUser: async (id, user) => {
    set({ isLoading: true });
    try {
      const response = await httpClient.put(`/users/${id}`, user);
      set({
        users: get().users.map((u) =>
          u.id === id ? { ...u, ...response.data } : u
        ),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  deleteUser: async (id) => {
    set({ isLoading: true });
    try {
      await httpClient.delete(`/users/${id}`);
      set({
        users: get().users.filter((u) => u.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useUserStore;
