// stores/useCartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      totalAmount: 0,

      // Tính tổng tiền
      calculateTotal: () => {
        const total = get().cartItems.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        );
        set({ totalAmount: total });
      },

      // Thêm sản phẩm vào giỏ
      addToCart: (product, qty = 1) => {
        const existingItem = get().cartItems.find((item) => item.id === product.id);
        let updatedCart;

        if (existingItem) {
          updatedCart = get().cartItems.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + qty } : item
          );
          toast.success("Cập nhật số lượng sản phẩm");
        } else {
          updatedCart = [...get().cartItems, { ...product, qty }];
          toast.success("Đã thêm vào giỏ hàng");
        }

        set({ cartItems: updatedCart });
        get().calculateTotal();
      },

      // Cập nhật số lượng
      updateQty: (productId, qty) => {
        const updatedCart = get().cartItems.map((item) =>
          item.id === productId ? { ...item, qty } : item
        );
        set({ cartItems: updatedCart });
        toast("Đã cập nhật số lượng");
        get().calculateTotal();
      },

      // Xóa sản phẩm khỏi giỏ
      removeFromCart: (productId) => {
        const updatedCart = get().cartItems.filter((item) => item.id !== productId);
        set({ cartItems: updatedCart });
        toast("Đã xóa sản phẩm khỏi giỏ hàng");
        get().calculateTotal();
      },

      // Reset giỏ hàng
      clearCart: () => {
        set({ cartItems: [], totalAmount: 0 });
        toast("Đã xóa toàn bộ giỏ hàng");
      },
    }),
    {
      name: "cart-storage", // tên key trong localStorage
      partialize: (state) => ({ cartItems: state.cartItems, totalAmount: state.totalAmount }),
    }
  )
);
``
