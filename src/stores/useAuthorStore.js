import axiosInstance from "./../lib/axiosInstance";
import { create } from "zustand";
import httpClient from "../services/httpClient";

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
      const response = await httpClient.post("/authors", author);
      set({ authors: [...get().authors, response.data], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateAuthor: async (id, author) => {
    set({ isLoading: true });
    try {
      const response = await httpClient.patch(`/authors/${id}`, author);
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
      await httpClient.delete(`/authors/${id}`);
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
