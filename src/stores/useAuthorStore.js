import axiosInstance from "./../lib/axiosInstance";
import { create } from "zustand";

const useAuthorStore = create((set, get) => ({
  authors: [],
  error: null,
  isLoading: false,
  stat: (authors) => authors.length,
  fetchAuthors: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/authors");
      set({ authors: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  addAuthor: async (author) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/authors", author);
      set({ authors: [...get().authors, response.data], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateAuthor: async (id, author) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/authors/${id}`, author);
      set({
        authors: get().authors.map((a) =>
          a.id === id ? { ...a, ...response.data } : a
        ),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  deleteAuthor: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/authors/${id}`);
      set({
        authors: get().authors.filter((a) => a.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useAuthorStore;
