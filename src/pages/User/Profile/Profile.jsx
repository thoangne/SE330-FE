import React, { useEffect } from "react";
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
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import useProfileStore from "../../../stores/useProfileStore";
import { BsPersonFill, BsClockHistory, BsBell, BsHeart } from "react-icons/bs";
import "./Profile.css";

function Profile() {
  const {
    userProfile,
    orders,
    notifications,
    wishlist,
    isLoading,
    fetchUserProfile,
    fetchOrders,
    fetchNotifications,
    fetchWishlist,
    updateProfile,
  } = useProfileStore();
  useEffect(() => {
    fetchUserProfile();
    fetchOrders();
    fetchNotifications();
    fetchWishlist();
  }, [fetchUserProfile, fetchOrders, fetchNotifications, fetchWishlist]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());
    updateProfile(updatedData);
  };

  if (isLoading || !userProfile) {
    return <div>Loading...</div>;
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
                        userProfile?.avatar || "https://via.placeholder.com/100"
                      }
                      alt={userProfile?.fullName}
                      className="rounded-circle avatar"
                    />
                  </div>
                  <h5 className="mt-3">{userProfile?.fullName}</h5>
                  <Badge bg="secondary">{userProfile?.membershipLevel}</Badge>
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
                  <Tab.Pane eventKey="account">
                    <h4>Thông tin tài khoản</h4>
                    <Form onSubmit={handleProfileUpdate}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control
                              name="fullName"
                              defaultValue={userProfile.fullName}
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
                              defaultValue={userProfile.email}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                              name="phone"
                              defaultValue={userProfile.phone}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Giới tính</Form.Label>
                            <Form.Select
                              name="gender"
                              defaultValue={userProfile.gender}
                            >
                              <option value="Nam">Nam</option>
                              <option value="Nữ">Nữ</option>
                              <option value="Khác">Khác</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Ngày sinh</Form.Label>
                            <Form.Control
                              type="date"
                              name="birthday"
                              defaultValue={userProfile.birthday}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button type="submit" variant="primary">
                        Lưu thay đổi
                      </Button>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="orders">
                    <h4>Đơn hàng của tôi</h4>
                    {orders.map((order) => (
                      <Card key={order.id} className="mb-3">
                        <Card.Body>
                          <Row>
                            <Col md={3}>
                              <strong>Mã đơn hàng:</strong> {order.id}
                            </Col>
                            <Col md={3}>
                              <strong>Ngày đặt:</strong> {order.date}
                            </Col>
                            <Col md={3}>
                              <strong>Tổng tiền:</strong>{" "}
                              {order.total.toLocaleString()}₫
                            </Col>
                            <Col md={3}>
                              <Badge
                                bg={
                                  order.status === "Đã giao hàng"
                                    ? "success"
                                    : "warning"
                                }
                              >
                                {order.status}
                              </Badge>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </Tab.Pane>

                  <Tab.Pane eventKey="notifications">
                    <h4>Thông báo</h4>
                    {notifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className={`mb-3 ${
                          !notification.isRead ? "unread" : ""
                        }`}
                      >
                        <Card.Body>
                          <h6>{notification.title}</h6>
                          <p className="mb-1">{notification.message}</p>
                          <small className="text-muted">
                            {notification.date}
                          </small>
                        </Card.Body>
                      </Card>
                    ))}
                  </Tab.Pane>

                  <Tab.Pane eventKey="wishlist">
                    <h4>Sản phẩm yêu thích</h4>
                    <Row>
                      {wishlist.map((item) => (
                        <Col md={4} key={item.id} className="mb-3">
                          <Card>
                            <Card.Img variant="top" src={item.image} />
                            <Card.Body>
                              {" "}
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>{item.name}</Tooltip>}
                              >
                                <Card.Title className="book-title">
                                  {item.name}
                                </Card.Title>
                              </OverlayTrigger>
                              <Card.Text className="book-price">
                                {item.price.toLocaleString()}₫
                              </Card.Text>
                              <Button variant="primary" size="sm">
                                Thêm vào giỏ
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
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
