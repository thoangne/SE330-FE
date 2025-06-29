import { create } from 'zustand';
import httpClient from '../services/httpClient';

const usePromotionStore = create((set) => ({
    promotions: [],
    isLoading: false,
    error: null,

    fetchPromotions: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await httpClient.get('/promotions');
            set({ promotions: res.data, isLoading: false });
        } catch (err) {
            console.error(err);
            set({ error: err.message, isLoading: false });
        }
    },

    addPromotion: async (promotion) => {
        try {
            const res = await httpClient.post('/promotions', promotion);
            set((state) => ({
                promotions: [...state.promotions, res.data],
            }));
        } catch (err) {
            console.error(err);
        }
    },

    updatePromotion: async (rank, updatedData) => {
        try {
            const res = await httpClient.patch(`/promotions/${rank}`, updatedData);
            set((state) => ({
                promotions: state.promotions.map((p) =>
                    p.rank === rank ? res.data : p
                ),
            }));
        } catch (err) {
            console.error(err);
        }
    },

    deletePromotion: async (rank) => {
        try {
            await httpClient.delete(`/promotions/${rank}`);
            set((state) => ({
                promotions: state.promotions.filter((p) => p.rank !== rank),
            }));
        } catch (err) {
            console.error(err);
        }
    },
}));

export default usePromotionStore;