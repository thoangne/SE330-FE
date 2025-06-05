import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1 className="display-1 fw-bold">404</h1>
      <p className="fs-3">🤔 Oops! Không tìm thấy trang.</p>
      <p className="lead">
        Trang bạn đang tìm có thể đã bị xóa hoặc không tồn tại.
      </p>
      <Button variant="danger" onClick={() => navigate("/")}>
        Quay về trang chủ
      </Button>
    </Container>
  );
};

export default NotFoundPage;
