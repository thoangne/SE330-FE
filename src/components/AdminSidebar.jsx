import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminSidebar = ({ isCollapsed }) => {
  return (
    <div
      className="d-flex flex-column bg-light"
      style={{
        width: isCollapsed ? "60px" : "250px", // Khớp chính xác với Col
        minHeight: "100vh",
        transition: "width 0.3s",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        className="text-center mb-4 bg-danger text-light py-3 fw-bold"
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {isCollapsed ? "F" : "Fahasa"}
      </div>

      {/* Avatar + Name */}
      <div className="text-center mb-4">
        <img
          src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
          alt="User Avatar"
          className="rounded-circle mb-2"
          style={{ width: isCollapsed ? "30px" : "25%" }}
        />
        {!isCollapsed && <h6>Admin Name</h6>}
      </div>

      {/* Navigation */}
      <Nav
        className={` border-top pt-3 flex-column px-3 ${
          isCollapsed ? "align-content-center" : ""
        }`}
        style={{ flexGrow: 1 }}
      >
        <Nav.Link as={Link} to="/admin" title="Dashboard">
          📊 {isCollapsed ? "" : "Dashboard"}
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/books" title="Quản lý sách">
          📚 {isCollapsed ? "" : "Quản lý sách"}
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/authors" title="Quản lý tác giả">
          ✍️ {isCollapsed ? "" : "Quản lý tác giả"}
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/users" title="Quản lý người dùng">
          👤 {isCollapsed ? "" : "Quản lý người dùng"}
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/orders" title="Quản lý đơn hàng">
          🛒 {isCollapsed ? "" : "Quản lý đơn hàng"}
        </Nav.Link>
        {/* Spacer to push logout down */}
        <div className="flex-grow-1"></div>
        {/* Logout */}
        <Nav.Link
          as={Link}
          to="/logout"
          className="text-danger mt-auto border-top pt-3"
          title="Đăng xuất"
        >
          🚪 {isCollapsed ? "" : "Đăng xuất"}
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default AdminSidebar;
