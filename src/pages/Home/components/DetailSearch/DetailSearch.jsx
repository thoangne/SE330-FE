import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { allBooks as mockBooks } from "../../../../services/mockBooks";
import { getAllCategories } from "../../../../services/categoryService";
import { getAllPublishers } from "../../../../services/publisherService";
import "./DetailSearch.css";

const ITEMS_PER_PAGE = 48;

function DetailSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    publisherId: "",
    sort: "newest",
  });

  // Get initial search query from URL
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    // Simulate API call with filters
    const filteredProducts = mockBooks.filter((book) => {
      const matchesSearch =
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !filters.categoryId || book.categoryId === Number(filters.categoryId);
      const matchesPublisher =
        !filters.publisherId ||
        book.publisherId === Number(filters.publisherId);
      const matchesMinPrice =
        !filters.minPrice || book.price >= Number(filters.minPrice);
      const matchesMaxPrice =
        !filters.maxPrice || book.price <= Number(filters.maxPrice);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPublisher &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    // Apply sorting
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (filters.sort) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "discount":
          return (b.discount || 0) - (a.discount || 0);
        default: // newest
          return new Date(b.publishDate) - new Date(a.publishDate);
      }
    });

    setProducts(sortedProducts);
  }, [searchQuery, filters]);

  // Fetch categories and publishers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, publishersData] = await Promise.all([
          getAllCategories(),
          getAllPublishers(),
        ]);
        setCategories(categoriesData);
        setPublishers(publishersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination-container">
        <button
          className="page-button"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          «
        </button>
        <button
          className="page-button"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`page-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="page-button"
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
        >
          ›
        </button>
        <button
          className="page-button"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    );
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container fluid className="my-4">
      <Row>
        {/* Filters Sidebar */}
        <Col md={3} className="filter-sidebar">
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Bộ lọc tìm kiếm</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Sắp xếp theo</Form.Label>
                  <Form.Select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="priceAsc">Giá tăng dần</option>
                    <option value="priceDesc">Giá giảm dần</option>
                    <option value="discount">Khuyến mãi nhiều nhất</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select
                    value={filters.categoryId}
                    onChange={(e) =>
                      handleFilterChange("categoryId", e.target.value)
                    }
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nhà xuất bản</Form.Label>
                  <Form.Select
                    value={filters.publisherId}
                    onChange={(e) =>
                      handleFilterChange("publisherId", e.target.value)
                    }
                  >
                    <option value="">Tất cả NXB</option>
                    {publishers.map((publisher) => (
                      <option key={publisher.id} value={publisher.id}>
                        {publisher.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Khoảng giá</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="number"
                      placeholder="Từ"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                    />
                    <Form.Control
                      type="number"
                      placeholder="Đến"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                    />
                  </div>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Search Results */}
        <Col md={9}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">
                  {searchQuery
                    ? `Kết quả tìm kiếm cho "${searchQuery}"`
                    : "Tất cả sản phẩm"}{" "}
                  <span className="text-muted ms-2">
                    ({products.length} sản phẩm)
                  </span>
                </h5>
              </div>

              <div className="product-grid">
                {currentItems.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => handleProductClick(product.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleProductClick(product.id);
                      }
                    }}
                  >
                    <div className="product-image-wrapper">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />
                      {product.discount > 0 && (
                        <span className="discount-badge">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <h3 className="product-title" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="product-author">{product.author}</p>
                    <div className="price-container">
                      <p className="product-price">
                        {(
                          product.price *
                          (1 - product.discount / 100)
                        ).toLocaleString("vi-VN")}
                        đ
                      </p>
                      {product.discount > 0 && (
                        <p className="original-price">
                          {product.price.toLocaleString("vi-VN")}đ
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {renderPagination()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DetailSearch;
