import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import products from "../products";
import "../ProductGrid/ProductGrid.css"; 

function SearchResult() {
  const { keyword } = useParams();
  const navigate = useNavigate();

  const results = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div
      className="my-4 mx-4"
      style={{ backgroundColor: "#FFFFFF", padding: 16, borderRadius: 8 }}
    >
      <h5 className="my-1">
        Kết quả tìm kiếm cho: "<span style={{ color: "#c92127" }}>{keyword}</span>"
      </h5>
      <hr style={{ borderTop: "1px solid #c92127", margin: "1rem 0" }} />

      {results.length > 0 ? (
        <div className="product-grid">
          {results.map((product) => (
            <div key={product.id} className="product-card">
              <Card className="border-0 custom-card">
                <Card.Img variant="top" src={product.image} />
                <Card.Body>
                  <Card.Title style={{ fontSize: "16px" }}>
                    {product.name}
                  </Card.Title>
                  <Card.Text>{product.salePrice.toLocaleString()}đ</Card.Text>
                  <Button
                    className="btn-buy"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    Mua ngay
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p>Không tìm thấy sản phẩm phù hợp.</p>
      )}
    </div>
  );
}

export default SearchResult;
