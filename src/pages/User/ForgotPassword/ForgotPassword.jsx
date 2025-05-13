import React, { useState } from "react";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = "Không được để trống";
    if (!formData.otp) newErrors.otp = "Không được để trống";
    if (!formData.password) newErrors.password = "Không được để trống";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // xử lý gửi form
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <h4 className="text-center fw-bold mb-4">KHÔI PHỤC MẬT KHẨU</h4>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Số điện thoại/Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập số điện thoại hoặc email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mã xác nhận OTP</Form.Label>
          <Form.Control
            type="text"
            placeholder="6 ký tự"
            maxLength={6}
            value={formData.otp}
            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
            isInvalid={!!errors.otp}
          />
          <Form.Control.Feedback type="invalid">
            {errors.otp}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Mật khẩu</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              isInvalid={!!errors.password}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </Button>
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <div className="d-grid gap-2 mb-2">
          <Button variant="danger" type="submit" className="w-100 mb-3">
            Xác nhận
          </Button>
          <Button as={Link} to="/login" variant="outline-secondary">
            Trở về
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ForgotPassword;
