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
import useAuthorStore from "../../../stores/useAuthorStore";

/**
 * Author object shape (example):
 * {
 *   id: 1,
 *   name: "Nguyễn Nhật Ánh",
 *   bio: "Tiểu thuyết gia nổi tiếng với ...",
 *   avatar: "https://.../avatar.jpg"
 * }
 */

const AuthorManager = () => {
  const {
    fetchAuthors,
    authors,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    isLoading,
    error,
  } = useAuthorStore();

  /* ----------------------------- lifecycle ----------------------------- */
  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  /* --------------------------- local UI state -------------------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // modal state
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  /* ----------------------------- handlers ----------------------------- */
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

  const handleEditClick = (author) => {
    setEditingAuthor(author);
    setShowEdit(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newAuthor = {
      id: Date.now(),
      avatar: form.avatar.value,
      name: form.name.value,
      bio: form.bio.value,
    };
    addAuthor(newAuthor);
    setShowAdd(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedAuthor = {
      ...editingAuthor,
      avatar: form.avatar.value,
      name: form.name.value,
      bio: form.bio.value,
    };
    updateAuthor(updatedAuthor);
    setShowEdit(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá tác giả này?")) {
      deleteAuthor(id);
    }
  };

  /* ----------------------------- filtering ---------------------------- */
  const filteredAuthors = useMemo(
    () =>
      authors.filter((a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [authors, searchTerm]
  );

  /* ------------------------------ sorting ----------------------------- */
  const sortedAuthors = useMemo(() => {
    if (!sortConfig.key) return filteredAuthors;
    return [...filteredAuthors].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredAuthors, sortConfig]);

  /* ---------------------------- pagination ---------------------------- */
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAuthors = sortedAuthors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedAuthors.length / itemsPerPage);

  const paginationItems = Array.from({ length: totalPages }, (_, i) => (
    <Pagination.Item
      key={i + 1}
      active={i + 1 === currentPage}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </Pagination.Item>
  ));

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

  /* ------------------------------ render ------------------------------ */
  return (
    <Container fluid className="p-0">
      {/* card wrapper */}
      <div className="card shadow-sm border-0">
        {/* header */}
        <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">Quản lý tác giả</h3>
          <div className="d-flex gap-2">
            <Form className="d-flex" style={{ maxWidth: 300 }}>
              <InputGroup>
                <Form.Control
                  placeholder="Tìm kiếm theo tên tác giả…"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup>
            </Form>
            <Button variant="success" onClick={handleAddClick}>
              <FaPlus className="me-1" /> Thêm tác giả
            </Button>
          </div>
        </div>

        {/* body */}
        <div className="card-body">
          <Table responsive bordered striped hover>
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort("id")}>
                  ID {getSortIcon("id")}
                </th>
                <th>Ảnh</th>
                <th className="sortable" onClick={() => handleSort("name")}>
                  Tên tác giả {getSortIcon("name")}
                </th>
                <th>Tiểu sử</th>
                <th style={{ width: 120 }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentAuthors.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>
                    {a.avatar && (
                      <Image
                        src={a.avatar}
                        alt={a.name}
                        width={50}
                        height={50}
                        rounded
                      />
                    )}
                  </td>
                  <td>{a.name}</td>
                  <td className="text-truncate" style={{ maxWidth: 350 }}>
                    {a.bio}
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditClick(a)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(a.id)}
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

      {/* ------------------------------- modals ------------------------------- */}
      {/* add */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm tác giả mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="avatar">
              <Form.Label>URL hình ảnh</Form.Label>
              <Form.Control name="avatar" placeholder="https://" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Tên tác giả</Form.Label>
              <Form.Control name="name" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="bio">
              <Form.Label>Tiểu sử</Form.Label>
              <Form.Control as="textarea" rows={3} name="bio" />
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

      {/* edit */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa tác giả</Modal.Title>
        </Modal.Header>
        {editingAuthor && (
          <Form onSubmit={handleEditSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="avatarEdit">
                <Form.Label>URL hình ảnh</Form.Label>
                <Form.Control
                  name="avatar"
                  defaultValue={editingAuthor.avatar}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="nameEdit">
                <Form.Label>Tên tác giả</Form.Label>
                <Form.Control
                  name="name"
                  defaultValue={editingAuthor.name}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bioEdit">
                <Form.Label>Tiểu sử</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="bio"
                  defaultValue={editingAuthor.bio}
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

export default AuthorManager;
