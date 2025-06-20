import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { bookService } from "../../../../services/bookService";
import "./AllProducts.css";

const ITEMS_PER_PAGE = 12;

// Map các loại sản phẩm với tiêu đề và mô tả
const PRODUCT_TYPES = {
  featured: {
    title: "Sản phẩm nổi bật",
    description: "Những cuốn sách được yêu thích và đánh giá cao nhất",
    fetchFn: bookService.getFeaturedBooks,
    bgImage: "https://picsum.photos/seed/featured/1200/300",
  },
  discount: {
    title: "Giảm giá sốc",
    description: "Cơ hội săn sách hay với giá tốt nhất",
    fetchFn: bookService.getBestDiscountBooks,
    bgImage: "https://picsum.photos/seed/discount/1200/300",
  },
  new: {
    title: "Sách mới",
    description: "Những tựa sách mới nhất, hot nhất",
    fetchFn: bookService.getNewBooks,
    bgImage: "https://picsum.photos/seed/new/1200/300",
  },
  daily: {
    title: "Gợi ý hôm nay",
    description: "Những cuốn sách thú vị được chọn lọc mỗi ngày",
    fetchFn: bookService.getDailyBooks,
    bgImage: "https://picsum.photos/seed/daily/1200/300",
  },
};

function AllProducts() {
  const { type } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const observer = useRef();
  const productType = PRODUCT_TYPES[type];

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
        const response = await productType.fetchFn(page, ITEMS_PER_PAGE);
        const { books: newBooks, hasMore: moreItems } = response;

        setBooks((prevBooks) => [...prevBooks, ...newBooks]);
        setHasMore(moreItems);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productType && hasMore) {
      fetchBooks();
    }
  }, [page, productType]);

  if (!productType) {
    return (
      <div className="text-center py-5">Không tìm thấy danh mục sản phẩm</div>
    );
  }

  return (
    <div className="all-products">
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${productType.bgImage})` }}
      >
        <Container>
          <div className="hero-content">
            <h1>{productType.title}</h1>
            <p>{productType.description}</p>
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
            >
              <div className="product-image-wrapper">
                <img
                  src={book.image}
                  alt={book.name}
                  className="product-image"
                />
                {book.discount > 0 && (
                  <div className="discount-badge">-{book.discount}%</div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-title" title={book.name}>
                  {book.name}
                </h3>
                <p className="product-author">{book.author}</p>
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
