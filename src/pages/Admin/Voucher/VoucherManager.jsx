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
import useVoucherStore from "../../../stores/useVoucherStore";

const VoucherManager = () => {
    const {
        vouchers,
        isLoading,
        fetchVouchers,
        addVoucher,
        updateVoucher,
        deleteVoucher,
    } = useVoucherStore();

    useEffect(() => {
        fetchVouchers();
    }, [fetchVouchers]);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);

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
    const handleEditClick = (voucher) => {
        setEditingVoucher(voucher);
        setShowEdit(true);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const newVoucher = {
            code: form.code.value,
            discountType: form.discountType.value,
            value: parseFloat(form.value.value),
            maxUsage: parseInt(form.maxUsage.value, 10),
            remaining: parseInt(form.remaining.value, 10),
            point: parseInt(form.point.value, 10),
            minPurchase: parseFloat(form.minPurchase.value),
            expiryDate: form.expiryDate.value + "T00:00:00",
        };
        console.log(newVoucher);
        addVoucher(newVoucher);
        setShowAdd(false);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedVoucher = {
            ...editingVoucher,
            code: form.code.value,
            discountType: form.discountType.value,
            value: parseFloat(form.value.value),
            maxUsage: parseInt(form.maxUsage.value, 10),
            remaining: parseInt(form.remaining.value, 10),
            point: parseInt(form.point.value, 10),
            minPurchase: parseFloat(form.minPurchase.value),
            expiryDate: form.expiryDate.value + "T00:00:00",
        };
        console.log(updatedVoucher);
        updateVoucher(editingVoucher.id, updatedVoucher);
        setShowEdit(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xoá voucher này?")) {
            deleteVoucher(id);
        }
    };

    const filtered = useMemo(
        () => vouchers.filter((v) => v.code.toLowerCase().includes(searchTerm.toLowerCase())),
        [vouchers, searchTerm]
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
    const indexOfFirst = indexOfLast - itemsPerPage;
    const current = sorted.slice(indexOfFirst, indexOfLast);
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
                    <h3 className="card-title mb-0">Quản lý voucher</h3>
                    <div className="d-flex gap-2">
                        <Form className="d-flex" style={{ maxWidth: 300 }}>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Tìm kiếm theo mã voucher…"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                            </InputGroup>
                        </Form>
                        <Button variant="success" onClick={handleAddClick}>
                            <FaPlus className="me-1" /> Thêm voucher
                        </Button>
                    </div>
                </div>

                <div className="card-body">
                    <Table responsive bordered striped hover>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("id")}>ID {getSortIcon("id")}</th>
                                <th onClick={() => handleSort("code")}>Mã {getSortIcon("code")}</th>
                                <th>Loại giảm</th>
                                <th>Giá trị</th>
                                <th>Điểm cần thiết</th>
                                <th>Đơn tối thiểu</th>
                                <th>Giá trị giảm tối đa</th>
                                <th>Còn lại</th>
                                <th onClick={() => handleSort("expiryDate")}>Hết hạn {getSortIcon("expiryDate")}</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {current.map((v) => (
                                <tr key={v.id}>
                                    <td>{v.id}</td>
                                    <td>{v.code}</td>
                                    <td>{v.discountType}</td>
                                    <td>{v.value?.toLocaleString()}</td>
                                    <td>{v.point}</td>
                                    <td>{v.minPurchase?.toLocaleString()}đ</td>
                                    <td>{v.maxUsage}đ</td>
                                    <td>{v.remaining}</td>
                                    <td>{new Date(v.expiryDate).toLocaleDateString("vi-VN")}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditClick(v)}>
                                            <FaEdit />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(v.id)}>
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

            <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm voucher mới</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Mã</Form.Label>
                            <Form.Control name="code" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Loại giảm</Form.Label>
                            <Form.Select name="discountType">
                                <option value="fixed">Cố định</option>
                                <option value="percent">Phần trăm</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá trị</Form.Label>
                            <Form.Control name="value" type="number" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Điểm cần thiết</Form.Label>
                            <Form.Control name="point" type="number" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Đơn tối thiểu</Form.Label>
                            <Form.Control name="minPurchase" type="number" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá trị giảm tối đa</Form.Label>
                            <Form.Control name="maxUsage" type="number" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Lượt còn lại</Form.Label>
                            <Form.Control name="remaining" type="number" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày hết hạn</Form.Label>
                            <Form.Control name="expiryDate" type="date" required />
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

            <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa voucher</Modal.Title>
                </Modal.Header>
                {editingVoucher && (
                    <Form onSubmit={handleEditSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Mã</Form.Label>
                                <Form.Control name="code" defaultValue={editingVoucher.code} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Loại giảm</Form.Label>
                                <Form.Select name="discountType" defaultValue={editingVoucher.discountType}>
                                    <option value="fixed">Cố định</option>
                                    <option value="percent">Phần trăm</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Giá trị</Form.Label>
                                <Form.Control name="value" type="number" defaultValue={editingVoucher.value} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Điểm cần thiết</Form.Label>
                                <Form.Control name="point" type="number" defaultValue={editingVoucher.point} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Đơn tối thiểu</Form.Label>
                                <Form.Control name="minPurchase" type="number" defaultValue={editingVoucher.minPurchase} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Giá trị giảm tối đa</Form.Label>
                                <Form.Control name="maxUsage" type="number" defaultValue={editingVoucher.maxUsage} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Lượt còn lại</Form.Label>
                                <Form.Control name="remaining" type="number" defaultValue={editingVoucher.remaining} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Ngày hết hạn</Form.Label>
                                <Form.Control name="expiryDate" type="date" defaultValue={editingVoucher.expiryDate} required />
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

export default VoucherManager;