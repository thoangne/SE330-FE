import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CategoryBar.css";
import { userCategoryService } from "../../../../services/userCategoryService";

function CategoryBar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await userCategoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
        // Fallback to default categories if API fails
        setCategories([
          { id: 1, name: "Sách Mới" },
          { id: 2, name: "Truyện Tranh" },
          { id: 3, name: "Sách Học" },
          { id: 4, name: "Văn Phòng Phẩm" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  if (loading) {
    return (
      <Nav variant="tabs" className="bg-white px-3 rounded-2 mx-3 mt-3">
        <Nav.Item>
          <Nav.Link className="category-link">Đang tải...</Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }

  return (
    <Nav variant="tabs" className="bg-white px-3 rounded-2 mx-3 mt-3">
      {categories.map((category) => (
        <Nav.Item key={category.id}>
          <Nav.Link
            onClick={() => handleCategoryClick(category.id)}
            className="category-link"
            style={{ cursor: "pointer" }}
          >
            {category.name}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}

export default CategoryBar;
