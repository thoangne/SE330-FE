// components/Header.jsx
import React from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  NavDropdown,
} from "react-bootstrap";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";

function Header() {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">
          <img
            src="/public/vite.svg" // Đặt logo vào thư mục public
            width="120"
            height="40"
            alt="Fahasa Clone"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="fahasa-navbar" />
        <Navbar.Collapse id="fahasa-navbar">
          <Form className="d-flex mx-auto w-50">
            <FormControl
              type="search"
              placeholder="Tìm kiếm sách, văn phòng phẩm..."
              className="me-2"
              aria-label="Search"
            />
            <Button
              variant="outline-danger"
              size="md"
              style={{ padding: "8px 32px" }}
            >
              <FaSearch />
            </Button>
          </Form>
          <Nav>
            <Nav.Link href="/account">
              <FaUser /> Tài khoản
            </Nav.Link>
            <Nav.Link href="/cart">
              <FaShoppingCart /> Giỏ hàng
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
