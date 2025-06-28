// stores/useCartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      totalAmount: 0,
      cartId: null,
      isLoading: false,

      // Tính tổng tiền
      calculateTotal: () => {
        const total = get().cartItems.reduce((sum, item) => {
          const price = item.discount_price || item.price || 0;
          return sum + price * item.qty;
        }, 0);
        set({ totalAmount: total });
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Set cart ID
      setCartId: (cartId) => {
        set({ cartId });
      },

      // Thêm sản phẩm vào giỏ (local only)
      addToCartLocal: (product, qty = 1) => {
        console.log("🛒 addToCartLocal: Adding product:", product);
        console.log("🛒 addToCartLocal: Current cart items:", get().cartItems);

        const existingItem = get().cartItems.find(
          (item) => item.id === product.id
        );
        console.log("🛒 addToCartLocal: Found existing item:", existingItem);

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

        console.log("🛒 addToCartLocal: Updated cart:", updatedCart);
        set({ cartItems: updatedCart });
        get().calculateTotal();
      },

      // Thêm sản phẩm vào giỏ (for API integration)
      addToCart: async (product, qty = 1, userCartService, userId) => {
        console.log("🛒 Adding to cart:", {
          product: product.title,
          qty,
          userId,
          hasService: !!userCartService,
        });

        // For guest users, use local storage
        if (!userId || !userCartService) {
          console.log("🛒 Using local storage (guest user)");
          return get().addToCartLocal(product, qty);
        }

        try {
          set({ isLoading: true });

          // Ensure cart exists
          let cartId = get().cartId;
          if (!cartId) {
            console.log("🛒 Creating new cart for user:", userId);
            const cartResponse = await userCartService.createCart(userId);
            cartId = cartResponse.id;
            set({ cartId });
            console.log("🛒 Created cart with ID:", cartId);
          }

          // Add to server cart
          console.log("🛒 Adding to server cart:", {
            userId,
            productId: product.id,
            qty,
          });
          await userCartService.addToCart(userId, product.id, qty);

          // Update local state
          get().addToCartLocal(product, qty);

          // Show success message
          toast.success(`Đã thêm ${product.title} vào giỏ hàng`);
          console.log("🛒 Successfully added to cart");
        } catch (error) {
          console.error("🛒 Error adding to cart:", error);
          toast.error("Không thể thêm vào giỏ hàng");
          // Fallback to local storage
          get().addToCartLocal(product, qty);
        } finally {
          set({ isLoading: false });
        }
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
        const updatedCart = get().cartItems.filter(
          (item) => item.id !== productId
        );
        set({ cartItems: updatedCart });
        toast("Đã xóa sản phẩm khỏi giỏ hàng");
        get().calculateTotal();
      },

      // Reset giỏ hàng
      clearCart: () => {
        set({ cartItems: [], totalAmount: 0, cartId: null });
        toast("Đã xóa toàn bộ giỏ hàng");
      },

      // Khởi tạo cart cho user
      initializeCart: async (userCartService, userId) => {
        if (!userId || !userCartService) {
          // Guest user - use local storage only
          console.log(
            "🛒 initializeCart: No userId or userCartService - using local storage"
          );
          return;
        }

        try {
          set({ isLoading: true });
          console.log("🛒 initializeCart: Starting for user:", userId);

          // Try to get existing cart
          let cartResponse;
          try {
            cartResponse = await userCartService.getCartByUserId(userId);
            console.log(
              "🛒 initializeCart: Found existing cart:",
              cartResponse
            );
          } catch (error) {
            console.log("🛒 initializeCart: Error getting cart:", error);
            // If cart doesn't exist, create new one
            if (error.response?.status === 404) {
              console.log("🛒 initializeCart: Creating new cart");
              const newCartResponse = await userCartService.createCart(userId);
              console.log(
                "🛒 initializeCart: Created new cart:",
                newCartResponse
              );
              set({ cartId: newCartResponse.id, cartItems: [] });
              return;
            }
            throw error;
          }

          // Cart exists, sync with local storage
          const serverCart = cartResponse;
          set({ cartId: serverCart.id });

          // Handle different possible response structures
          const cartItems = serverCart.cartItems || serverCart.items || [];
          if (cartItems.length > 0) {
            // Convert server format to store format
            const storeItems = cartItems.map((item) => ({
              id: item.productId || item.product_id,
              product_id: item.productId || item.product_id,
              qty: item.quantity,
              // Other product details will be enriched by components
            }));
            get().syncFromData(storeItems);
          }
        } catch (error) {
          console.error("Error initializing cart:", error);
          toast.error("Không thể tải giỏ hàng");
        } finally {
          set({ isLoading: false });
        }
      },

      // Đồng bộ giỏ hàng từ server
      syncFromServer: async (userCartService, userId) => {
        if (!userId || !userCartService) return;

        try {
          set({ isLoading: true });

          // Get cart from server
          const cartResponse = await userCartService.getCartByUserId(userId);
          const serverCart = cartResponse;

          if (serverCart && (serverCart.cartItems || serverCart.items)) {
            // Store cart ID
            set({ cartId: serverCart.id });

            // Map server items to local format - handle both cartItems and items
            const serverItems = serverCart.cartItems || serverCart.items || [];
            const mappedItems = serverItems.map((item) => ({
              id: item.productId || item.product_id,
              product_id: item.productId || item.product_id,
              qty: item.quantity,
              // Will be enriched with product details by components
            }));

            set({ cartItems: mappedItems });
            get().calculateTotal();
          }
        } catch (error) {
          console.error("Error syncing cart from server:", error);
          // If cart doesn't exist, create one
          if (error.response?.status === 404) {
            try {
              const newCartResponse = await userCartService.createCart(userId);
              set({ cartId: newCartResponse.id, cartItems: [] });
            } catch (createError) {
              console.error("Error creating cart:", createError);
            }
          }
        } finally {
          set({ isLoading: false });
        }
      },

      // Đồng bộ từ data có sẵn
      syncFromData: (serverCartItems) => {
        const mappedItems = serverCartItems.map((item) => ({
          id: item.product_id,
          product_id: item.product_id,
          qty: item.quantity,
          // Các thuộc tính khác sẽ được enrich từ API
        }));
        set({ cartItems: mappedItems });
        get().calculateTotal();
      },

      // Cập nhật cart items đã được enrich từ API
      setEnrichedCartItems: (enrichedItems) => {
        set({ cartItems: enrichedItems });
        get().calculateTotal();
      },
    }),
    {
      name: "cart-storage", // tên key trong localStorage
      partialize: (state) => ({
        cartItems: state.cartItems,
        totalAmount: state.totalAmount,
        cartId: state.cartId,
      }),
    }
  )
);
``;
