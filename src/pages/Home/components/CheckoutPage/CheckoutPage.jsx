// pages/CheckoutPage.jsx
import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useCartStore } from "../../../../stores/useCartStore";
function CheckoutPage() {
  const { cartItems } = useCartStore();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "cod",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đặt hàng thành công!");
  };

  return (
    <Container className="my-4"  style={{ background: "#fff", borderRadius: "8px",padding:"16px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          <h3>Thanh toán</h3>
          <h4>Thông tin đơn hàng</h4>
          {cartItems.length === 0 ? (
              <p>Giỏ hàng trống</p>
          ) : (
              <Form onSubmit={handleSubmit}>
                  <Row>
                      <Col md={6}>
                          <Form.Group className="mb-3">
                              <Form.Label>Họ tên</Form.Label>
                              <Form.Control
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  required
                              />
                          </Form.Group>
                          <Form.Group className="mb-3">
                              <Form.Label>Địa chỉ</Form.Label>
                              <Form.Control
                                  value={formData.address}
                                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                  required
                              />
                          </Form.Group>
                          <Form.Group className="mb-3">
                              <Form.Label>Số điện thoại</Form.Label>
                              <Form.Control
                                  value={formData.phone}
                                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                  required
                              />
                          </Form.Group>
                          <Form.Group className="mb-3">
                              <Form.Label>Phương thức thanh toán</Form.Label>
                              <Form.Select
                                  value={formData.payment}
                                  onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                              >
                                  <option value="cod">Thanh toán khi nhận hàng</option>
                                  <option value="bank">Chuyển khoản</option>
                              </Form.Select>
                          </Form.Group>
                          <Button type="submit" variant="success">Xác nhận đơn hàng</Button>
                      </Col>
                  </Row>
              </Form>
          )}
    </Container>
  );
}

export default CheckoutPage;
