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
import useUserStore from "../../../stores/useUserStore";

const UsersManager = () => {
  const {
    fetchUsers,
    users,
    addUser,
    updateUser,
    deleteUser,
    isLoading,
    error,
  } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

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
    const newUser = {
      id: Date.now(),
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      address: form.address.value,
      point: Number(form.point.value) || 0,
      role: form.role.value,
    };
    addUser(newUser);
    setShowAdd(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      ...editingUser,
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      address: form.address.value,
      point: Number(form.point.value) || 0,
      role: form.role.value,
    };
    updateUser(updated);
    setShowEdit(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá người dùng này?")) {
      deleteUser(id);
    }
  };

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
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
  const currentUsers = sorted.slice(indexOfLast - itemsPerPage, indexOfLast);
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
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <Container fluid className="p-0">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">Quản lý người dùng</h3>
          <div className="d-flex gap-2">
            <Form style={{ maxWidth: 300 }}>
              <InputGroup>
                <Form.Control
                  placeholder="Tìm kiếm theo tên hoặc email"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup>
            </Form>
            <Button variant="success" onClick={() => setShowAdd(true)}>
              <FaPlus className="me-1" /> Thêm người dùng
            </Button>
          </div>
        </div>

        <div className="card-body">
          {error && <Alert variant="danger">{error}</Alert>}

          {!isLoading && !error && (
            <>
              <Table responsive bordered striped hover>
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort("id")}>
                      ID {getSortIcon("id")}
                    </th>
                    <th className="sortable" onClick={() => handleSort("name")}>
                      Tên {getSortIcon("name")}
                    </th>
                    <th
                      className="sortable"
                      onClick={() => handleSort("email")}
                    >
                      Email {getSortIcon("email")}
                    </th>
                    <th>Điện thoại</th>
                    <th>Địa chỉ</th>
                    <th
                      className="sortable"
                      onClick={() => handleSort("point")}
                    >
                      Điểm {getSortIcon("point")}
                    </th>
                    <th>Vai trò</th>
                    <th style={{ width: 120 }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td className="text-truncate" style={{ maxWidth: 180 }}>
                        {u.address}
                      </td>
                      <td>{u.point}</td>
                      <td>{u.role}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setEditingUser(u);
                            setShowEdit(true);
                          }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(u.id)}
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

      {/* Add User Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm người dùng mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="name">
                <Form.Label>Tên</Form.Label>
                <Form.Control name="name" required />
              </Form.Group>
              <Form.Group as={Col} controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" required />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="phone">
                <Form.Label>Điện thoại</Form.Label>
                <Form.Control name="phone" />
              </Form.Group>
              <Form.Group as={Col} controlId="point">
                <Form.Label>Điểm</Form.Label>
                <Form.Control
                  type="number"
                  name="point"
                  defaultValue={0}
                  min={0}
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control name="address" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Vai trò</Form.Label>
              <Form.Select name="role" defaultValue="USER" required>
                <option value="USER">USER</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="ADMIN">ADMIN</option>
              </Form.Select>
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

      {/* Edit User Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa người dùng</Modal.Title>
        </Modal.Header>
        {editingUser && (
          <Form onSubmit={handleEditSubmit}>
            <Modal.Body>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="nameEdit">
                  <Form.Label>Tên</Form.Label>
                  <Form.Control
                    name="name"
                    defaultValue={editingUser.name}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="emailEdit">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    defaultValue={editingUser.email}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="phoneEdit">
                  <Form.Label>Điện thoại</Form.Label>
                  <Form.Control name="phone" defaultValue={editingUser.phone} />
                </Form.Group>
                <Form.Group as={Col} controlId="pointEdit">
                  <Form.Label>Điểm</Form.Label>
                  <Form.Control
                    type="number"
                    name="point"
                    defaultValue={editingUser.point}
                  />
                </Form.Group>
              </Row>
              <Form.Group className="mb-3" controlId="addressEdit">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  name="address"
                  defaultValue={editingUser.address}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="roleEdit">
                <Form.Label>Vai trò</Form.Label>
                <Form.Select
                  name="role"
                  defaultValue={editingUser.role}
                  required
                >
                  <option value="USER">USER</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="ADMIN">ADMIN</option>
                </Form.Select>
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

export default UsersManager;
