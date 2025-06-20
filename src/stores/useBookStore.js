import toast from "react-hot-toast";
import axiosInstance from "../lib/axiosInstance";
import { create } from "zustand";

export const useBookStore = create((set, get) => ({
  books: [],
  isLoading: false,
  error: null,
  getBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/products");
      set({ books: res.data });
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  addBook: async (book) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/books", book);
      toast.success("Book added successfully");
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  updateBook: async (book) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put(`/books/${book.id}`, book);
      toast.success("Book updated successfully");
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteBook: async (book) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/books/${book.id}`);
      toast.success("Book deleted successfully");
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useBookStore;
