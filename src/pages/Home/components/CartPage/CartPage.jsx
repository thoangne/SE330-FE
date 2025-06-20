// pages/CartPage.jsx
import React, { useState } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCartStore } from "../../../../stores/useCartStore";

function CartPage() {
  const { cartItems, updateQty, removeFromCart } = useCartStore();
  // State để lưu trữ ID của các sản phẩm được chọn
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Tính tổng tiền chỉ cho các sản phẩm được chọn
  const total = cartItems
    .filter((item) => selectedItems.has(item.id))
    .reduce((sum, item) => sum + item.price * item.qty, 0);

  // Xử lý chọn/bỏ chọn tất cả
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  // Xử lý chọn/bỏ chọn từng sản phẩm
  const handleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  // Kiểm tra xem có phải tất cả đều được chọn không
  const isAllSelected =
    cartItems.length > 0 && selectedItems.size === cartItems.length;

  return (
    <Container
      className="my-4"
      style={{
        background: "#fff",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      }}
    >
      <h3>Giỏ hàng</h3>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <Table responsive className="align-middle">
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    label=""
                  />
                </th>
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
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      label=""
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString()}₫</td>
                  <td>
                    <Form.Select
                      value={item.qty}
                      onChange={(e) =>
                        updateQty(item.id, Number(e.target.value))
                      }
                      style={{ width: "80px" }}
                    >
                      {[...Array(10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>{(item.price * item.qty).toLocaleString()}₫</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        removeFromCart(item.id);
                        // Xóa khỏi selectedItems nếu đang được chọn
                        if (selectedItems.has(item.id)) {
                          const newSelected = new Set(selectedItems);
                          newSelected.delete(item.id);
                          setSelectedItems(newSelected);
                        }
                      }}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="me-2">
                Đã chọn: {selectedItems.size} sản phẩm
              </span>
            </div>
            <div className="text-end">
              <h5 className="mb-3">Tổng cộng: {total.toLocaleString()}₫</h5>
              <Link to={selectedItems.size > 0 ? "/checkout" : "#"}>
                <Button
                  variant="success"
                  disabled={selectedItems.size === 0}
                  title={
                    selectedItems.size === 0
                      ? "Vui lòng chọn ít nhất một sản phẩm"
                      : ""
                  }
                >
                  Thanh toán ({selectedItems.size})
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

export default CartPage;
