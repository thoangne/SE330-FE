// ProductDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { Button, Row, Col, Image, Container, Form } from "react-bootstrap";
import products from "../products";
import { useCartStore } from "../../../../stores/useCartStore";
function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  const [qty, setQty] = React.useState(1);

  const { addToCart } = useCartStore();

  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <Container className="my-4" style={{ background: "#fff", borderRadius: "8px",padding:"16px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
      <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={7}>
          <h3>{product.name}</h3>
          <p className="text-danger fs-4">{product.price.toLocaleString()}₫</p>
          <p>{product.description}</p>
          <Form.Select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="mb-3" style={{ width: "100px" }}>
            {[...Array(10).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>{x + 1}</option>
            ))}
          </Form.Select>
          <Button variant="danger" onClick={() => addToCart(product, qty)}>
            Thêm vào giỏ hàng
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetail;
