import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container className="notfound-container my-5">
      <Row className="align-items-center px-5">
        {/* Cột trái - Ảnh */}
        <Col md={4} className="text-end">
          <img
            src="/public/404NotFound.png"
            alt="404 Not Found"
                      className="notfound-image"
                      style={{maxWidth:200}}
          />
        </Col>

        {/* Cột phải - Nội dung */}
        <Col md={8} className="text-start">
          <h2>Oops!</h2>
          <p>Rất tiếc, chúng tôi không thể tìm thấy những gì bạn đang tìm kiếm.</p>
          <p className="text-muted">Error code: 404</p>

          <div className="mt-4 d-flex gap-3">
            <Button variant="secondary" className="btn-back" onClick={() => navigate(-1)}>
              ⬅ Quay lại trang trước
            </Button>
            <Link to="/">
              <Button variant="primary" className="btn-back">🏠 Quay lại trang chủ</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
