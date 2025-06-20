import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axiosInstance";
export const useUserStore = create((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  getUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteUser: async (user) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/users/${user.id}`);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  updateUser: async (user) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put(`/users/${user.id}`, user);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useUserStore;
