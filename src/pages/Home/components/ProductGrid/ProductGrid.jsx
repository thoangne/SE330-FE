import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import "./ProductGrid.css";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import products from "../products";
import { useNavigate } from "react-router-dom";
function ProductGrid() {
  const navigate = useNavigate();
  return (
    <div
      className="my-4"
      style={{ backgroundColor: "#FFFFFF", padding: 16, borderRadius: 8 }}
    >
      <h5 className="my-1">
        <FaArrowTrendUp className="mx-2" />
        Sản phẩm nổi bật
      </h5>
      <hr style={{ borderTop: "1px solid #c92127", margin: "1rem 0" }} />
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Card className="border-0 custom-card">
              <Card.Img variant="top" src={product.image} />
              <Card.Body>
                <Card.Title style={{ fontSize: "16px" }}>
                  {product.name}
                </Card.Title>
                <Card.Text>{product.salePrice.toLocaleString()}đ</Card.Text>
                <Button className="btn-buy" onClick={() => navigate(`/product/${product.id}`)}>Mua ngay</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
