import axiosInstance from "../lib/axiosInstance";
import httpClient from "../services/httpClient";
import { create } from "zustand";

const useBookStore = create((set, get) => ({
  books: [],
  error: null,
  isLoading: true,
  stat: (books) => books.length,
  fetchBooks: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/products");
      set({ books: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  addBook: async (book) => {
    set({ isLoading: true });
    try {
      const response = await httpClient.post("/products", book);
      set({ books: [...get().books, response.data], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateBook: async (id, book) => {
    set({ isLoading: true });
    try {
      const response = await httpClient.patch(`/products/${id}`, book);
      set({
        books: get().books.map((b) =>
          b.id === id ? { ...b, ...response.data } : b
        ),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  deleteBook: async (id) => {
    set({ isLoading: true });
    try {
      await httpClient.delete(`/products/${id}`);
      set({ books: get().books.filter((b) => b.id !== id), isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useBookStore;
