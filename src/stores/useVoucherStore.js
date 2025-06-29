import { create } from "zustand";
import axiosInstance from "./../lib/axiosInstance";
import httpClient from "../services/httpClient";

const useVoucherStore = create((set, get) => ({
    vouchers: [],
    error: null,
    isLoading: false,

    fetchVouchers: async () => {
        set({ isLoading: true });
        try {
            const response = await httpClient.get("/vouchers");
            set({ vouchers: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    addVoucher: async (voucher) => {
        set({ isLoading: true });
        try {
            const response = await httpClient.post("/vouchers", voucher);
            set({
                vouchers: [...get().vouchers, response.data],
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateVoucher: async (id, voucher) => {
        set({ isLoading: true });
        try {
            const response = await httpClient.patch(`/vouchers/${id}`, voucher);
            set({
                vouchers: get().vouchers.map((v) =>
                    v.id === id ? { ...v, ...response.data } : v
                ),
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteVoucher: async (id) => {
        set({ isLoading: true });
        try {
            await httpClient.delete(`/vouchers/${id}`);
            set({
                vouchers: get().vouchers.filter((v) => v.id !== id),
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
}));

export default useVoucherStore;