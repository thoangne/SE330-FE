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
} from "react-bootstrap";
import { useAuthStore } from "../../../stores/useAuthStore";
import { getUserInfo, updateUserInfo } from "../../../services/authService";
import { BsPersonFill, BsClockHistory, BsBell, BsHeart } from "react-icons/bs";
import { toast } from "react-hot-toast";
import "./Profile.css";

function Profile() {
  const { user, updateUser } = useAuthStore();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        // Use user from auth store first
        if (user) {
          setUserProfile(user);
          setFormData({
            fullName: user.fullName || user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
          });
        }

        // Try to fetch fresh user info from API
        const result = await getUserInfo();
        if (result.success) {
          setUserProfile(result.data);
          setFormData({
            fullName: result.data.fullName || result.data.name || "",
            email: result.data.email || "",
            phone: result.data.phone || "",
            address: result.data.address || "",
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast.error("Không thể tải thông tin người dùng");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const result = await updateUserInfo(formData);
      if (result.success) {
        // Update both local state and auth store
        setUserProfile(result.data);
        updateUser(result.data);
        toast.success("Cập nhật thông tin thành công!");
      } else {
        toast.error(result.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
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
      <Tab.Container id="profile-tabs" defaultActiveKey="account">
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
                      alt={userProfile?.fullName || userProfile?.name || "User"}
                      className="rounded-circle avatar"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <h5 className="mt-3">
                    {userProfile?.fullName || userProfile?.name || "Người dùng"}
                  </h5>
                  <p className="text-muted">{userProfile?.email}</p>
                  <Badge
                    bg={userProfile?.role === "ADMIN" ? "danger" : "primary"}
                  >
                    {userProfile?.role === "ADMIN"
                      ? "Quản trị viên"
                      : "Người dùng"}
                  </Badge>
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
                    <Nav.Link eventKey="notifications">
                      <BsBell /> Thông báo
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="wishlist">
                      <BsHeart /> Sản phẩm yêu thích
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
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
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
                              required
                              disabled // Email thường không cho phép thay đổi
                            />
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
                        <Col md={6}>
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
                          <strong>ID:</strong>{" "}
                          {userProfile?.id || userProfile?._id || "N/A"}
                        </div>
                      </div>
                    </Form>
                  </Tab.Pane>

                  {/* Orders Tab */}
                  <Tab.Pane eventKey="orders">
                    <h4>Đơn hàng của tôi</h4>
                    <Alert variant="info">
                      Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!
                    </Alert>
                  </Tab.Pane>

                  {/* Notifications Tab */}
                  <Tab.Pane eventKey="notifications">
                    <h4>Thông báo</h4>
                    <Alert variant="info">Bạn chưa có thông báo nào.</Alert>
                  </Tab.Pane>

                  {/* Wishlist Tab */}
                  <Tab.Pane eventKey="wishlist">
                    <h4>Sản phẩm yêu thích</h4>
                    <Alert variant="info">
                      Bạn chưa có sản phẩm yêu thích nào.
                    </Alert>
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
