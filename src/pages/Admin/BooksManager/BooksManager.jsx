import React, { useState, useMemo, useEffect } from "react";
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
import useBookStore from "../../../stores/useBookStore";

const BooksManager = () => {
  const {
    getBooks,
    books,
    addBook,
    updateBook, // thêm
    deleteBook, // thêm
    error,
    isLoading,
  } = useBookStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    getBooks();
  }, [getBooks]);

  // Modal
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // ------ Handlers ------
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

  const handleAddClick = () => setShowAdd(true);
  const handleEditClick = (book) => {
    setEditingBook(book);
    setShowEdit(true);
  };

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
    addBook(newBook);
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
    updateBook(updated); // ⚙️ Cập nhật dữ liệu
    setShowEdit(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBook(id); // ⚙️ Xóa dữ liệu
    }
  };

  // Filter
  const filteredBooks = useMemo(
    () =>
      books.filter((book) =>
        [book.name ?? "", book.author ?? "", book.category ?? ""].some((str) =>
          str.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
    [books, searchTerm]
  );

  // Sort
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
                      src={book.coverImage}
                      alt={book.title}
                      width={50}
                      height={50}
                      rounded
                    />
                  </td>
                  <td>{book.title}</td>
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

      {/* Modal Add */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Book</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>{/* các input fields giống như trước */}</Modal.Body>
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

      {/* Modal Edit */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
        {editingBook && (
          <Form onSubmit={handleEditSubmit}>
            <Modal.Body></Modal.Body>
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
