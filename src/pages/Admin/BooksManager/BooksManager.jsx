import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
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
import { userCategoryService } from "../../../services/userCategoryService";
import { userAuthorService } from "../../../services/userAuthorService";
import { userPublisherService } from "../../../services/userPublisherService";


const BooksManager = () => {
  const { books, isLoading, addBook, updateBook, deleteBook, fetchBooks } = useBookStore();
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const data = await userPublisherService.getAllPublishers();
        setPublishers(data);
      } catch (err) {
        console.error("Lỗi tải NXB:", err);
      }
    };
    fetchPublishers();
  }, []);

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const data = await userAuthorService.getAllAuthors();
        setAuthors(data);
      } catch (error) {
        console.error("Lỗi khi tải tác giả:", error);
      }
    };

    loadAuthors();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await userCategoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi tải thể loại:", error);
      }
    };

    loadCategories();
  }, []);

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
      description: form.description.value,
      discount: parseFloat(form.discount.value),
      price: parseFloat(form.price.value),
      slug: form.slug.value,
      stock: parseInt(form.quantity.value, 10),
      title: form.name.value,
      publisherId: form.publisher.value ? parseInt(form.publisher.value, 10) : null,
      categoryId: parseInt(form.category.value, 10),
      authorIds: selectedAuthors?.map((a) => a.value) || [],
    };
    console.log(newBook);
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
      stock: parseInt(form.quantity.value, 10),
      description: form.description.value,
      discount: parseInt(form.discount.value, 10),
      price: form.price.value,
      publisherId: parseInt(form.publisher.value, 10),
      categoryId: parseInt(form.category.value, 10),
      authorIds: selectedAuthors?.map((a) => a.value) || [],
    };
    console.log(updated);
    updateBook(editingBook.id, updated);
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
                <th>NXB</th>
                <th className="sortable" onClick={() => handleSort("quantity")}>
                  Số lượng {getSortIcon("quantity")}
                </th>
                <th>Mô tả</th>
                <th>Giá gốc</th>
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
                  <td>
                    {book.authors && book.authors.length > 0
                      ? book.authors.map(a => a.name).join(", ")
                      : "Unknown"}
                  </td>
                  <td>{book.category?.name || "Unknown"}</td>
                  <td>{book.publisher?.name || "Unknown"}</td>
                  <td>{book.stock}</td>
                  <td className="text-truncate" style={{ maxWidth: "150px" }}>
                    {book.description}
                  </td>
                  <td>{book.price}</td>
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
            {/* Ảnh */}
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
              <Form.Group as={Col} controlId="slug">
                <Form.Label>Slug</Form.Label>
                <Form.Control
                  type="text"
                  name="slug"
                  placeholder="Nhập URL sản phẩm"
                  required
                />
              </Form.Group>
            </Row>

            {/* Tên sách */}
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
            </Row>

            {/* Tác giả */}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="authors">
                <Form.Label>Tác giả</Form.Label>
                <Select
                  isMulti
                  options={authors.map((a) => ({ label: a.name, value: a.id }))}
                  value={selectedAuthors}
                  onChange={setSelectedAuthors}
                  placeholder="Chọn tác giả..."
                  isClearable
                />
              </Form.Group>
            </Row>

            {/* Thể loại */}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="category">
                <Form.Label>Thể loại</Form.Label>
                <Form.Select name="category" required>
                  <option value="">-- Chọn thể loại --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="publisher" required>
                <Form.Label>Nhà xuất bản</Form.Label>
                <Form.Select name="publisher">
                  <option value="">-- Chọn NXB --</option>
                  {publishers.map((pub) => (
                    <option key={pub.id} value={pub.id}>
                      {pub.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            {/* Giá + Số lượng + Giảm giá */}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="price">
                <Form.Label>Giá gốc</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  defaultValue={0}
                  min={0}
                  required
                />
              </Form.Group>

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

            {/* Mô tả */}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="description">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  placeholder="Nhập mô tả"
                />
              </Form.Group>
            </Row>
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
              {/* Ảnh */}
              <Row className="mb-3">
                <Form.Group as={Col} controlId="image">
                  <Form.Label>URL hình ảnh</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    defaultValue={editingBook.coverImage}
                    required
                  />
                </Form.Group>
              </Row>

              {/* Tên sách */}
              <Row className="mb-3">
                <Form.Group as={Col} controlId="name">
                  <Form.Label>Tên sách</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    defaultValue={editingBook.title}
                    required
                  />
                </Form.Group>
              </Row>

              {/* Tác giả */}
              <Row className="mb-3">
                <Form.Group as={Col} controlId="authors">
                  <Form.Label>Tác giả</Form.Label>
                  <Select
                    isMulti
                    options={authors.map((a) => ({ label: a.name, value: a.id }))}
                    value={selectedAuthors}
                    onChange={setSelectedAuthors}
                    placeholder="Chọn tác giả..."
                    isClearable
                  />
                </Form.Group>
              </Row>

              {/* Thể loại */}
              <Row className="mb-3">
                <Form.Group as={Col} controlId="category">
                  <Form.Label>Thể loại</Form.Label>
                  <Form.Select
                    name="category"
                    defaultValue={editingBook.category?.id || ""}
                    required
                  >
                    <option value="">-- Chọn thể loại --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>

              {/* NXB */}
              <Row className="mb-3">
                <Form.Group as={Col} controlId="publisher">
                  <Form.Label>Nhà xuất bản</Form.Label>
                  <Form.Select
                    name="publisher"
                    defaultValue={editingBook.publisher?.id || ""}
                    required
                  >
                    <option value="">-- Chọn NXB --</option>
                    {publishers.map((pub) => (
                      <option key={pub.id} value={pub.id}>
                        {pub.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>

              {/* Giá, Số lượng, Giảm giá */}
              <Row className="mb-3">
                <Form.Group as={Col} controlId="price">
                  <Form.Label>Giá gốc</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    defaultValue={editingBook.price}
                    min={0}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="quantity">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    defaultValue={editingBook.stock}
                    min={1}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="discount">
                  <Form.Label>Giảm giá (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    defaultValue={editingBook.discount}
                    min={0}
                    max={100}
                    required
                  />
                </Form.Group>
              </Row>

              {/* Mô tả */}
              <Row className="mb-3">
                <Form.Group as={Col} controlId="description">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    defaultValue={editingBook.description}
                  />
                </Form.Group>
              </Row>
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
