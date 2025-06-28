import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Table,
  Pagination,
  Form,
  Button,
  InputGroup,
  Modal,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
} from "react-icons/fa";
import useOrderStore from "../../../stores/useOrderStore";

const OrdersManager = () => {
  const {
    fetchOrders,
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    isLoading,
    error,
  } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) =>
    sortConfig.key !== key ? (
      <FaSort className="ms-1" />
    ) : sortConfig.direction === "asc" ? (
      <FaSortUp className="ms-1" />
    ) : (
      <FaSortDown className="ms-1" />
    );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newOrder = {
      id: Date.now(),
      userName: form.userName.value,
      status: form.status.value,
      totalAmount: Number(form.totalAmount.value),
      payment: form.payment.value,
      address: form.address.value,
    };
    addOrder(newOrder);
    setShowAdd(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      ...editingOrder,
      userName: form.userName.value,
      status: form.status.value,
      totalAmount: Number(form.totalAmount.value),
      payment: form.payment.value,
      address: form.address.value,
    };
    updateOrder(updated);
    setShowEdit(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá đơn hàng này?")) {
      deleteOrder(id);
    }
  };

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.status.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [orders, searchTerm]
  );

  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered;
    return [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortConfig]);

  const indexOfLast = currentPage * itemsPerPage;
  const currentOrders = sorted.slice(indexOfLast - itemsPerPage, indexOfLast);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginationItems = Array.from({ length: totalPages }, (_, i) => (
    <Pagination.Item
      key={i + 1}
      active={i + 1 === currentPage}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </Pagination.Item>
  ));

  return (
    <Container fluid className="p-0">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">Quản lý đơn hàng</h3>
          <div className="d-flex gap-2">
            <Form style={{ maxWidth: 300 }}>
              <InputGroup>
                <Form.Control
                  placeholder="Tìm kiếm theo tên hoặc trạng thái"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup>
            </Form>
            <Button variant="success" onClick={() => setShowAdd(true)}>
              <FaPlus className="me-1" /> Thêm đơn hàng
            </Button>
          </div>
        </div>

        <div className="card-body">
          {isLoading && (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!isLoading && !error && (
            <>
              <Table responsive bordered striped hover>
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort("id")}>
                      ID {getSortIcon("id")}
                    </th>
                    <th
                      className="sortable"
                      onClick={() => handleSort("userName")}
                    >
                      Khách hàng {getSortIcon("userName")}
                    </th>
                    <th
                      className="sortable"
                      onClick={() => handleSort("status")}
                    >
                      Trạng thái {getSortIcon("status")}
                    </th>
                    <th
                      className="sortable"
                      onClick={() => handleSort("totalAmount")}
                    >
                      Tổng tiền {getSortIcon("totalAmount")}
                    </th>
                    <th>Thanh toán</th>
                    <th>Địa chỉ</th>
                    <th style={{ width: 120 }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.userName}</td>
                      <td>{o.status}</td>
                      <td>{o.totalAmount.toLocaleString()}₫</td>
                      <td>{o.payment}</td>
                      <td className="text-truncate" style={{ maxWidth: 180 }}>
                        {o.address}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setEditingOrder(o);
                            setShowEdit(true);
                          }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(o.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {totalPages > 1 && (
                <div className="d-flex justify-content-end mt-3">
                  <Pagination>{paginationItems}</Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Order Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm đơn hàng mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên khách hàng</Form.Label>
              <Form.Control name="userName" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select name="status" defaultValue="PENDING">
                <option value="PENDING">Chờ xử lý</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="SHIPPING">Đang giao hàng</option>
                <option value="DELIVERED">Đã giao</option>
                <option value="CANCELLED">Đã hủy</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tổng tiền</Form.Label>
              <Form.Control type="number" name="totalAmount" required min={0} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phương thức thanh toán</Form.Label>
              <Form.Select name="payment">
                <option value="COD">Thanh toán khi nhận</option>
                <option value="BANK">Chuyển khoản</option>
                <option value="CARD">Thẻ tín dụng</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ giao hàng</Form.Label>
              <Form.Control name="address" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>
              Huỷ
            </Button>
            <Button type="submit" variant="primary">
              Thêm
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Order Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa đơn hàng</Modal.Title>
        </Modal.Header>
        {editingOrder && (
          <Form onSubmit={handleEditSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Tên khách hàng</Form.Label>
                <Form.Control
                  name="userName"
                  defaultValue={editingOrder.userName}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select name="status" defaultValue={editingOrder.status}>
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="SHIPPING">Đang giao hàng</option>
                  <option value="DELIVERED">Đã giao</option>
                  <option value="CANCELLED">Đã hủy</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tổng tiền</Form.Label>
                <Form.Control
                  type="number"
                  name="totalAmount"
                  defaultValue={editingOrder.totalAmount}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phương thức thanh toán</Form.Label>
                <Form.Select name="payment" defaultValue={editingOrder.payment}>
                  <option value="COD">Thanh toán khi nhận</option>
                  <option value="BANK">Chuyển khoản</option>
                  <option value="CARD">Thẻ tín dụng</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ giao hàng</Form.Label>
                <Form.Control
                  name="address"
                  defaultValue={editingOrder.address}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEdit(false)}>
                Huỷ
              </Button>
              <Button type="submit" variant="primary">
                Lưu
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>
    </Container>
  );
};

export default OrdersManager;
