import React from "react";
import { Card, Button } from "react-bootstrap";
import "./ProductGrid.css";
import { FaArrowTrendUp } from "react-icons/fa6";
import products from "../products";
import { useNavigate } from "react-router-dom";

function ProductGrid() {
  const navigate = useNavigate();

  return (
    <div className="featured-products">
      <div className="section-header">
        <h5>
          <FaArrowTrendUp className="me-2" />
          Sản phẩm nổi bật
        </h5>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              {product.discount > 0 && (
                <div className="discount-badge">-{product.discount}%</div>
              )}
            </div>
            <div className="product-info">
              <h3 className="product-title" title={product.name}>
                {product.name}
              </h3>
              <div className="price-container">
                <div className="product-price">
                  {(
                    product.price *
                    (1 - (product.discount || 0) / 100)
                  ).toLocaleString("vi-VN")}
                  đ
                </div>
                {product.discount > 0 && (
                  <div className="original-price">
                    {product.price.toLocaleString("vi-VN")}đ
                  </div>
                )}
              </div>
              <Button
                className="btn-buy"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                Mua ngay
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
