import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  NavDropdown,
  Badge,
} from "react-bootstrap";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useCartStore } from "../../stores/useCartStore";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  const cartCount = items?.length || 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Điều hướng đến trang DetailSearch với query parameter
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
      setKeyword("");
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm header-nav sticky-top">
      <Container>
        <Navbar.Brand href="/" className="logo-hover">
          <img
            src="/vite.svg"
            width="120"
            height="40"
            alt="Fahasa Clone"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="fahasa-navbar" />
        <Navbar.Collapse id="fahasa-navbar">
          <Form className="d-flex mx-auto w-50" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Tìm kiếm sách, văn phòng phẩm..."
              className="me-2 search-input"
              aria-label="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button
              type="submit"
              variant="outline-danger"
              size="md"
              className="search-button"
              style={{ padding: "8px 32px" }}
            >
              <FaSearch />
            </Button>
          </Form>
          <Nav>
            <NavDropdown
              title={
                <span className="nav-icon-link">
                  <FaUser />
                  {isAuthenticated ? (
                    <span className="ms-1">{user?.name?.split(" ").pop()}</span>
                  ) : (
                    " Tài khoản"
                  )}
                </span>
              }
              id="account-dropdown"
              align="end"
              className="account-dropdown"
            >
              {!isAuthenticated ? (
                <>
                  <NavDropdown.Item
                    onClick={() => navigate("/login")}
                    className="dropdown-item-hover"
                  >
                    Đăng nhập
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => navigate("/login")}
                    className="dropdown-item-hover"
                  >
                    Đăng ký
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <div className="dropdown-header">
                    <div className="d-flex align-items-center gap-2 px-3 py-2">
                      <img
                        src={user?.avatar || "https://picsum.photos/32/32"}
                        alt="avatar"
                        className="rounded-circle user-avatar"
                        width="32"
                        height="32"
                      />
                      <div className="user-info">
                        <strong>{user?.name}</strong>
                        <div className="text-muted small">{user?.email}</div>
                      </div>
                    </div>
                  </div>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => navigate("/profile")}
                    className="dropdown-item-hover"
                  >
                    Tài khoản của tôi
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={handleLogout}
                    className="dropdown-item-hover text-danger"
                  >
                    Đăng xuất
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>

            <Nav.Link
              onClick={() => navigate("/cart")}
              className="nav-icon-link position-relative"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <Badge pill bg="danger" className="cart-badge">
                  {cartCount}
                </Badge>
              )}
              <span className="ms-1">Giỏ hàng</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
