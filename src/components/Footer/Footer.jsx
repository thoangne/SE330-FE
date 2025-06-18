// components/Footer.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import "./Footer.css";


function Footer() {
  return (
    <footer className="bg-light text-dark py-4 border-top">
      <Container>
        <Row>
          <Col
            md={2}
            className="d-flex justify-content-center align-items-center"
          >
            <img
              src="/vite.svg" 
              width="120"
              alt="Fahasa Clone"
            />
          </Col>
          <Col md={2}>
            <h6>Về chúng tôi</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="footer-link">Giới thiệu Fahasa</a>
              </li>
              <li>
                <a href="/recruitment" className="footer-link">Tuyển dụng</a>
              </li>
              <li>
                <a href="/privacy" className="footer-link">Chính sách bảo mật</a>
              </li>
            </ul>
          </Col>
          <Col md={2}>
            <h6>Hỗ trợ khách hàng</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/faq" className="footer-link">Trung tâm trợ giúp</a>
              </li>
              <li>
                <a href="/returns" className="footer-link">Chính sách đổi trả</a>
              </li>
              <li>
                <a href="/shipping" className="footer-link">Giao hàng - Thanh toán</a>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <h6>Liên hệ</h6>
            <p>Hotline: 1900 5454 52</p>
            <p>Email: support@fahasa.com</p>
          </Col>
          <Col md={3}>
            <h6>Theo dõi chúng tôi</h6>
            <a href="#" className="footer-link">
              <FaFacebook style={{ margin: "0px 8px" }} />
              Facebook
            </a>
            <a href="#" className="footer-link">
              <FaInstagram style={{ margin: "0px 8px" }} />
              Instagram
            </a>
          </Col>
        </Row>
        <hr />
        <p className="text-center mb-0">
          &copy; 2025 Fahasa Clone. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
