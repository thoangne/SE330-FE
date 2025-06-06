// pages/CartPage.jsx
import React from "react";
import { Container, Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCartStore } from "../../../../stores/useCartStore";
function CartPage() {
  const { cartItems, updateQty, removeFromCart } = useCartStore();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

        console.log(cartItems);
    return (
    <Container className="my-4">
      <h3>Giỏ hàng</h3>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <Table responsive>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString()}₫</td>
                  <td>
                    <Form.Select
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, Number(e.target.value))}
                      style={{ width: "80px" }}
                    >
                      {[...Array(10).keys()].map((x) => (
                        <option key={x + 1}>{x + 1}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>{(item.price * item.qty).toLocaleString()}₫</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h5 className="text-end">Tổng cộng: {total.toLocaleString()}₫</h5>
          <div className="text-end">
            <Link to="/checkout">
              <Button variant="success">Thanh toán</Button>
            </Link>
          </div>
        </>
      )}
    </Container>
  );
}

export default CartPage;
