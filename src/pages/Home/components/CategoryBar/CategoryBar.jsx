import React from "react";
import { Nav } from "react-bootstrap";
import "./CategoryBar.css";
function CategoryBar() {
  return (
    <Nav variant="tabs" className="bg-white px-3 rounded-2 mx-3 mt-3">
      <Nav.Item>
        <Nav.Link href="#" className="category-link">
          Sách Mới
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#" className="category-link">
          Truyện Tranh
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#" className="category-link">
          Sách Học
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#" className="category-link">
          Văn Phòng Phẩm
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default CategoryBar;
