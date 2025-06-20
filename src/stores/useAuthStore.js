import toast from "react-hot-toast";
import axiosInstance from "../lib/axiosInstance";
import { create } from "zustand";
export const useAuthStore = create((set) => ({
  //   isAdmin: false,
  isLoading: false,
  error: null,
  User: null,

  //   checkAdminStatus: async () => {
  //     set({ isLoading: true, error: null });
  //     try {
  //       const response = await AxiosInstance.get("/admin/check");
  //       console.log(response, "response");
  //       set({ isAdmin: response.data.admin });
  //     } catch (error) {
  //       set({ isAdmin: false, error: error.response.data.message });
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   },
  Register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      toast.success("Đang gửi yêu cầu");
      const response = await axiosInstance.post("/users", data);
      toast.success("Đăng ký thành công");
      window.location.reload();
      console.log(response, "response");
    } catch (error) {
      set({ error: error });
      toast.error("Đăng ký thất bại");
    } finally {
      set({ isLoading: false });
    }
  },
  Login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      toast.success("Đang gửi yêu cầu");
      const response = await axiosInstance.post("/users/login", data);
      toast.success("Đăng nhập thành cong");
      window.location.href = "/";
      console.log(response, "response");
    } catch (error) {
      set({ error: error });
      console.log(error, "error");
      toast.error("Đăng nhập thất bại");
    } finally {
      set({ isLoading: false });
    }
  },
  //   reset: () => {
  //     set({ isAdmin: false, isLoading: false, error: null });
  //   },
}));
