import React, { useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { FaBars, FaExpand, FaCompress, FaMoon, FaSun } from "react-icons/fa";

const AdminNavbar = ({ onToggleSidebar }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    const elem = document.documentElement;
    if (!isFullscreen) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      setIsFullscreen(false);
    }
  };

  const darkMode = false;

  return (
    <Navbar
      expand="lg"
      className="px-3 border-bottom"
      style={{ height: "56px" }}
    >
      <Container fluid>
        <Nav className="me-auto">
          <Button
            variant="outline-secondary"
            onClick={onToggleSidebar}
            className="me-2"
          >
            <FaBars />
          </Button>
        </Nav>

        <Nav className="ms-auto align-items-center">
          <Button
            variant="outline-secondary"
            onClick={handleFullscreen}
            className="me-2"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </Button>
          <Button variant="outline-secondary">
            {darkMode ? <FaSun /> : <FaMoon />}
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
