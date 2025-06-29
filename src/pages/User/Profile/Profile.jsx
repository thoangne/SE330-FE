import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  Tab,
  Form,
  Button,
  Badge,
  Alert,
  Spinner,
  Table,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../../stores/useAuthStore";
import { updateUserInfo, getUserById } from "../../../services/authService";
import {
  userOrderService,
  userVoucherService,
  userPromotionService,
} from "../../../services/userServices";
import { BsPersonFill, BsClockHistory, BsGift, BsStar } from "react-icons/bs";
import { toast } from "react-hot-toast";
import "./Profile.css";

function Profile() {
  const location = useLocation();
  const { user, updateUser } = useAuthStore();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [orders, setOrders] = useState([]);
  const [userVouchers, setUserVouchers] = useState([]);
  const [promotionInfo, setPromotionInfo] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "account"
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        // Use user from auth store first as fallback
        if (user) {
          console.log("🔍 Profile: User from auth store:", user);
          setUserProfile(user);
          setFormData({
            name: user.full_name || user.fullName || user.name || "",
            email: user.email || "",
            password: "", // Don't pre-fill password
            phone: user.phone || "",
            address: user.address || "",
          });

          // Try to fetch fresh user info from API
          try {
            console.log(
              "🔍 Profile: Fetching fresh user data from API for user:",
              user.id
            );
            const userResult = await getUserById(user.id);
            if (userResult.success && userResult.data) {
              console.log(
                "🔍 Profile: Fresh user data loaded:",
                userResult.data
              );
              const freshUser = userResult.data;
              setUserProfile(freshUser);
              setFormData({
                name:
                  freshUser.name ||
                  freshUser.full_name ||
                  freshUser.fullName ||
                  "",
                email: freshUser.email || "",
                password: "", // Don't pre-fill password
                phone: freshUser.phone || "",
                address: freshUser.address || "",
              });

              // Load promotion info using fresh user data
              try {
                console.log(
                  "🏆 Profile: Loading promotion info for fresh user:",
                  freshUser.id,
                  "points:",
                  freshUser.point || freshUser.points
                );
                const userPoints =
                  freshUser.point ||
                  freshUser.points ||
                  freshUser.totalPoints ||
                  0;
                const promotionResponse =
                  await userPromotionService.getUserRankInfo(userPoints);
                console.log(
                  "🏆 Profile: Promotion info loaded:",
                  promotionResponse
                );
                setPromotionInfo(promotionResponse.data || promotionResponse);
              } catch (error) {
                console.error(
                  "🏆 Profile: Error loading promotion info:",
                  error
                );
                // Don't show error toast for promotion info as it's optional
              }
            }
          } catch (error) {
            console.error("🔍 Profile: Error fetching fresh user data:", error);
            // Continue with auth store data on API error

            // Try to load promotion info with auth store user as fallback
            try {
              console.log(
                "🏆 Profile: Loading promotion info for auth store user:",
                user.id,
                "points:",
                user.point || user.points
              );
              const userPoints =
                user.point || user.points || user.totalPoints || 0;
              const promotionResponse =
                await userPromotionService.getUserRankInfo(userPoints);
              console.log(
                "🏆 Profile: Promotion info loaded:",
                promotionResponse
              );
              setPromotionInfo(promotionResponse.data || promotionResponse);
            } catch (error) {
              console.error("🏆 Profile: Error loading promotion info:", error);
              // Don't show error toast for promotion info as it's optional
            }
          }
        } else {
          console.warn("🔍 Profile: No user found in auth store");
        }
      } catch (error) {
        console.error("🔍 Profile: Error loading user profile:", error);
        toast.error("Không thể tải thông tin người dùng");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const loadUserOrders = async () => {
    if (!user?.id) return;

    setLoadingOrders(true);
    try {
      console.log("📦 Profile: Loading orders for user:", user.id);
      const response = await userOrderService.getOrdersByUserId(user.id);
      console.log("📦 Profile: Orders loaded:", response);

      // Handle different possible response structures
      const ordersData = response.data || response || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error("📦 Profile: Error loading orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
      setOrders([]); // Set empty array on error
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadUserVouchers = async () => {
    if (!user?.id) return;

    setLoadingVouchers(true);
    try {
      console.log("🎫 Profile: Loading vouchers for user:", user.id);

      // Use getAllVouchers instead of getAvailableVouchers (which doesn't exist)
      const response = await userVoucherService.getAllVouchers();
      console.log("🎫 Profile: Vouchers loaded:", response);

      // Handle different possible response structures
      const vouchersData = response.data || response || [];

      // Filter vouchers that are available for user (basic client-side filtering)
      const availableVouchers = Array.isArray(vouchersData)
        ? vouchersData.filter((voucher) => {
            const now = new Date();
            const expiry = new Date(voucher.expiryDate || voucher.expiry_date);
            const isNotExpired = expiry > now;
            const hasUsageLeft = (voucher.remaining || 0) > 0;
            return isNotExpired && hasUsageLeft;
          })
        : [];

      setUserVouchers(availableVouchers);
    } catch (error) {
      console.error("🎫 Profile: Error loading vouchers:", error);
      toast.error("Không thể tải danh sách voucher");
      setUserVouchers([]); // Set empty array on error
    } finally {
      setLoadingVouchers(false);
    }
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);

    if (tab === "orders" && orders.length === 0) {
      loadUserOrders();
    } else if (tab === "vouchers" && userVouchers.length === 0) {
      loadUserVouchers();
    }
  };

  const getOrderStatusVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "info";
      case "SHIPPING":
        return "primary";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "SHIPPING":
        return "Đang giao";
      case "DELIVERED":
        return "Đã giao";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getVoucherStatusVariant = (voucher) => {
    const now = new Date();
    const expiry = new Date(voucher.expiryDate || voucher.expiry_date);

    if (expiry < now) return "secondary";
    if ((voucher.remaining || 0) <= 0) return "secondary";
    return "success";
  };

  const getVoucherStatusText = (voucher) => {
    const now = new Date();
    const expiry = new Date(voucher.expiryDate || voucher.expiry_date);

    if (expiry < now) return "Đã hết hạn";
    if ((voucher.remaining || 0) <= 0) return "Đã hết lượt sử dụng";
    return "Có thể sử dụng";
  };

  // Helper function to get rank CSS class
  const getRankClass = (rank) => {
    if (!rank) return "rank-bronze";

    const rankLower = rank.toLowerCase();

    if (rankLower.includes("bronze") || rankLower.includes("đồng")) {
      return "rank-bronze";
    } else if (rankLower.includes("silver") || rankLower.includes("bạc")) {
      return "rank-silver";
    } else if (rankLower.includes("gold") || rankLower.includes("vàng")) {
      return "rank-gold";
    } else if (
      rankLower.includes("platinum") ||
      rankLower.includes("bạch kim")
    ) {
      return "rank-platinum";
    } else if (
      rankLower.includes("diamond") ||
      rankLower.includes("kim cương")
    ) {
      return "rank-diamond";
    } else {
      return "rank-bronze"; // Default
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      console.log(
        "✏️ Profile: Updating user info:",
        formData,
        "for user:",
        user?.id
      );

      // Prepare the update payload according to API spec
      const updatePayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      // Only include password if user has entered a new one
      if (formData.password && formData.password.trim()) {
        updatePayload.password = formData.password;
      }

      const result = await updateUserInfo(updatePayload, user?.id);
      console.log("✏️ Profile: Update result:", result);

      if (result.success) {
        // Update both local state and auth store
        const updatedUser = result.data || { ...user, ...updatePayload };
        setUserProfile(updatedUser);
        updateUser(updatedUser);

        // Clear password field after successful update
        setFormData((prev) => ({ ...prev, password: "" }));

        toast.success("Cập nhật thông tin thành công!");
      } else {
        console.error("✏️ Profile: Update failed:", result);
        toast.error(result.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("✏️ Profile: Error updating profile:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Đang tải thông tin người dùng...</p>
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container className="my-4">
        <Alert variant="warning">
          Không thể tải thông tin người dùng. Vui lòng thử lại sau.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Tab.Container
        id="profile-tabs"
        activeKey={activeTab}
        onSelect={handleTabSelect}
      >
        <Row>
          <Col md={3}>
            <Card className="profile-sidebar">
              <Card.Body>
                <div className="text-center mb-4">
                  <div className="avatar-wrapper">
                    <img
                      src={
                        userProfile?.avatar ||
                        userProfile?.profilePicture ||
                        "https://picsum.photos/100/100"
                      }
                      alt={
                        userProfile?.full_name ||
                        userProfile?.fullName ||
                        userProfile?.name ||
                        "User"
                      }
                      className="rounded-circle avatar"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <h5 className="mt-3">
                    {userProfile?.full_name ||
                      userProfile?.fullName ||
                      userProfile?.name ||
                      "Người dùng"}
                  </h5>
                  <p className="text-muted">{userProfile?.email}</p>
                  <Badge
                    bg={userProfile?.role === "ADMIN" ? "danger" : "primary"}
                  >
                    {userProfile?.role === "ADMIN"
                      ? "Quản trị viên"
                      : "Người dùng"}
                  </Badge>

                  {/* Promotion Info */}
                  {promotionInfo && (
                    <Card
                      className={`mt-3 ${getRankClass(promotionInfo.rank)}`}
                    >
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <small className="text-muted">Hạng thành viên</small>
                          <Badge className="rank-badge d-flex align-items-center">
                            <BsStar className="me-1" />
                            {promotionInfo.rank}
                          </Badge>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Điểm tích lũy:{" "}
                            {userProfile?.point || userProfile?.points || 0}{" "}
                            điểm
                          </small>
                          <small className="text-muted d-block">
                            Tổng chi tiêu:{" "}
                            {promotionInfo.total_spent?.toLocaleString()} đ
                          </small>
                          {promotionInfo.tier_multiplier > 1 && (
                            <small className="text-success">
                              Ưu đãi: x{promotionInfo.tier_multiplier}
                            </small>
                          )}
                        </div>
                        {promotionInfo.next_tier_requirement && (
                          <div>
                            <small className="text-muted d-block mb-1">
                              Để lên hạng tiếp theo
                            </small>
                            <ProgressBar
                              now={
                                (promotionInfo.total_spent /
                                  promotionInfo.next_tier_requirement) *
                                100
                              }
                              size="sm"
                            />
                            <small className="text-muted">
                              Còn{" "}
                              {(
                                promotionInfo.next_tier_requirement -
                                promotionInfo.total_spent
                              ).toLocaleString()}{" "}
                              đ
                            </small>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  )}
                </div>

                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="account">
                      <BsPersonFill /> Thông tin tài khoản
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="orders">
                      <BsClockHistory /> Đơn hàng của tôi
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="vouchers">
                      <BsGift /> Voucher của tôi
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Card>
              <Card.Body>
                <Tab.Content>
                  {/* Account Information Tab */}
                  <Tab.Pane eventKey="account">
                    <h4>Thông tin tài khoản</h4>
                    <Form onSubmit={handleProfileUpdate}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Nhập họ và tên"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Nhập email"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="Để trống nếu không đổi mật khẩu"
                            />
                            <Form.Text className="text-muted">
                              Chỉ nhập nếu bạn muốn thay đổi mật khẩu
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Nhập số điện thoại"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Vai trò</Form.Label>
                            <Form.Control
                              value={
                                userProfile?.role === "ADMIN"
                                  ? "Quản trị viên"
                                  : "Người dùng"
                              }
                              disabled
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Nhập địa chỉ của bạn"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-between align-items-center">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Đang cập nhật...
                            </>
                          ) : (
                            "Cập nhật thông tin"
                          )}
                        </Button>

                        <div className="text-muted small">
                          <strong>ID:</strong>
                          {userProfile?.id || userProfile?._id || "N/A"}
                        </div>
                      </div>
                    </Form>
                  </Tab.Pane>

                  {/* Orders Tab */}
                  <Tab.Pane eventKey="orders">
                    <h4>Đơn hàng của tôi</h4>
                    {loadingOrders ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Đang tải danh sách đơn hàng...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <Alert variant="info">
                        Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!
                      </Alert>
                    ) : (
                      <div>
                        {orders.map((order) => {
                          console.log("🔍 Profile: Rendering order:", order); // Debug log
                          return (
                            <Card key={order.id} className="mb-3">
                              <Card.Header className="d-flex justify-content-between align-items-center">
                                <div>
                                  <strong>Đơn hàng #{order.id}</strong>
                                  <br />
                                  <small className="text-muted">
                                    {new Date(
                                      order.created_at ||
                                        order.createdAt ||
                                        order.orderDate
                                    ).toLocaleDateString("vi-VN")}
                                  </small>
                                </div>
                                <Badge bg={getOrderStatusVariant(order.status)}>
                                  {getOrderStatusText(order.status)}
                                </Badge>
                              </Card.Header>
                              <Card.Body>
                                <Row>
                                  <Col md={8}>
                                    {/* Display order items/products */}
                                    {order.items && order.items.length > 0 ? (
                                      <div>
                                        <strong>Sản phẩm đã đặt:</strong>
                                        {order.items.map((item, index) => (
                                          <div
                                            key={index}
                                            className="mb-2 p-2 border-start border-3 border-primary"
                                          >
                                            <div className="d-flex justify-content-between">
                                              <span>
                                                {item.product?.title ||
                                                  item.productName ||
                                                  `Sản phẩm #${item.productId}`}
                                              </span>
                                              <span className="text-muted">
                                                x{item.quantity} ={" "}
                                                {(
                                                  item.price * item.quantity
                                                ).toLocaleString()}
                                                đ
                                              </span>
                                            </div>
                                            {item.product?.author && (
                                              <small className="text-muted">
                                                Tác giả: {item.product.author}
                                              </small>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    ) : order.orderItems &&
                                      order.orderItems.length > 0 ? (
                                      <div>
                                        <strong>Sản phẩm đã đặt:</strong>
                                        {order.orderItems.map((item, index) => (
                                          <div
                                            key={index}
                                            className="mb-2 p-2 border-start border-3 border-primary"
                                          >
                                            <div className="d-flex justify-content-between">
                                              <span>
                                                {item.product?.title ||
                                                  item.productName ||
                                                  `Sản phẩm #${item.productId}`}
                                              </span>
                                              <span className="text-muted">
                                                x{item.quantity} ={" "}
                                                {(
                                                  item.price * item.quantity
                                                ).toLocaleString()}
                                                đ
                                              </span>
                                            </div>
                                            {item.product?.author && (
                                              <small className="text-muted">
                                                Tác giả: {item.product.author}
                                              </small>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-muted">
                                        Không có thông tin sản phẩm
                                      </p>
                                    )}

                                    {/* Display payment method if available */}
                                    {(order.payment_method ||
                                      order.paymentMethod) && (
                                      <p className="mt-2">
                                        <strong>Phương thức thanh toán:</strong>{" "}
                                        {order.payment_method ||
                                          order.paymentMethod}
                                      </p>
                                    )}

                                    {(order.notes || order.note) && (
                                      <p className="mt-2">
                                        <strong>Ghi chú:</strong>{" "}
                                        {order.notes || order.note}
                                      </p>
                                    )}
                                  </Col>
                                  <Col md={4} className="text-end">
                                    <h5 className="text-primary">
                                      {userOrderService.formatOrderTotal(order)}
                                      đ
                                    </h5>
                                    {(order.voucher_id || order.voucherId) && (
                                      <small className="text-success">
                                        <BsGift /> Đã sử dụng voucher
                                      </small>
                                    )}
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </Tab.Pane>

                  {/* Vouchers Tab */}
                  <Tab.Pane eventKey="vouchers">
                    <h4>Voucher của tôi</h4>
                    {loadingVouchers ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Đang tải danh sách voucher...</p>
                      </div>
                    ) : userVouchers.length === 0 ? (
                      <Alert variant="info">
                        Bạn chưa có voucher nào. Hãy tham gia các chương trình
                        khuyến mãi!
                      </Alert>
                    ) : (
                      <Row>
                        {userVouchers.map((voucher) => (
                          <Col md={6} key={voucher.id} className="mb-3">
                            <Card
                              className={`h-100 ${
                                getVoucherStatusVariant(voucher) === "secondary"
                                  ? "opacity-50"
                                  : ""
                              }`}
                              border={getVoucherStatusVariant(voucher)}
                            >
                              <Card.Header className="d-flex justify-content-between align-items-center">
                                <strong>{voucher.code}</strong>
                                <Badge bg={getVoucherStatusVariant(voucher)}>
                                  {getVoucherStatusText(voucher)}
                                </Badge>
                              </Card.Header>
                              <Card.Body>
                                <p>
                                  {voucher.description || "Voucher giảm giá"}
                                </p>
                                <div className="mb-2">
                                  <strong>Giảm:</strong>{" "}
                                  {userVoucherService.formatVoucherDiscount(
                                    voucher
                                  )}
                                </div>
                                <div className="mb-2">
                                  <strong>Áp dụng cho:</strong> đơn từ{" "}
                                  {voucher.minPurchase?.toLocaleString()} đ
                                </div>
                                <div className="mb-2">
                                  <strong>Hạn sử dụng:</strong>{" "}
                                  {new Date(
                                    voucher.expiryDate || voucher.expiry_date
                                  ).toLocaleDateString("vi-VN")}
                                </div>
                                <div className="mb-2">
                                  <strong>Điểm yêu cầu:</strong>{" "}
                                  {voucher.point || 0} điểm
                                </div>
                                <div>
                                  <strong>Còn lại:</strong> {voucher.remaining}/
                                  {voucher.maxUsage}
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default Profile;
