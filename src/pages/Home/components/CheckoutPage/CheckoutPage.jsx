// pages/CheckoutPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartStore } from "../../../../stores/useCartStore";
import { useAuthStore } from "../../../../stores/useAuthStore";
import {
  userCartService,
  userVoucherService,
  userPromotionService,
  userProductService,
} from "../../../../services/userServices";
import { orderProcessingService } from "../../../../services/orderProcessingService";
import { getUserById } from "../../../../services/authService";
import "./CheckoutPage.css";

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const { clearCart, cartItems, initializeCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [enrichedCartItems, setEnrichedCartItems] = useState([]);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [promotionInfo, setPromotionInfo] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Get checkout data from navigation state (from CartPage)
  const checkoutData = location.state;
  const selectedItemsFromCart = useMemo(
    () => checkoutData?.selectedItems || [],
    [checkoutData?.selectedItems]
  );
  const totalFromCart = useMemo(
    () => checkoutData?.totalAmount || 0,
    [checkoutData?.totalAmount]
  );

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "COD",
    notes: "",
  });

  // Update form data when user info is available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.full_name || user.name || "",
        address: user.address || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // Initialize cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      initializeCart(userCartService, user.id);
    }
  }, [isAuthenticated, user?.id, initializeCart]);

  // Load vouchers and promotion info - defined before useEffect to avoid hoisting issues
  const loadVouchersAndPromotions = useCallback(
    async (currentTotal) => {
      try {
        // Load promotion info to get user points
        let userPoints = 0;
        try {
          const promotionResponse = await userPromotionService.getUserRankInfo(
            user.id
          );
          userPoints = promotionResponse.data?.points || 0;
          setPromotionInfo(promotionResponse.data);
        } catch (promotionError) {
          console.error("Error loading promotion info:", promotionError);
        }

        // Get valid vouchers based on user points and total amount
        const vouchersResponse = await userVoucherService.getValidVouchers(
          userPoints,
          currentTotal
        );
        setAvailableVouchers(vouchersResponse.data || vouchersResponse || []);
      } catch (voucherError) {
        console.error("Error loading vouchers:", voucherError);
        // Fallback to all vouchers if getValidVouchers fails
        try {
          const allVouchersResponse = await userVoucherService.getAllVouchers();
          setAvailableVouchers(
            allVouchersResponse.data || allVouchersResponse || []
          );
        } catch (fallbackError) {
          console.error("Error loading all vouchers:", fallbackError);
          setAvailableVouchers([]);
        }
      }
    },
    [user?.id]
  );

  // Debug useEffect to monitor cart state changes
  useEffect(() => {
    console.log("🛒 CheckoutPage: Cart state changed");
    console.log("🛒 CheckoutPage: cartItems:", cartItems);
    console.log("🛒 CheckoutPage: enrichedCartItems:", enrichedCartItems);
  }, [cartItems, enrichedCartItems]);

  // Load initial data
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      navigate("/login");
      return;
    }

    // If we have selected items from cart, use them directly
    if (selectedItemsFromCart.length > 0) {
      console.log(
        "🛒 CheckoutPage: Using selected items from cart:",
        selectedItemsFromCart
      );

      // Convert selected items to enriched format
      const enriched = selectedItemsFromCart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        product: {
          ...item.product,
          discount_price:
            item.product.discount > 0
              ? item.product.price * (1 - item.product.discount / 100)
              : item.product.price,
        },
        total:
          item.quantity *
          (item.product.discount > 0
            ? item.product.price * (1 - item.product.discount / 100)
            : item.product.price),
      }));

      setEnrichedCartItems(enriched);

      // Load vouchers and promotion info
      loadVouchersAndPromotions(totalFromCart);
      return;
    }

    // Fallback to loading from cart store if no selected items
    const loadData = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        console.log(
          "🛒 CheckoutPage: Loading from cart store, cartItems:",
          cartItems
        );

        let enriched = [];

        // Enrich cart items with product details
        if (cartItems.length > 0) {
          enriched = await Promise.all(
            cartItems.map(async (item) => {
              try {
                const productId = item.id || item.productId || item.product_id;

                if (!productId) {
                  console.error(
                    "🛒 CheckoutPage: No productId found for item:",
                    item
                  );
                  return null;
                }

                const productResponse = await userProductService.getProductById(
                  productId
                );
                const product = productResponse.data || productResponse;

                if (!product || !product.id) {
                  console.error(
                    "🛒 CheckoutPage: Invalid product response for:",
                    productId
                  );
                  return null;
                }

                const quantity = item.qty || item.quantity || 1;
                const discountPrice =
                  product.discount > 0
                    ? product.price * (1 - product.discount / 100)
                    : product.price;

                return {
                  product_id: productId,
                  quantity: quantity,
                  product: {
                    ...product,
                    discount_price: discountPrice,
                  },
                  total: quantity * discountPrice,
                };
              } catch (error) {
                console.error(
                  `🛒 CheckoutPage: Error loading product ${
                    item.productId || item.product_id || item.id
                  }:`,
                  error
                );
                return null;
              }
            })
          );

          const validEnriched = enriched.filter(
            (item) => item !== null && item.product
          );
          setEnrichedCartItems(validEnriched);

          // Calculate total from enriched items
          const total = validEnriched.reduce(
            (sum, item) => sum + item.total,
            0
          );
          loadVouchersAndPromotions(total);
        }
      } catch (error) {
        console.error("Error loading checkout data:", error);
        toast.error("Có lỗi khi tải dữ liệu thanh toán");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    isAuthenticated,
    user?.id,
    navigate,
    selectedItemsFromCart,
    totalFromCart,
    cartItems,
    loadVouchersAndPromotions,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(
      "🛒 CheckoutPage: handleSubmit - cartItems.length:",
      cartItems.length
    );
    console.log(
      "🛒 CheckoutPage: handleSubmit - enrichedCartItems.length:",
      enrichedCartItems.length
    );

    if (cartItems.length === 0 || enrichedCartItems.length === 0) {
      console.log(
        "🛒 CheckoutPage: handleSubmit - Cart is empty, showing toast"
      );
      toast.error("Giỏ hàng trống");
      return;
    }

    if (!formData.name || !formData.address || !formData.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setShowPaymentModal(true);
  };

  const handleConfirmOrder = async () => {
    setProcessingPayment(true);

    try {
      console.log("🛒 CheckoutPage: Starting order processing");

      // Prepare order data
      const orderItems = enrichedCartItems.map((item) => ({
        productId: item.product_id || item.id,
        quantity: item.quantity || item.qty || 1,
      }));

      const orderData = {
        items: orderItems,
      };

      // Prepare payment data
      const paymentData = {
        method: formData.payment === "COD" ? "COD" : "VNPAY",
        voucherCode: selectedVoucher?.code || null,
        address: formData.address,
        phone: formData.phone,
        name: formData.name,
      };

      const userInfo = {
        id: user.id,
        name: user.name || user.fullName || user.full_name,
        email: user.email,
      };

      console.log("🛒 CheckoutPage: Processing order with:", {
        orderData,
        paymentData,
        userInfo,
      });

      // Use the new order processing service
      const result = await orderProcessingService.createOrderWithPayment(
        orderData,
        paymentData,
        userInfo
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      console.log("🛒 CheckoutPage: Order processed successfully:", result);

      // Refresh user data to get updated points (for non-COD payments)
      if (formData.payment !== "COD") {
        try {
          const freshUserResult = await getUserById(user.id);
          if (freshUserResult.success && freshUserResult.data) {
            updateUser(freshUserResult.data);
            console.log(
              "🔄 CheckoutPage: User data refreshed with updated points"
            );
          }
        } catch (error) {
          console.warn("🔄 CheckoutPage: Failed to refresh user data:", error);
        }
      }

      if (formData.payment === "COD") {
        // COD payment - order created with PENDING payment
        toast.success(
          "Đơn hàng đã được đặt thành công! Bạn sẽ thanh toán khi nhận hàng."
        );

        // Clear cart and redirect
        clearCart();
        navigate("/profile", { state: { activeTab: "orders" } });
      } else if (formData.payment === "VNPAY") {
        // For VNPAY, if there's a payment URL, redirect to it
        // Otherwise, order is created with PAID status and points already added
        toast.success("Đơn hàng đã được đặt và thanh toán thành công!");

        // Clear cart and redirect
        clearCart();
        navigate("/profile", { state: { activeTab: "orders" } });
      }
    } catch (error) {
      console.error("🛒 CheckoutPage: Error processing order:", error);
      toast.error(
        error.message ||
          error.response?.data?.message ||
          "Có lỗi khi đặt hàng. Vui lòng thử lại!"
      );
    } finally {
      setProcessingPayment(false);
      setShowPaymentModal(false);
    }
  };

  const handleApplyVoucher = async (voucher) => {
    try {
      const validationResponse = await userVoucherService.validateVoucher(
        voucher.id,
        user.id,
        calculateSubtotal()
      );

      console.log("🎟️ Voucher validation response:", validationResponse);

      // Handle different response structures
      const responseData = validationResponse.data || validationResponse;
      const isValid = responseData?.valid || responseData?.isValid || false;
      const message = responseData?.message || responseData?.error || "";

      if (isValid) {
        setSelectedVoucher(voucher);
        toast.success(`Đã áp dụng voucher ${voucher.code}`);
      } else {
        toast.error(message || "Voucher không hợp lệ hoặc không đủ điều kiện");
      }
    } catch (error) {
      console.error("Error applying voucher:", error);

      // If validateVoucher API is not implemented or fails, just apply the voucher
      // This is a temporary fallback while the API is being developed
      if (error.response?.status === 404 || error.response?.status === 501) {
        console.warn(
          "🎟️ Voucher validation API not implemented, applying voucher directly"
        );
        setSelectedVoucher(voucher);
        toast.success(`Đã áp dụng voucher ${voucher.code} (chưa xác thực)`);
      } else {
        toast.error("Không thể áp dụng voucher. Vui lòng thử lại!");
      }
    }
  };

  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    toast.success("Đã bỏ voucher");
  };

  const calculateSubtotal = () => {
    return enrichedCartItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculatePromotionDiscount = () => {
    if (!promotionInfo?.tier_multiplier) return 0;
    const subtotal = calculateSubtotal();
    return subtotal * (promotionInfo.tier_multiplier - 1); // Assuming multiplier gives bonus discount
  };

  const calculateVoucherDiscount = () => {
    if (!selectedVoucher) return 0;

    const subtotal = calculateSubtotal();

    // Handle percentage discount type
    if (
      selectedVoucher.discountType === "percent" ||
      selectedVoucher.discountType === "percentage"
    ) {
      const percentageDiscount = (subtotal * selectedVoucher.value) / 100;
      // For percentage vouchers, maxUsage is the maximum discount amount
      return Math.min(percentageDiscount, selectedVoucher.maxUsage || Infinity);
    }
    // Handle fixed discount type (giảm thẳng số tiền)
    else if (selectedVoucher.discountType === "fixed") {
      // Fixed amount discount cannot exceed the subtotal
      return Math.min(selectedVoucher.value, subtotal);
    }

    return 0;
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateSubtotal();
    const promotionDiscount = calculatePromotionDiscount();
    const voucherDiscount = calculateVoucherDiscount();
    return Math.max(0, subtotal - promotionDiscount - voucherDiscount);
  };

  if (!isAuthenticated) {
    return (
      <div className="checkout-container">
        <div className="checkout-wrapper">
          <div className="empty-cart fade-in">
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🔒</div>
            <h3>Vui lòng đăng nhập</h3>
            <p>Bạn cần đăng nhập để có thể thanh toán</p>
            <button
              className="back-to-shop-btn"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="checkout-container">
        <div className="loading-spinner">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <span className="ms-3">Đang tải thông tin thanh toán...</span>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (enrichedCartItems.length === 0 && selectedItemsFromCart.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-wrapper">
          <div className="empty-cart fade-in">
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🛒</div>
            <h3>Giỏ hàng trống</h3>
            <p>Bạn chưa có sản phẩm nào trong giỏ hàng để thanh toán</p>
            <button className="back-to-shop-btn" onClick={() => navigate("/")}>
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        {/* Header */}
        <div className="checkout-header fade-in">
          <h1>🛍️ Thanh toán</h1>
          <p>Hoàn tất đơn hàng của bạn</p>
        </div>

        <div className="checkout-content">
          {/* Checkout Form */}
          <div className="checkout-form-section slide-up">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div style={{ marginBottom: "30px" }}>
                <h3>
                  <span>📋</span> Thông tin giao hàng
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                    marginBottom: "15px",
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Họ và tên *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số điện thoại *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Địa chỉ giao hàng *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Nhập địa chỉ giao hàng chi tiết"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi chú đơn hàng</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Ghi chú về đơn hàng (không bắt buộc)"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: "30px" }}>
                <h3>
                  <span>💳</span> Phương thức thanh toán
                </h3>

                <div className="payment-options">
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="COD"
                      checked={formData.payment === "COD"}
                      onChange={(e) =>
                        setFormData({ ...formData, payment: e.target.value })
                      }
                    />
                    <label htmlFor="cod">
                      <span>🚚</span>
                      <div>
                        <strong>Thanh toán khi nhận hàng</strong>
                        <br />
                        <small>Trả tiền mặt khi nhận được sản phẩm</small>
                      </div>
                    </label>
                  </div>

                  <div className="payment-option">
                    <input
                      type="radio"
                      id="vnpay"
                      name="payment"
                      value="VNPAY"
                      checked={formData.payment === "VNPAY"}
                      onChange={(e) =>
                        setFormData({ ...formData, payment: e.target.value })
                      }
                    />
                    <label htmlFor="vnpay">
                      <span>💰</span>
                      <div>
                        <strong>VNPay</strong>
                        <br />
                        <small>Thanh toán trực tuyến an toàn</small>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Voucher Section */}
              {availableVouchers.length > 0 && (
                <div className="voucher-section">
                  <h4>🎟️ Voucher khuyến mãi</h4>

                  {selectedVoucher ? (
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        padding: "15px",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong>{selectedVoucher.code}</strong>
                        <br />
                        <small>{selectedVoucher.description}</small>
                        <br />
                        <small>
                          Giảm:
                          {userVoucherService?.formatVoucherDiscount
                            ? userVoucherService.formatVoucherDiscount(
                                selectedVoucher
                              )
                            : selectedVoucher.discountType === "percentage"
                            ? `${selectedVoucher.value}%${
                                selectedVoucher.maxDiscount
                                  ? ` (tối đa ${selectedVoucher.maxDiscount.toLocaleString()}đ)`
                                  : ""
                              }`
                            : `${selectedVoucher.value.toLocaleString()}đ`}
                        </small>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        style={{
                          background: "rgba(255, 255, 255, 0.3)",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          color: "white",
                          fontSize: "0.9rem",
                        }}
                      >
                        Bỏ voucher
                      </button>
                    </div>
                  ) : (
                    <select
                      className="voucher-select"
                      onChange={(e) => {
                        const voucherId = e.target.value;
                        if (voucherId) {
                          const voucher = availableVouchers.find(
                            (v) => v.id.toString() === voucherId
                          );
                          if (voucher) handleApplyVoucher(voucher);
                        }
                      }}
                      value=""
                    >
                      <option value="">Chọn voucher khuyến mãi</option>
                      {availableVouchers.map((voucher) => (
                        <option key={voucher.id} value={voucher.id}>
                          {voucher.code} -
                          {userVoucherService?.formatVoucherDiscount
                            ? userVoucherService.formatVoucherDiscount(voucher)
                            : voucher.discountType === "percentage"
                            ? `Giảm ${voucher.value}%${
                                voucher.maxDiscount
                                  ? ` (tối đa ${voucher.maxDiscount.toLocaleString()}đ)`
                                  : ""
                              }`
                            : `Giảm ${voucher.value.toLocaleString()}đ`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="checkout-btn"
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <span>🛒</span> Đặt hàng ngay
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary slide-up">
            <div className="summary-header">
              <span style={{ fontSize: "1.5rem" }}>📋</span>
              <h3>Tóm tắt đơn hàng</h3>
            </div>

            {/* Items List */}
            <div className="summary-items">
              {enrichedCartItems.map((item) => (
                <div key={item.product_id} className="summary-item">
                  <img
                    src={
                      item.product?.image ||
                      "https://placehold.co/60x60?text=Product"
                    }
                    alt={item.product?.title || "Sản phẩm"}
                    className="item-image"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/60x60?text=Product";
                    }}
                  />
                  <div className="item-details">
                    <div className="item-name">
                      {item.product?.title || "Sản phẩm"}
                    </div>
                    <div className="item-quantity">
                      Số lượng: {item.quantity} ×
                      {(
                        item.product?.discount_price ||
                        item.product?.price ||
                        0
                      ).toLocaleString()}
                      đ
                    </div>
                  </div>
                  <div className="item-price">
                    {item.total.toLocaleString()}đ
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="summary-totals">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>{calculateSubtotal().toLocaleString()}đ</span>
              </div>

              {promotionInfo?.tier_multiplier > 1 && (
                <div className="total-row">
                  <span>Ưu đãi hạng {promotionInfo.rank}:</span>
                  <span className="discount-amount">
                    -{calculatePromotionDiscount().toLocaleString()}đ
                  </span>
                </div>
              )}

              {selectedVoucher && (
                <div className="total-row">
                  <span>Voucher ({selectedVoucher.code}):</span>
                  <span className="discount-amount">
                    -{calculateVoucherDiscount().toLocaleString()}đ
                  </span>
                </div>
              )}

              <div className="total-row final">
                <span>Tổng cộng:</span>
                <span>{calculateFinalTotal().toLocaleString()}đ</span>
              </div>
            </div>

            {/* Promotion Info */}
            {promotionInfo && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                  borderRadius: "15px",
                  padding: "15px",
                  marginTop: "20px",
                  color: "#8b4513",
                }}
              >
                <div style={{ fontSize: "0.9rem" }}>
                  <strong>🏆 Hạng thành viên:</strong> {promotionInfo.rank}
                  <br />
                  <strong>💎 Điểm tích lũy:</strong>
                  {(promotionInfo.total_spent || 0).toLocaleString()}đ
                  {promotionInfo.tier_multiplier > 1 && (
                    <>
                      <br />
                      <strong>🎯 Ưu đãi:</strong> Giảm
                      {((promotionInfo.tier_multiplier - 1) * 100).toFixed(0)}%
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Confirmation Modal */}
        {showPaymentModal && (
          <div
            className="modal show d-block payment-modal"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">🛍️ Xác nhận đặt hàng</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowPaymentModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="order-summary-modal">
                    <h6>📋 Thông tin đơn hàng</h6>
                    <p>
                      <strong>Khách hàng:</strong> {formData.name}
                    </p>
                    <p>
                      <strong>Số điện thoại:</strong> {formData.phone}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {formData.address}
                    </p>
                    <p>
                      <strong>Phương thức thanh toán:</strong>
                      {formData.payment === "COD"
                        ? "Thanh toán khi nhận hàng"
                        : "VNPay"}
                    </p>
                  </div>

                  <div style={{ fontSize: "1.2rem", textAlign: "center" }}>
                    💰
                    <strong>
                      Tổng tiền: {calculateFinalTotal().toLocaleString()}đ
                    </strong>
                  </div>

                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "15px",
                      color: "#666",
                    }}
                  >
                    Bạn có chắc chắn muốn đặt hàng không?
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    ❌ Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleConfirmOrder}
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Đang xử lý...
                      </>
                    ) : (
                      "✅ Xác nhận đặt hàng"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;
