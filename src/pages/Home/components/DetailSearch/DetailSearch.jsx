import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Spinner,
} from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { userProductService } from "../../../../services/userProductService";
import { userCategoryService } from "../../../../services/userCategoryService";
import { userPublisherService } from "../../../../services/userPublisherService";
import "./DetailSearch.css";

const ITEMS_PER_PAGE = 48;

function DetailSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false); // Loading for search/filter operations
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    publisherId: "",
    sort: "newest",
  });
  const [tempFilters, setTempFilters] = useState({
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    publisherId: "",
    sort: "newest",
  });
  const [priceInputs, setPriceInputs] = useState({
    minPrice: "",
    maxPrice: "",
  });

  // Get initial search query from URL
  const searchQuery = searchParams.get("name") || "";

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all products, categories, and publishers
        const [allProductsData, categoriesData, publishersData] =
          await Promise.all([
            userProductService.getAllProducts(),
            userCategoryService.getAllCategories(),
            userPublisherService.getAllPublishers(),
          ]);

        setAllProducts(allProductsData || []);
        setCategories(categoriesData || []);
        setPublishers(publishersData || []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter and search products - only called manually via search button
  const filterProducts = useCallback(async () => {
    try {
      setSearchLoading(true);
      let filteredProducts = [];

      // If there's a search query, use search API
      if (searchQuery.trim()) {
        try {
          filteredProducts = await userProductService.searchProducts(
            searchQuery
          );
        } catch (error) {
          console.error("Search API error:", error);
          // Fallback to local filtering if search API fails
          filteredProducts = allProducts.filter(
            (product) =>
              product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
        }
      } else {
        // No search query, use all products
        filteredProducts = [...allProducts];
      }

      // Apply additional filters
      filteredProducts = filteredProducts.filter((product) => {
        const matchesCategory =
          !filters.categoryId ||
          product.categoryId === Number(filters.categoryId);
        const matchesPublisher =
          !filters.publisherId ||
          product.publisherId === Number(filters.publisherId);

        // Calculate discounted price for price filtering
        const discountedPrice =
          product.discount > 0
            ? product.price * (1 - product.discount / 100)
            : product.price;

        const matchesMinPrice =
          !filters.minPrice || discountedPrice >= Number(filters.minPrice);
        const matchesMaxPrice =
          !filters.maxPrice || discountedPrice <= Number(filters.maxPrice);

        return (
          matchesCategory &&
          matchesPublisher &&
          matchesMinPrice &&
          matchesMaxPrice
        );
      });

      // Apply sorting
      const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (filters.sort) {
          case "priceAsc": {
            const priceA =
              a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
            const priceB =
              b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
            return priceA - priceB;
          }
          case "priceDesc": {
            const priceDescA =
              a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
            const priceDescB =
              b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
            return priceDescB - priceDescA;
          }
          case "discount":
            return (b.discount || 0) - (a.discount || 0);
          default: // newest
            return b.id - a.id;
        }
      });

      setProducts(sortedProducts);
      setCurrentPage(1); // Reset to first page when filters change
    } catch (error) {
      console.error("Error filtering products:", error);
      setProducts([]);
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery, filters, allProducts]);

  // Initial load only - just fetch data and show all products
  useEffect(() => {
    const performInitialLoad = async () => {
      if (allProducts.length > 0) {
        // After initial data is loaded, perform first search/filter
        await filterProducts();
      }
    };

    performInitialLoad();
  }, [allProducts, filterProducts]);

  // Trigger search when filters change (from handleSearch)
  useEffect(() => {
    if (allProducts.length > 0) {
      filterProducts();
    }
  }, [
    filters.categoryId,
    filters.publisherId,
    filters.minPrice,
    filters.maxPrice,
    searchQuery,
    allProducts.length,
    filterProducts,
  ]);

  // Handle immediate sort change (no API call needed)
  const handleSortChange = (value) => {
    setFilters((prev) => ({ ...prev, sort: value }));
    setCurrentPage(1);

    // Re-sort current products immediately
    const sortedProducts = [...products].sort((a, b) => {
      switch (value) {
        case "priceAsc": {
          const priceA =
            a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const priceB =
            b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        }
        case "priceDesc": {
          const priceDescA =
            a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const priceDescB =
            b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return priceDescB - priceDescA;
        }
        case "discount":
          return (b.discount || 0) - (a.discount || 0);
        default: // newest
          return b.id - a.id;
      }
    });
    setProducts(sortedProducts);
  };

  // Handle filter changes (stored in tempFilters, not applied immediately)
  const handleFilterChange = (name, value) => {
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle price input changes (without immediate filtering)
  const handlePriceInputChange = (name, value) => {
    setPriceInputs((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search button click - apply all filters and search
  const handleSearch = () => {
    // Commit temp filters and price inputs to active filters
    setFilters((prev) => ({
      ...prev,
      categoryId: tempFilters.categoryId,
      publisherId: tempFilters.publisherId,
      minPrice: priceInputs.minPrice,
      maxPrice: priceInputs.maxPrice,
    }));

    // The useEffect will trigger filterProducts when filters change
  };

  // Handle Enter key press in any input
  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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

  const handleProductClick = (product) => {
    // Prefer slug over ID for better URLs
    const identifier = product.slug || product.id;
    navigate(`/product/${identifier}`);
  };

  return (
    <Container fluid className="my-4">
      {loading && (
        <div className="text-center p-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

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
                    onChange={(e) => handleSortChange(e.target.value)}
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
                    value={tempFilters.categoryId}
                    onChange={(e) =>
                      handleFilterChange("categoryId", e.target.value)
                    }
                    onKeyPress={handleInputKeyPress}
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
                    value={tempFilters.publisherId}
                    onChange={(e) =>
                      handleFilterChange("publisherId", e.target.value)
                    }
                    onKeyPress={handleInputKeyPress}
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
                  <Form.Label>Khoảng giá (theo giá đã giảm)</Form.Label>
                  <div className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="number"
                      placeholder="Từ"
                      value={priceInputs.minPrice}
                      onChange={(e) =>
                        handlePriceInputChange("minPrice", e.target.value)
                      }
                      onKeyPress={handleInputKeyPress}
                    />
                    <Form.Control
                      type="number"
                      placeholder="Đến"
                      value={priceInputs.maxPrice}
                      onChange={(e) =>
                        handlePriceInputChange("maxPrice", e.target.value)
                      }
                      onKeyPress={handleInputKeyPress}
                    />
                  </div>

                  {/* Search Button for all filters */}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSearch}
                    disabled={searchLoading}
                    className="w-100 mb-2"
                  >
                    {searchLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Đang tìm...
                      </>
                    ) : (
                      "🔍 Tìm kiếm"
                    )}
                  </Button>

                  {(filters.minPrice || filters.maxPrice) && (
                    <small className="text-muted d-block mt-1">
                      Đang lọc:
                      {filters.minPrice &&
                        `Từ ${Number(filters.minPrice).toLocaleString()}đ`}
                      {filters.minPrice && filters.maxPrice && " - "}
                      {filters.maxPrice &&
                        `Đến ${Number(filters.maxPrice).toLocaleString()}đ`}
                    </small>
                  )}

                  {/* Show active filters */}
                  {(filters.categoryId || filters.publisherId) && (
                    <div className="mt-2">
                      <small className="text-primary fw-bold d-block">
                        Bộ lọc đang áp dụng:
                      </small>
                      {filters.categoryId && (
                        <small className="text-muted d-block">
                          • Danh mục:
                          {
                            categories.find(
                              (c) => c.id.toString() === filters.categoryId
                            )?.name
                          }
                        </small>
                      )}
                      {filters.publisherId && (
                        <small className="text-muted d-block">
                          • NXB:
                          {
                            publishers.find(
                              (p) => p.id.toString() === filters.publisherId
                            )?.name
                          }
                        </small>
                      )}
                    </div>
                  )}
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
                    : "Tất cả sản phẩm"}
                  <span className="text-muted ms-2">
                    ({products.length} sản phẩm)
                  </span>
                  {searchLoading && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="ms-2"
                    />
                  )}
                </h5>
              </div>

              {searchLoading && (
                <div className="text-center p-4">
                  <Spinner animation="border" role="status" className="me-2" />
                  <span>Đang tìm kiếm sản phẩm...</span>
                </div>
              )}

              {products.length === 0 && !loading && !searchLoading && (
                <div className="text-center p-5">
                  <p className="text-muted">
                    {searchQuery
                      ? `Không tìm thấy sản phẩm nào cho "${searchQuery}"`
                      : "Không có sản phẩm nào"}
                  </p>
                </div>
              )}

              {!searchLoading && (
                <div className="product-grid">
                  {currentItems.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => handleProductClick(product)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProductClick(product);
                        }
                      }}
                    >
                      <div className="product-image-wrapper">
                        <img
                          src={product.coverImage}
                          alt={product.title}
                          className="product-image"
                        />
                        {product.discount > 0 && (
                          <span className="discount-badge">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                      <h3 className="product-title" title={product.title}>
                        {product.title}
                      </h3>
                      <p className="product-author">
                        {product.authors && product.authors.length > 0
                          ? product.authors
                              .map((author) => author.name)
                              .join(", ")
                          : "Không rõ tác giả"}
                      </p>
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
              )}

              {!searchLoading && renderPagination()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DetailSearch;
