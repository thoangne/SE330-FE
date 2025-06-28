import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { userProductService } from "../../../../services/userProductService";
import { userCategoryService } from "../../../../services/userCategoryService";
import "./AllProducts.css";

const ITEMS_PER_PAGE = 12;

// Map các loại sản phẩm với tiêu đề và mô tả
const PRODUCT_TYPES = {
  featured: {
    title: "Sản phẩm nổi bật",
    description: "Những cuốn sách được yêu thích và đánh giá cao nhất",
    fetchFn: userProductService.getFeaturedProducts,
    bgImage: "https://picsum.photos/seed/featured/1200/300",
  },
  discount: {
    title: "Giảm giá sốc",
    description: "Cơ hội săn sách hay với giá tốt nhất",
    fetchFn: userProductService.getBestDiscountProducts,
    bgImage: "https://picsum.photos/seed/discount/1200/300",
  },
  new: {
    title: "Sách mới",
    description: "Những tựa sách mới nhất, hot nhất",
    fetchFn: userProductService.getNewProducts,
    bgImage: "https://picsum.photos/seed/new/1200/300",
  },
  daily: {
    title: "Gợi ý hôm nay",
    description: "Những cuốn sách thú vị được chọn lọc mỗi ngày",
    fetchFn: userProductService.getDailyProducts,
    bgImage: "https://picsum.photos/seed/daily/1200/300",
  },
};

function AllProducts() {
  const { type, categoryId } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const observer = useRef();

  // Determine if this is a category page or product type page
  const isCategory = !!categoryId;
  const productType = isCategory ? null : PRODUCT_TYPES[type];

  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        let newBooks = [];

        if (isCategory) {
          // Fetch products by category
          const allProducts = await userProductService.getProductsByCategory(
            categoryId
          );
          newBooks = allProducts;
          setHasMore(false); // Category API returns all products at once

          // Fetch category info
          try {
            const catInfo = await userCategoryService.getCategoryById(
              categoryId
            );
            setCategoryInfo(catInfo);
          } catch (err) {
            console.error("Error fetching category info:", err);
          }
        } else if (productType) {
          // Fetch products by type (featured, discount, etc.)
          newBooks = await productType.fetchFn(ITEMS_PER_PAGE * page);
          setHasMore(newBooks.length === ITEMS_PER_PAGE * page);
        }

        if (page === 1) {
          setBooks(newBooks);
        } else {
          setBooks((prevBooks) => [...prevBooks, ...newBooks]);
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    if ((isCategory || productType) && hasMore) {
      fetchBooks();
    }
  }, [page, productType, isCategory, categoryId, hasMore]);

  // Reset when route changes
  useEffect(() => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [type, categoryId]);

  if (!productType && !isCategory) {
    return (
      <div className="text-center py-5">Không tìm thấy danh mục sản phẩm</div>
    );
  }

  const pageTitle = isCategory
    ? categoryInfo?.name || "Danh mục sản phẩm"
    : productType.title;

  const pageDescription = isCategory
    ? categoryInfo?.description || "Sản phẩm theo danh mục"
    : productType.description;

  const bgImage = isCategory
    ? "https://picsum.photos/seed/category/1200/300"
    : productType.bgImage;

  return (
    <div className="all-products">
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Container>
          <div className="hero-content">
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>
        </Container>
      </div>

      <Container className="products-container">
        <div className="product-grid">
          {books.map((book, index) => (
            <div
              ref={index === books.length - 1 ? lastBookElementRef : null}
              key={`${book.id}-${index}`}
              className="product-card"
              onClick={() => navigate(`/product/${book.slug || book.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="product-image-wrapper">
                <img
                  src={book.coverImage || book.image}
                  alt={book.title || book.name}
                  className="product-image"
                />
                {book.discount > 0 && (
                  <div className="discount-badge">-{book.discount}%</div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-title" title={book.title || book.name}>
                  {book.title || book.name}
                </h3>
                <p className="product-author">
                  {book.authors && book.authors.length > 0
                    ? book.authors.map((author) => author.name).join(", ")
                    : book.author || "Không rõ tác giả"}
                </p>
                <div className="price-container">
                  <div className="product-price">
                    {(
                      book.price *
                      (1 - (book.discount || 0) / 100)
                    ).toLocaleString("vi-VN")}
                    đ
                  </div>
                  {book.discount > 0 && (
                    <div className="original-price">
                      {book.price.toLocaleString("vi-VN")}đ
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {error && <div className="text-center py-4 text-danger">{error}</div>}

        {!hasMore && books.length > 0 && (
          <div className="text-center py-4">Đã hiển thị tất cả sản phẩm</div>
        )}
      </Container>
    </div>
  );
}

export default AllProducts;
