import React, { useEffect, useMemo, useState } from "react";
import {
    Button,
    Container,
    Form,
    InputGroup,
    Modal,
    Pagination,
    Spinner,
    Table,
} from "react-bootstrap";
import {
    FaSearch,
    FaPlus,
    FaEdit,
    FaTrash,
    FaSort,
    FaSortUp,
    FaSortDown,
} from "react-icons/fa";
import usePromotionStore from "../../../stores/usePromotionStore";

const PromotionManager = () => {
    const {
        promotions,
        isLoading,
        fetchPromotions,
        addPromotion,
        updatePromotion,
        deletePromotion,
    } = usePromotionStore();

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
        setSortConfig({ key, direction });
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const newPromotion = {
            rank: form.get("rank"),
            point: parseInt(form.get("point"), 10),
            tierMultiplier: parseFloat(form.get("tierMultiplier")),
        };
        console.log(newPromotion);
        addPromotion(newPromotion);
        setShowAdd(false);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const updatedPromotion = {
            ...editingPromotion,
            rank: form.get("rank"),
            point: parseInt(form.get("point"), 10),
            tierMultiplier: parseFloat(form.get("tierMultiplier")),
        };
        updatePromotion(editingPromotion.rank, updatedPromotion);
        setShowEdit(false);
    };

    const filtered = useMemo(
        () => promotions.filter((p) => p.rank.toLowerCase().includes(searchTerm.toLowerCase())),
        [promotions, searchTerm]
    );

    const sorted = useMemo(() => {
        if (!sortConfig.key) return filtered;
        return [...filtered].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filtered, sortConfig]);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const current = sorted.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sorted.length / itemsPerPage);

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort className="ms-1" />;
        return sortConfig.direction === "asc" ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    return (
        <Container fluid>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Quản lý cấp bậc thành viên</h5>
                    <div className="d-flex gap-2">
                        <Form className="d-flex" style={{ maxWidth: 300 }}>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Tìm kiếm theo tên hạng..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <InputGroup.Text><FaSearch /></InputGroup.Text>
                            </InputGroup>
                        </Form>
                        <Button variant="success" onClick={() => setShowAdd(true)}>
                            <FaPlus className="me-1" /> Thêm hạng
                        </Button>
                    </div>
                </div>

                <div className="card-body">
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("id")}>ID {getSortIcon("id")}</th>
                                <th onClick={() => handleSort("rank")}>Hạng {getSortIcon("rank")}</th>
                                <th onClick={() => handleSort("point")}>Điểm {getSortIcon("point")}</th>
                                <th onClick={() => handleSort("tierMultiplier")}>Hệ số {getSortIcon("tierMultiplier")}</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {current.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.rank}</td>
                                    <td>{p.point}</td>
                                    <td>{p.tierMultiplier}</td>
                                    <td>
                                        <Button size="sm" variant="outline-primary" onClick={() => { setEditingPromotion(p); setShowEdit(true); }} className="me-2">
                                            <FaEdit />
                                        </Button>
                                        <Button size="sm" variant="outline-danger" onClick={() => deletePromotion(p.rank)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-end">
                            <Pagination>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <Pagination.Item key={i} active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>

            <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                <Modal.Header closeButton><Modal.Title>Thêm hạng mới</Modal.Title></Modal.Header>
                <Form onSubmit={handleAddSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Hạng</Form.Label>
                            <Form.Select name="rank" required>
                                <option value="BRONZE">BRONZE</option>
                                <option value="SILVER">SILVER</option>
                                <option value="GOLD">GOLD</option>
                                <option value="PLATINUM">PLATINUM</option>
                                <option value="DIAMOND">DIAMOND</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Điểm</Form.Label>
                            <Form.Control name="point" type="number" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Hệ số</Form.Label>
                            <Form.Control name="tierMultiplier" type="number" step="0.01" required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAdd(false)}>Huỷ</Button>
                        <Button type="submit" variant="primary">Thêm</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                <Modal.Header closeButton><Modal.Title>Chỉnh sửa hạng</Modal.Title></Modal.Header>
                {editingPromotion && (
                    <Form onSubmit={handleEditSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Hạng</Form.Label>
                                <Form.Control
                                    name="rank"
                                    defaultValue={editingPromotion.rank}
                                    readOnly
                                    plaintext
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Điểm</Form.Label>
                                <Form.Control name="point" type="number" defaultValue={editingPromotion.point} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Hệ số</Form.Label>
                                <Form.Control name="tierMultiplier" type="number" step="0.01" defaultValue={editingPromotion.tierMultiplier} required />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEdit(false)}>Huỷ</Button>
                            <Button type="submit" variant="primary">Lưu</Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>
        </Container>
    );
};

export default PromotionManager;