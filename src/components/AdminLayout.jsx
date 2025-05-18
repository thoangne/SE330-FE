import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col
          xs={12}
          md={isSidebarCollapsed ? 1 : 3}
          lg={isSidebarCollapsed ? 1 : 2}
          className="bg-light min-vh-100 p-0 border-end"
          style={{
            position: "sticky",
            top: 0,
            maxWidth: isSidebarCollapsed ? "60px" : "250px", // Khớp với width của sidebar
          }}
        >
          <AdminSidebar isCollapsed={isSidebarCollapsed} />
        </Col>

        {/* Main content */}
        <Col
          xs={12}
          md={isSidebarCollapsed ? 11 : 9}
          lg={isSidebarCollapsed ? 11 : 10}
          className="p-0" // Loại bỏ padding mặc định
        >
          <AdminNavbar onToggleSidebar={toggleSidebar} />
          <div className="p-3">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
