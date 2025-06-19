import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import "./ProductGrid.css";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";

function ProductGrid({ title, icon: Icon, fetchBooks, type, className = "" }) {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const { books: newBooks } = await fetchBooks(1, 10); // Load first 10 books
        setBooks(newBooks);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu sách. Vui lòng thử lại sau.");
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [fetchBooks]);

  if (loading) {
    return (
      <div className={`featured-products ${className}`}>
        <div className="section-header">
          <h5>
            {Icon && <Icon className="me-2" />}
            {title}
          </h5>
        </div>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`featured-products ${className}`}>
        <div className="section-header">
          <h5>
            {Icon && <Icon className="me-2" />}
            {title}
          </h5>
        </div>
        <div className="text-center py-5 text-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className={`featured-products ${className}`}>
      <div className="section-header">
        <h5>
          {Icon && <Icon className="me-2" />}
          {title}
        </h5>
      </div>

      <div className="product-section">
        <div className="product-grid">
          {books.map((book) => (
            <div
              key={book.id}
              className="product-card"
              onClick={() => navigate(`/product/${book.id}`)}
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

        {type && (
          <div className="view-all-wrapper">
            <Link to={`/products/${type}`} className="view-all-button">
              Xem tất cả {title.toLowerCase()}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

ProductGrid.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  fetchBooks: PropTypes.func.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
};

export default ProductGrid;
