import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
  Badge,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  BsTrash,
  BsPlus,
  BsDash,
  BsCart,
  BsHeart,
  BsShare,
} from "react-icons/bs";
import toast from "react-hot-toast";
import { useCartStore } from "../../../../stores/useCartStore";
import { useAuthStore } from "../../../../stores/useAuthStore";
import {
  userCartService,
  userProductService,
} from "../../../../services/userServices";
import "./CartPage.css";

function CartPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { cartItems, updateQty, removeFromCart, initializeCart } =
    useCartStore();

  const [loading, setLoading] = useState(false);
  const [enrichedCartItems, setEnrichedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  // State for optimistic updates and batch sync
  const [pendingUpdates, setPendingUpdates] = useState(new Map());
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimeoutRef = useRef(null);
  const hasPendingChangesRef = useRef(false);

  const refreshCartData = useCallback(async () => {
    if (isAuthenticated && user?.id) {
      setLoading(true);
      try {
        console.log("🛒 CartPage: Refreshing cart data for user:", user.id);
        const cartResponse = await userCartService.getCartByUserId(user.id);
        const serverCartItems =
          cartResponse.cartItems || cartResponse.items || [];

        if (serverCartItems.length === 0) {
          setEnrichedItems([]);
          return;
        }

        // Enrich cart items with product details
        const enriched = await Promise.all(
          serverCartItems.map(async (item) => {
            try {
              const productId = item.productId || item.product_id;
              const productResponse = await userProductService.getProductById(
                productId
              );
              const product = productResponse?.data || productResponse;

              if (!product || !product.id) {
                return null;
              }

              return {
                id: product.id,
                product_id: productId,
                title: product.title,
                price: product.price,
                discount: product.discount || 0,
                discount_price:
                  product.discount > 0
                    ? product.price * (1 - product.discount / 100)
                    : product.price,
                image_url: product.image_url || product.coverImage,
                stock: product.stock,
                qty: item.quantity,
                author:
                  product.author ||
                  (product.authors &&
                    product.authors.map((a) => a.name).join(", ")),
                publisher: product.publisher?.name,
                total:
                  item.quantity *
                  (product.discount > 0
                    ? product.price * (1 - product.discount / 100)
                    : product.price),
              };
            } catch (error) {
              console.error(
                `🛒 CartPage: Error loading product ${
                  item.productId || item.product_id
                }:`,
                error
              );
              return null;
            }
          })
        );

        const validItems = enriched.filter((item) => item !== null);
        setEnrichedItems(validItems);

        // Select all items by default (only if no items are currently selected)
        if (selectedItems.size === 0) {
          const itemIds = validItems.map((item) => item.id);
          setSelectedItems(new Set(itemIds));
        }
      } catch (error) {
        console.error("Error refreshing cart:", error);
        toast.error("Không thể tải giỏ hàng từ server");
      } finally {
        setLoading(false);
      }
    }
  }, [isAuthenticated, user?.id, selectedItems.size]);

  // Batch sync function
  const syncPendingChanges = useCallback(async () => {
    if (
      !isAuthenticated ||
      !user?.id ||
      pendingUpdates.size === 0 ||
      isSyncing
    ) {
      return;
    }

    setIsSyncing(true);
    hasPendingChangesRef.current = false;

    try {
      console.log("🛒 CartPage: Syncing pending changes:", pendingUpdates);

      // Process all pending updates
      const updatePromises = Array.from(pendingUpdates.entries()).map(
        async ([productId, update]) => {
          try {
            if (update.action === "updateQuantity") {
              await userCartService.updateQuantity(
                user.id,
                productId,
                update.quantity
              );
            } else if (update.action === "remove") {
              await userCartService.removeFromCart(user.id, productId);
            }
          } catch (error) {
            console.error(
              `Error syncing ${update.action} for product ${productId}:`,
              error
            );
            throw error;
          }
        }
      );

      await Promise.all(updatePromises);

      // Clear pending updates after successful sync
      setPendingUpdates(new Map());
      console.log("🛒 CartPage: Successfully synced all pending changes");
    } catch (error) {
      console.error("🛒 CartPage: Error syncing changes:", error);
      toast.error("Có lỗi khi đồng bộ giỏ hàng. Vui lòng thử lại!");
      // Refresh from server on sync error
      refreshCartData();
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, user?.id, pendingUpdates, isSyncing, refreshCartData]);

  // Debounced sync (for when user leaves page)
  const debouncedSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      if (hasPendingChangesRef.current) {
        syncPendingChanges();
      }
    }, 2000); // 2 second delay
  }, [syncPendingChanges]);

  // Cleanup function to sync before unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      // Force sync on unmount if there are pending changes
      if (hasPendingChangesRef.current && pendingUpdates.size > 0) {
        syncPendingChanges();
      }
    };
  }, [syncPendingChanges, pendingUpdates]);

  // Sync before page unload/navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasPendingChangesRef.current && pendingUpdates.size > 0) {
        // Synchronous sync on page unload
        e.preventDefault();
        syncPendingChanges();
        return (e.returnValue =
          "Có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang?");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [syncPendingChanges, pendingUpdates]);

  // Initialize cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log("🛒 CartPage: Initializing cart for user:", user.id);
      initializeCart(userCartService, user.id);
    }
  }, [isAuthenticated, user?.id, initializeCart]);

  // Load initial cart data only once when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      if (isAuthenticated && user?.id && !hasLoadedInitialData) {
        await refreshCartData();
        setHasLoadedInitialData(true);
      } else if (!isAuthenticated && cartItems.length > 0) {
        // For guest users, use local cart
        setEnrichedItems(cartItems);
      }
    };

    loadInitialData();
  }, [
    isAuthenticated,
    user?.id,
    hasLoadedInitialData,
    refreshCartData,
    cartItems,
  ]); // Include all dependencies

  // Update selected items when cart changes
  useEffect(() => {
    if (enrichedCartItems.length === 0) {
      setSelectedItems(new Set());
      setSelectAll(false);
      return;
    }

    const allItemIds = enrichedCartItems.map(
      (item) => item.id || item.product_id
    );

    // Clean up invalid selected items
    setSelectedItems((prevSelected) => {
      const currentSelectedIds = Array.from(prevSelected);
      const validSelectedIds = currentSelectedIds.filter((id) =>
        allItemIds.includes(id)
      );

      // Only update if there are invalid selections
      if (validSelectedIds.length !== currentSelectedIds.length) {
        const newSet = new Set(validSelectedIds);
        // Also update selectAll state here to avoid additional useEffect
        setTimeout(() => {
          setSelectAll(
            newSet.size === allItemIds.length && allItemIds.length > 0
          );
        }, 0);
        return newSet;
      }

      // Update selectAll based on current valid selection
      setTimeout(() => {
        setSelectAll(
          prevSelected.size === allItemIds.length && allItemIds.length > 0
        );
      }, 0);

      return prevSelected;
    });
  }, [enrichedCartItems]); // Only depend on cart items to avoid loops

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;

    // Find the item to check stock
    const item = enrichedCartItems.find(
      (item) => item.id === productId || item.product_id === productId
    );
    if (item && newQty > item.stock) {
      toast.error(`Chỉ còn ${item.stock} sản phẩm trong kho`);
      return;
    }

    // Update local state immediately for responsive UI (optimistic update)
    const updatedItems = enrichedCartItems.map((item) =>
      item.id === productId || item.product_id === productId
        ? {
            ...item,
            qty: newQty,
            total: newQty * item.discount_price,
          }
        : item
    );
    setEnrichedItems(updatedItems);

    if (isAuthenticated && user?.id) {
      // Store pending update
      setPendingUpdates((prev) => {
        const newUpdates = new Map(prev);
        newUpdates.set(productId, {
          action: "updateQuantity",
          quantity: newQty,
        });
        return newUpdates;
      });
      hasPendingChangesRef.current = true;
      debouncedSync(); // Will sync after delay when user stops making changes
    } else {
      // Update local cart for guest users
      updateQty(productId, newQty);
    }
  };

  const handleRemoveItem = async (productId) => {
    // Update local state immediately (optimistic update)
    const updatedItems = enrichedCartItems.filter(
      (item) => item.id !== productId && item.product_id !== productId
    );
    setEnrichedItems(updatedItems);

    // Remove from selected items
    const newSelected = new Set(selectedItems);
    newSelected.delete(productId);
    setSelectedItems(newSelected);

    if (isAuthenticated && user?.id) {
      // Store pending update
      setPendingUpdates((prev) => {
        const newUpdates = new Map(prev);
        newUpdates.set(productId, { action: "remove" });
        return newUpdates;
      });
      hasPendingChangesRef.current = true;
      debouncedSync(); // Will sync after delay when user stops making changes
    } else {
      // Remove from local cart for guest users
      removeFromCart(productId);
    }

    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleSelectItem = (productId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const allIds = enrichedCartItems.map(
        (item) => item.id || item.product_id
      );
      setSelectedItems(new Set(allIds));
    }
    setSelectAll(!selectAll);
  };

  const calculateSelectedTotal = () => {
    return enrichedCartItems
      .filter((item) => selectedItems.has(item.id || item.product_id))
      .reduce(
        (sum, item) => sum + (item.total || item.qty * item.discount_price),
        0
      );
  };

  const handleCheckout = async () => {
    const selectedItemsList = enrichedCartItems.filter((item) =>
      selectedItems.has(item.id || item.product_id)
    );

    if (selectedItemsList.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      navigate("/login");
      return;
    }

    // Sync pending changes before checkout
    if (hasPendingChangesRef.current && pendingUpdates.size > 0) {
      setLoading(true);
      await syncPendingChanges();
      setLoading(false);
    }

    // Pass selected items with correct quantities to checkout
    navigate("/checkout", {
      state: {
        selectedItems: selectedItemsList.map((item) => ({
          productId: item.id || item.product_id,
          quantity: item.qty,
          price: item.price,
          discount: item.discount,
          discount_price: item.discount_price,
          title: item.title,
          image_url: item.image_url,
          author: item.author,
          publisher: item.publisher,
          product: {
            id: item.id || item.product_id,
            title: item.title,
            price: item.price,
            discount: item.discount,
            discount_price: item.discount_price,
            image: item.image_url,
            author: item.author,
            publisher: item.publisher,
          },
        })),
        totalAmount: calculateSelectedTotal(),
      },
    });
  };

  // Show login prompt for guest users
  if (!isAuthenticated) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-lg text-center">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <BsCart size={64} className="text-primary mb-3" />
                  <h3 className="fw-bold mb-3">Đăng nhập để xem giỏ hàng</h3>
                  <p className="text-muted lead">
                    Đăng nhập để lưu giỏ hàng và có trải nghiệm mua sắm tốt nhất
                  </p>
                </div>
                <div className="d-grid gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="fw-bold"
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập ngay
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => navigate("/")}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="py-5">
              <Spinner
                animation="border"
                variant="primary"
                style={{ width: "3rem", height: "3rem" }}
              />
              <h4 className="mt-3 fw-bold">Đang tải giỏ hàng</h4>
              <p className="text-muted">Vui lòng đợi trong giây lát...</p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Show empty cart
  if (enrichedCartItems.length === 0) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-lg text-center">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <BsCart size={80} className="text-muted mb-4" />
                  <h3 className="fw-bold mb-3">Giỏ hàng trống</h3>
                  <p className="text-muted lead mb-4">
                    Bạn chưa có sản phẩm nào trong giỏ hàng.
                    <br />
                    Hãy khám phá những cuốn sách tuyệt vời của chúng tôi!
                  </p>
                </div>
                <div className="d-grid gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="fw-bold"
                    onClick={() => navigate("/")}
                  >
                    Khám phá sách hay
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Quay lại trang trước
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h2 className="fw-bold mb-1">
              <BsCart className="me-2" />
              Giỏ hàng của bạn
            </h2>
            <p className="text-muted mb-0">
              {enrichedCartItems.length} sản phẩm • {selectedItems.size} đã chọn
            </p>
          </div>
          {isAuthenticated && (
            <Button
              variant="outline-primary"
              onClick={refreshCartData}
              disabled={loading}
              className="d-flex align-items-center"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Đang tải...
                </>
              ) : (
                "Làm mới"
              )}
            </Button>
          )}
        </div>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          {/* Select All Controls */}
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center justify-content-between">
                <Form.Check
                  type="checkbox"
                  label={`Chọn tất cả (${enrichedCartItems.length})`}
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="fw-medium"
                />
                {isSyncing && (
                  <Badge bg="warning" className="ms-2">
                    <small>Đang đồng bộ...</small>
                  </Badge>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Cart Items */}
          <div className="cart-items">
            {enrichedCartItems.map((item) => {
              const itemId = item.id || item.product_id;
              const isSelected = selectedItems.has(itemId);

              return (
                <Card
                  key={itemId}
                  className={`border-0 shadow-sm mb-3 ${
                    isSelected ? "border-primary" : ""
                  }`}
                  style={{
                    transition: "all 0.2s ease",
                    transform: isSelected ? "translateY(-2px)" : "none",
                  }}
                >
                  <Card.Body className="p-4">
                    <Row className="align-items-center g-3">
                      {/* Checkbox */}
                      <Col xs="auto">
                        <Form.Check
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectItem(itemId)}
                          className="cart-checkbox"
                        />
                      </Col>

                      {/* Product Image */}
                      <Col xs="auto">
                        <div
                          className="position-relative overflow-hidden rounded-3"
                          style={{ width: "100px", height: "120px" }}
                        >
                          <img
                            src={
                              item.image_url ||
                              "https://via.placeholder.com/100x120?text=No+Image"
                            }
                            alt={item.title}
                            className="w-100 h-100 object-fit-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/100x120?text=No+Image";
                            }}
                          />
                          {item.stock <= 0 && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
                              <Badge bg="danger">Hết hàng</Badge>
                            </div>
                          )}
                        </div>
                      </Col>

                      {/* Product Info */}
                      <Col>
                        <div className="product-info">
                          <h6 className="mb-2 fw-bold text-dark">
                            {item.title}
                          </h6>
                          <div className="text-muted small mb-2">
                            {item.author && (
                              <span className="me-3">
                                <i className="fas fa-user me-1"></i>
                                {item.author}
                              </span>
                            )}
                            {item.publisher && (
                              <span>
                                <i className="fas fa-building me-1"></i>
                                {item.publisher}
                              </span>
                            )}
                          </div>
                          <div className="mb-2">
                            <Badge
                              bg={item.stock > 0 ? "success" : "danger"}
                              className="me-2"
                            >
                              {item.stock > 0
                                ? `Còn ${item.stock} sản phẩm`
                                : "Hết hàng"}
                            </Badge>
                          </div>
                        </div>
                      </Col>

                      {/* Price */}
                      <Col xs="auto" className="text-end">
                        <div className="price-section">
                          {item.discount && item.discount > 0 ? (
                            <>
                              <div className="text-danger fw-bold fs-5">
                                {item.discount_price.toLocaleString()} đ
                              </div>
                              <small className="text-muted text-decoration-line-through">
                                {item.price.toLocaleString()} đ
                              </small>
                              <div>
                                <Badge bg="danger" className="small">
                                  -{item.discount}%
                                </Badge>
                              </div>
                            </>
                          ) : (
                            <div className="fw-bold fs-5 text-dark">
                              {item.price.toLocaleString()} đ
                            </div>
                          )}
                        </div>
                      </Col>

                      {/* Quantity Controls */}
                      <Col xs="auto">
                        <div className="quantity-controls">
                          <InputGroup size="sm" style={{ width: "120px" }}>
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                handleQuantityChange(itemId, item.qty - 1)
                              }
                              disabled={item.qty <= 1}
                            >
                              <BsDash />
                            </Button>
                            <Form.Control
                              type="text"
                              value={item.qty}
                              readOnly
                              className="text-center fw-bold"
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                handleQuantityChange(itemId, item.qty + 1)
                              }
                              disabled={item.qty >= item.stock}
                            >
                              <BsPlus />
                            </Button>
                          </InputGroup>
                        </div>
                      </Col>

                      {/* Actions */}
                      <Col xs="auto">
                        <div className="d-flex flex-column align-items-center gap-2">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveItem(itemId)}
                            title="Xóa sản phẩm"
                          >
                            <BsTrash />
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            title="Yêu thích"
                          >
                            <BsHeart />
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </Col>

        {/* Order Summary Sidebar */}
        <Col lg={4}>
          <div className="sticky-top" style={{ top: "20px" }}>
            <Card className="border-0 shadow-lg">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0 fw-bold">
                  <BsCart className="me-2" />
                  Tóm tắt đơn hàng
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="order-summary">
                  {/* Selected items summary */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Sản phẩm đã chọn</span>
                      <Badge bg="primary" className="fs-6">
                        {selectedItems.size}
                      </Badge>
                    </div>

                    {/* Show selected items */}
                    {enrichedCartItems
                      .filter((item) =>
                        selectedItems.has(item.id || item.product_id)
                      )
                      .slice(0, 3)
                      .map((item) => (
                        <div
                          key={item.id || item.product_id}
                          className="d-flex align-items-center mb-2"
                        >
                          <img
                            src={
                              item.image_url ||
                              "https://via.placeholder.com/40x50"
                            }
                            alt={item.title}
                            className="rounded me-2"
                            style={{
                              width: "40px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="flex-grow-1">
                            <div className="small text-truncate fw-medium">
                              {item.title}
                            </div>
                            <div className="small text-muted">
                              {item.qty} x{" "}
                              {item.discount_price.toLocaleString()}đ
                            </div>
                          </div>
                        </div>
                      ))}

                    {selectedItems.size > 3 && (
                      <div className="small text-muted text-center">
                        +{selectedItems.size - 3} sản phẩm khác
                      </div>
                    )}
                  </div>

                  <hr />

                  {/* Price breakdown */}
                  <div className="price-breakdown mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Tạm tính</span>
                      <span className="fw-medium">
                        {calculateSelectedTotal().toLocaleString()} đ
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Phí vận chuyển</span>
                      <span className="text-success fw-medium">Miễn phí</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5">Tổng cộng</span>
                      <span className="fw-bold fs-4 text-primary">
                        {calculateSelectedTotal().toLocaleString()} đ
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="d-grid gap-3">
                    <Button
                      variant="success"
                      size="lg"
                      className="fw-bold py-3"
                      onClick={handleCheckout}
                      disabled={selectedItems.size === 0}
                      style={{
                        background:
                          "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
                      }}
                    >
                      {selectedItems.size === 0
                        ? "Chọn sản phẩm để thanh toán"
                        : `Thanh toán (${selectedItems.size} sản phẩm)`}
                    </Button>

                    <Button
                      variant="outline-primary"
                      size="lg"
                      className="fw-medium"
                      onClick={() => navigate("/")}
                    >
                      Tiếp tục mua sắm
                    </Button>
                  </div>

                  {/* Info alerts */}
                  {selectedItems.size === 0 && (
                    <Alert variant="info" className="mt-3 mb-0 text-center">
                      <small>
                        <i className="fas fa-info-circle me-1"></i>
                        Chọn sản phẩm để xem tổng tiền
                      </small>
                    </Alert>
                  )}

                  {isSyncing && (
                    <Alert variant="warning" className="mt-3 mb-0 text-center">
                      <small>
                        <Spinner size="sm" className="me-2" />
                        Đang đồng bộ giỏ hàng...
                      </small>
                    </Alert>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Additional Info */}
            <Card className="border-0 shadow-sm mt-3">
              <Card.Body className="p-3">
                <div className="text-center">
                  <div className="mb-2">
                    <i className="fas fa-shield-alt text-success fs-4"></i>
                  </div>
                  <h6 className="fw-bold mb-1">Mua sắm an toàn</h6>
                  <small className="text-muted">
                    Thanh toán bảo mật 100%
                    <br />
                    Đổi trả trong 7 ngày
                  </small>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CartPage;
