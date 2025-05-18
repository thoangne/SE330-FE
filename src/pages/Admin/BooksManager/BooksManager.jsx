import React, { useState, useMemo } from "react";
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

const BooksManager = () => {
  // Dữ liệu mẫu
  const initialBooks = [
    {
      id: 1,
      image: "https://via.placeholder.com/50",
      name: "Book One",
      author: "John Doe",
      category: "Fiction",
      quantity: 100,
      description: "A thrilling adventure novel.",
      discount: 10,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/50",
      name: "Book Two",
      author: "Jane Smith",
      category: "Non-Fiction",
      quantity: 50,
      description: "A guide to productivity.",
      discount: 20,
    },
    // ... các bản ghi khác
  ];

  // State
  const [books, setBooks] = useState(initialBooks);
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
      id: Date.now(),
      image: form.image.value,
      name: form.name.value,
      author: form.author.value,
      category: form.category.value,
      quantity: parseInt(form.quantity.value, 10),
      description: form.description.value,
      discount: parseInt(form.discount.value, 10),
    };
    setBooks([newBook, ...books]);
    setShowAdd(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      ...editingBook,
      image: form.image.value,
      name: form.name.value,
      author: form.author.value,
      category: form.category.value,
      quantity: parseInt(form.quantity.value, 10),
      description: form.description.value,
      discount: parseInt(form.discount.value, 10),
    };
    setBooks(books.map((b) => (b.id === updated.id ? updated : b)));
    setShowEdit(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  // Filtering
  const filteredBooks = useMemo(
    () =>
      books.filter(
        (book) =>
          book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      ),
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

  return (
    <Container fluid className="p-0">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">Books Management</h3>
          <div className="d-flex gap-2">
            <Form className="d-flex" style={{ maxWidth: "300px" }}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search by name or author..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup>
            </Form>
            <Button variant="success" onClick={handleAddClick}>
              <FaPlus /> Add Book
            </Button>
          </div>
        </div>
        <div className="card-body">
          <Table responsive bordered striped hover>
            <thead>
              <tr>
                <th>Image</th>
                <th className="sortable" onClick={() => handleSort("name")}>
                  Name {getSortIcon("name")}
                </th>
                <th>Author</th>
                <th>Category</th>
                <th className="sortable" onClick={() => handleSort("quantity")}>
                  Quantity {getSortIcon("quantity")}
                </th>
                <th>Description</th>
                <th className="sortable" onClick={() => handleSort("discount")}>
                  Discount (%) {getSortIcon("discount")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book) => (
                <tr key={book.id}>
                  <td>
                    <Image
                      src={book.image}
                      alt={book.name}
                      width={50}
                      height={50}
                      rounded
                    />
                  </td>
                  <td>{book.name}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.quantity}</td>
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
          <Modal.Title>Add New Book</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="image">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  placeholder="Enter image URL"
                  required
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter book name"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="author">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  placeholder="Enter author name"
                  required
                />
              </Form.Group>
            </Row>
            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                placeholder="Enter category"
                required
              />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="quantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  defaultValue={1}
                  min={1}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="discount">
                <Form.Label>Discount (%)</Form.Label>
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
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Enter description"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Book
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
        {editingBook && (
          <Form onSubmit={handleEditSubmit}>
            <Modal.Body>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="image">
                  <Form.Label>Image URL</Form.Label>
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
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    defaultValue={editingBook.name}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="author">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    defaultValue={editingBook.author}
                    required
                  />
                </Form.Group>
              </Row>
              <Form.Group controlId="category" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  defaultValue={editingBook.category}
                  required
                />
              </Form.Group>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="quantity">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    defaultValue={editingBook.quantity}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="discount">
                  <Form.Label>Discount (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    defaultValue={editingBook.discount}
                    required
                  />
                </Form.Group>
              </Row>
              <Form.Group controlId="description" className="mb-3">
                <Form.Label>Description</Form.Label>
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
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>
    </Container>
  );
};

export default BooksManager;
