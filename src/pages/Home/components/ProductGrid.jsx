import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import "./ProductGrid.css";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";

const sampleProducts = [
  {
    id: 1,
    title: "Sách 1",
    price: "50.000đ",
    image: "/src/assets/book/book1.png",
  },
  {
    id: 2,
    title: "Sách 2",
    price: "70.000đ",
    image: "/src/assets/book/book1.png",
  },
  {
    id: 3,
    title: "Sách 3",
    price: "80.000đ",
    image: "/src/assets/book/book1.png",
  },
  {
    id: 4,
    title: "Sách 4",
    price: "60.000đ",
    image: "/src/assets/book/book1.png",
  },
  {
    id: 5,
    title: "Sách 5",
    price: "50.000đ",
    image: "/src/assets/book/book1.png",
  },
  {
    id: 6,
    title: "Sách 6",
    price: "70.000đ",
    image: "/src/assets/book/book1.png",
  },
  {
    id: 7,
    title: "Sách 7",
    price: "80.000đ",
    image: "/src/assets/book/book1.png",
  },
  {
    id: 8,
    title: "Sách 8",
    price: "60.000đ",
    image: "/src/assets/book/book1.png",
  },
  {
    id: 9,
    title: "Sách 9",
    price: "80.000đ",
    image: "/src/assets/book/book1.png",
  },
  {
    id: 10,
    title: "Sách 10",
    price: "60.000đ",
    image: "/src/assets/book/book1.png",
  },
];

function ProductGrid() {
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
        {sampleProducts.map((product) => (
          <div key={product.id} className="product-card">
            <Card className="border-0 custom-card">
              <Card.Img variant="top" src={product.image} />
              <Card.Body>
                <Card.Title style={{ fontSize: "16px" }}>
                  {product.title}
                </Card.Title>
                <Card.Text>{product.price}</Card.Text>
                <Button className="btn-buy">Mua ngay</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
