// components/Header.jsx
import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
const [keyword, setKeyword] = useState("");
  // Tạm thời giả lập user login (null là chưa đăng nhập)
  const [user, setUser] = useState(null); // ví dụ: { name: "Nguyen Van A" }

  const handleLogout = () => {
    // Xử lý đăng xuất
    setUser(null);
    navigate("/");
  };
const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword("");
    }
  };
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">
          <img
            src="/vite.svg"
            width="120"
            height="40"
            alt="Fahasa Clone"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="fahasa-navbar" />
        <Navbar.Collapse id="fahasa-navbar">
          <Form className="d-flex mx-auto w-50" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Tìm kiếm sách, văn phòng phẩm..."
              className="me-2"
              aria-label="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button
              type="submit"
              variant="outline-danger"
              size="md"
              style={{ padding: "8px 32px" }}
            >
              <FaSearch />
            </Button>
          </Form>
          <Nav>
            <NavDropdown
              title={
                <span>
                  <FaUser /> Tài khoản
                </span>
              }
              id="account-dropdown"
              align="end"
              className=""
            >
              {!user ? (
                <>
                  <NavDropdown.Item onClick={() => navigate("/login")}>
                    Đăng nhập
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/login")}>
                    Đăng ký
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item onClick={() => navigate("/profile")}>
                    {user.name}
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/orders")}>
                    Đơn hàng của tôi
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Đăng xuất
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>

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
