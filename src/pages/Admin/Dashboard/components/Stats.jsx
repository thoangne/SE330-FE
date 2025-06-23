import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaArrowCircleRight,
  FaBook,
  FaPenNib,
  FaUserPlus,
} from "react-icons/fa";

const Stats = ({ books, authors, users, orders }) => {
  return (
    <Container fluid className="p-0">
      <Row className="g-3">
        <Col lg={3} xs={6}>
          <Card className="h-100 bg-info text-white border-0 shadow-sm overflow-hidden">
            <Card.Body className="d-flex flex-column justify-content-between position-relative">
              <div className="text-center">
                <h3 className="mb-2 fw-bold">{books || 0}</h3>
                <Card.Text className="mb-0">Sách</Card.Text>
              </div>
              <div className="position-absolute top-0 end-0 p-3 opacity-25 stats-icon">
                <FaBook size={50} />
              </div>
            </Card.Body>
            <Card.Footer className="bg-gradient bg-transparent border-0 text-center">
              <Link
                to="/admin/books"
                className="text-white text-decoration-none fw-medium"
              >
                Xem thêm <FaArrowCircleRight className="ms-1" />
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        <Col lg={3} xs={6}>
          <Card className="h-100 bg-warning text-white border-0 shadow-sm overflow-hidden">
            <Card.Body className="d-flex flex-column justify-content-between position-relative">
              <div className="text-center">
                <h3 className="mb-2 fw-bold">{authors || 0}</h3>
                <Card.Text className="mb-0">Tác giả</Card.Text>
              </div>
              <div className="position-absolute top-0 end-0 p-3 opacity-25 stats-icon">
                <FaPenNib size={50} />
              </div>
            </Card.Body>
            <Card.Footer className="bg-gradient bg-transparent border-0 text-center">
              <Link
                to="/admin/authors"
                className="text-white text-decoration-none fw-medium"
              >
                Xem thêm <FaArrowCircleRight className="ms-1" />
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        <Col lg={3} xs={6}>
          <Card className="h-100 bg-danger text-white border-0 shadow-sm overflow-hidden">
            <Card.Body className="d-flex flex-column justify-content-between position-relative">
              <div className="text-center">
                <h3 className="mb-2 fw-bold">{users || 0}</h3>
                <Card.Text className="mb-0">Người dùng</Card.Text>
              </div>
              <div className="position-absolute top-0 end-0 p-3 opacity-25 stats-icon">
                <FaUserPlus size={50} />
              </div>
            </Card.Body>
            <Card.Footer className="bg-gradient bg-transparent border-0 text-center">
              <Link
                to="/admin/users"
                className="text-white text-decoration-none fw-medium"
              >
                Xem thêm <FaArrowCircleRight className="ms-1" />
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        <Col lg={3} xs={6}>
          <Card className="h-100 bg-success text-white border-0 shadow-sm overflow-hidden">
            <Card.Body className="d-flex flex-column justify-content-between position-relative">
              <div className="text-center">
                <h3 className="mb-2 fw-bold">{orders || 0}</h3>
                <Card.Text className="mb-0">Đơn hàng mới</Card.Text>
              </div>
              <div className="position-absolute top-0 end-0 p-3 opacity-25 stats-icon">
                <FaShoppingBag size={50} />
              </div>
            </Card.Body>
            <Card.Footer className="bg-gradient bg-transparent border-0 text-center">
              <Link
                to="/admin/orders"
                className="text-white text-decoration-none fw-medium"
              >
                Xem thêm <FaArrowCircleRight className="ms-1" />
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Stats;
