import React, { useState, useMemo, use, useEffect } from "react";
import {
  Container,
  Table,
  Pagination,
  Form,
  Button,
  Image,
  InputGroup,
  Modal,
  Row,
  Col,
  Spinner,
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
import useBookStore from "../../../stores/useBookStore";

const BooksManager = () => {
  const { books, isLoading, addBook, updateBook, deleteBook, fetchBooks } =
    useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Handlers
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

  const handleEditClick = (book) => {
    setEditingBook(book);
    setShowEdit(true);
  };

  const handleAddClick = () => setShowAdd(true);
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newBook = {
      coverImage: form.image.value,
      description: form.name.value,
      discount: form.author.value,
      price: form.category.value,
      slug: parseInt(form.quantity.value, 10),
      stock: form.description.value,
      title: parseInt(form.discount.value, 10),
      publisherId: parseInt(form.discount.value, 10),
      categoryId: parseInt(form.discount.value, 10),
      authorIds: parseInt(form.discount.value, 10),
    };
    addBook(newBook);
    setShowAdd(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      ...editingBook,
      coverImage: form.image.value,
      title: form.name.value,
      authors: form.author.value,
      category: form.category.value,
      quantity: parseInt(form.quantity.value, 10),
      description: form.description.value,
      discount: parseInt(form.discount.value, 10),
    };
    console.log(updated);
    // updateBook(id,updated);
    setShowEdit(false);
  };
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sách này?")) {
      deleteBook(id);
    }
  };

  // Filtering
  const filteredBooks = useMemo(
    () =>
      books
        ? books.filter(
            (book) =>
              (book.name || "")
                .toLowerCase()
                .includes((searchTerm || "").toLowerCase()) ||
              (book.author || "")
                .toLowerCase()
                .includes((searchTerm || "").toLowerCase())
          )
        : [],
    [books, searchTerm]
  );

  // Sorting
  const sortedBooks = useMemo(() => {
    if (!sortConfig.key) return filteredBooks;
    return [...filteredBooks].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredBooks, sortConfig]);

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);

  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ms-1" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="ms-1" />
    ) : (
      <FaSortDown className="ms-1" />
    );
  };
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
          <h3 className="card-title mb-0">Quản lý sách</h3>
          <div className="d-flex gap-2">
            <Form className="d-flex" style={{ maxWidth: "300px" }}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc tác giả..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup>
            </Form>
            <Button variant="success" onClick={handleAddClick}>
              <FaPlus /> Thêm sách
            </Button>
          </div>
        </div>
        <div className="card-body">
          <Table responsive bordered striped hover>
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th className="sortable" onClick={() => handleSort("name")}>
                  Tên sách {getSortIcon("name")}
                </th>
                <th>Tác giả</th>
                <th>Thể loại</th>
                <th className="sortable" onClick={() => handleSort("quantity")}>
                  Số lượng {getSortIcon("quantity")}
                </th>
                <th>Mô tả</th>
                <th className="sortable" onClick={() => handleSort("discount")}>
                  Giảm giá (%) {getSortIcon("discount")}
                </th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book) => (
                <tr key={book.id}>
                  <td>
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      width={50}
                      height={50}
                      rounded
                    />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.authors.name}</td>
                  <td>{book.category.name}</td>
                  <td>{book.stock}</td>
                  <td className="text-truncate" style={{ maxWidth: "150px" }}>
                    {book.description}
                  </td>
                  <td>{book.discount}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditClick(book)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(book.id)}
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
        </div>
      </div>
      {/* Add Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm sách mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="image">
                <Form.Label>URL hình ảnh</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  placeholder="Nhập URL hình ảnh"
                  required
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="name">
                <Form.Label>Tên sách</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Nhập tên sách"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="author">
                <Form.Label>Tác giả</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  placeholder="Nhập tên tác giả"
                  required
                />
              </Form.Group>{" "}
            </Row>
            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Thể loại</Form.Label>
              <Form.Control
                type="text"
                name="category"
                placeholder="Nhập thể loại"
                required
              />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="quantity">
                <Form.Label>Số lượng</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  defaultValue={1}
                  min={1}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="discount">
                <Form.Label>Giảm giá (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="discount"
                  defaultValue={0}
                  min={0}
                  max={100}
                  required
                />
              </Form.Group>
            </Row>
            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Nhập mô tả"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              Thêm sách
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa sách</Modal.Title>
        </Modal.Header>
        {editingBook && (
          <Form onSubmit={handleEditSubmit}>
            <Modal.Body>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="image">
                  <Form.Label>URL hình ảnh</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    defaultValue={editingBook.image}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="name">
                  <Form.Label>Tên sách</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    defaultValue={editingBook.name}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="author">
                  <Form.Label>Tác giả</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    defaultValue={editingBook.author}
                    required
                  />
                </Form.Group>
              </Row>
              <Form.Group controlId="category" className="mb-3">
                <Form.Label>Thể loại</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  defaultValue={editingBook.category}
                  required
                />
              </Form.Group>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="quantity">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    defaultValue={editingBook.quantity}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="discount">
                  <Form.Label>Giảm giá (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    defaultValue={editingBook.discount}
                    required
                  />
                </Form.Group>
              </Row>
              <Form.Group controlId="description" className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  defaultValue={editingBook.description}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEdit(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="primary">
                Lưu thay đổi
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>
    </Container>
  );
};

export default BooksManager;
