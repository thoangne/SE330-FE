// ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Tabs, Tab, Form } from "react-bootstrap";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import {
  getProductById,
  getProductReviews,
  addProductReview,
} from "../../../../services/productService";
import { useCartStore } from "../../../../stores/useCartStore";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add useCartStore hook
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);

        const reviewsData = await getProductReviews(id);
        setReviews(reviewsData);

        setError(null);
      } catch (error) {
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, product?.stock || 1));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReview = await addProductReview(id, {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        userId: 1, // TODO: Get from auth context
        userName: "Khách hàng", // TODO: Get from auth context
      });

      setReviews((prevReviews) => [newReview, ...prevReviews]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalf key={i} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-warning" />);
      }
    }

    return stars;
  };

  if (loading) return <div className="text-center p-5">Đang tải...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;
  if (!product)
    return <div className="text-center p-5">Không tìm thấy sản phẩm</div>;

  return (
    <Container className="py-4">
      <div className="product-detail-container">
        {/* Product Main Info */}
        <Row className="mb-4">
          <Col md={4}>
            <div className="product-image-container mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid"
              />
              {product.discount > 0 && (
                <div className="discount-badge">-{product.discount}%</div>
              )}
            </div>
          </Col>

          <Col md={8}>
            <h1 className="product-title mb-3">{product.name}</h1>
            <div className="d-flex align-items-center mb-3">
              <div className="me-3">
                {renderStars(product.rating.average)}
                <span className="ms-2">({product.rating.count} đánh giá)</span>
              </div>
              <div className="text-muted">|</div>
              <div className="ms-3">
                Đã bán: {Math.floor(Math.random() * 1000)}
              </div>
            </div>

            <div className="price-section mb-4">
              <div className="current-price">
                {(product.price * (1 - product.discount / 100)).toLocaleString(
                  "vi-VN"
                )}
                đ
              </div>
              {product.discount > 0 && (
                <div className="original-price">
                  {product.price.toLocaleString("vi-VN")}đ
                </div>
              )}
            </div>

            <div className="mb-4">
              <h5>Tác giả: {product.author}</h5>
              <p>{product.description}</p>
            </div>

            <div className="quantity-section mb-4">
              <div className="d-flex align-items-center">
                <label className="me-3">Số lượng:</label>
                <div className="quantity-control">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="ms-3 text-muted">
                  {product.stock} sản phẩm có sẵn
                </span>
              </div>
            </div>

            <div className="action-buttons">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
          </Col>
        </Row>

        {/* Product Details Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 product-tabs"
        >
          <Tab eventKey="description" title="Mô tả sản phẩm">
            <div className="p-4">
              <div
                dangerouslySetInnerHTML={{
                  __html: product.longDescription.replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          </Tab>

          <Tab eventKey="reviews" title={`Đánh giá (${reviews.length})`}>
            <div className="p-4">
              {/* Review Statistics */}
              <div className="review-stats mb-4">
                <h4>Đánh giá trung bình</h4>
                <div className="d-flex align-items-center">
                  <div className="average-rating me-4">
                    <div className="rating-number">
                      {product.rating.average}
                    </div>
                    <div>{renderStars(product.rating.average)}</div>
                    <div>{product.rating.count} đánh giá</div>
                  </div>
                  <div className="rating-bars">
                    {Object.entries(product.rating.detail)
                      .reverse()
                      .map(([stars, count]) => (
                        <div key={stars} className="rating-bar-row">
                          <span>{stars} sao</span>
                          <div className="rating-bar">
                            <div
                              className="rating-bar-fill"
                              style={{
                                width: `${
                                  (count / product.rating.count) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span>{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Add Review Form */}
              <Form onSubmit={handleReviewSubmit} className="mb-4">
                <h4>Thêm đánh giá của bạn</h4>
                <Form.Group className="mb-3">
                  <Form.Label>Đánh giá</Form.Label>
                  <div className="star-rating">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <Form.Check
                        key={star}
                        inline
                        type="radio"
                        name="rating"
                        id={`rating-${star}`}
                        label={renderStars(star)}
                        checked={reviewForm.rating === star}
                        onChange={() =>
                          setReviewForm((prev) => ({ ...prev, rating: star }))
                        }
                      />
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nhận xét của bạn</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  />
                </Form.Group>
                <Button type="submit" variant="primary">
                  Gửi đánh giá
                </Button>
              </Form>

              {/* Reviews List */}
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <h5>{review.userName}</h5>
                      <div>{renderStars(review.rating)}</div>
                      <small className="text-muted">{review.date}</small>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </Tab>
        </Tabs>

        {/* Related Products */}
        {product.relatedProducts.length > 0 && (
          <div className="related-products">
            <h3 className="mb-4">Sản phẩm liên quan</h3>
            <Row>
              {product.relatedProducts.map((relatedProduct) => (
                <Col key={relatedProduct.id} md={3} sm={6} className="mb-4">
                  <Link
                    to={`/product/${relatedProduct.id}`}
                    className="related-product-card"
                  >
                    <div className="product-image-wrapper">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="product-image"
                      />
                      {relatedProduct.discount > 0 && (
                        <div className="discount-badge">
                          -{relatedProduct.discount}%
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <h5 className="product-title" title={relatedProduct.name}>
                        {relatedProduct.name}
                      </h5>
                      <div className="product-price">
                        {(
                          relatedProduct.price *
                          (1 - relatedProduct.discount / 100)
                        ).toLocaleString("vi-VN")}
                        đ
                      </div>
                      {relatedProduct.discount > 0 && (
                        <div className="original-price">
                          {relatedProduct.price.toLocaleString("vi-VN")}đ
                        </div>
                      )}
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ProductDetail;
