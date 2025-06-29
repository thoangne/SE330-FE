import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
} from "react-bootstrap";
import {
  userPaymentService,
  userOrderService,
} from "../../../services/userServices";
import { addPointsToUserWithTier } from "../../../services/authService";
import { useAuthStore } from "../../../stores/useAuthStore";
import { formatDateTimeForAPI } from "../../../utils/dateUtils";
import { BsGift, BsCreditCard, BsCheckCircle, BsXCircle } from "react-icons/bs";
import { toast } from "react-hot-toast";

function OrderDetailModal({
  show,
  onHide,
  order,
  onOrderUpdate,
  onPointsUpdate,
}) {
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, updateUser } = useAuthStore();

  useEffect(() => {
    if (show && order?.id) {
      loadPaymentDetail();
    }
  }, [show, order]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPaymentDetail = async () => {
    setIsLoading(true);
    try {
      console.log(
        "💳 OrderDetail: Loading payment detail for order:",
        order.id
      );
      const response = await userPaymentService.getPaymentDetailByOrderId(
        order.id
      );
      console.log("💳 OrderDetail: Payment detail loaded:", response);
      setPaymentDetail(response);
    } catch (error) {
      console.error("💳 OrderDetail: Error loading payment detail:", error);
      // Don't show error for missing payment - it might not exist yet
      setPaymentDetail(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!order?.id) return;

    setIsUpdating(true);
    try {
      console.log("📦 OrderDetail: Confirming delivery for order:", order.id);

      // Update order status to DELIVERED
      await userOrderService.confirmDelivery(order.id);
      console.log("📦 OrderDetail: Order status updated to DELIVERED");

      // If payment method is COD, update payment status to PAID and add points
      if (
        paymentDetail &&
        paymentDetail.method === "COD" &&
        paymentDetail.status !== "PAID"
      ) {
        console.log("💳 OrderDetail: Updating COD payment to PAID");

        // Update payment status
        await userPaymentService.updatePayment(paymentDetail.id, {
          status: "PAID",
          paymentDate: formatDateTimeForAPI(),
        });

        // Add points for COD orders (points are added when payment is confirmed)
        if (user?.id && order.totalAmount) {
          console.log(
            "🏆 OrderDetail: Adding points for COD payment with user's tier"
          );
          const pointsResult = await addPointsToUserWithTier(
            user.id,
            order.totalAmount
          );

          if (pointsResult.success) {
            // Update user in store with new points
            const updatedUser = { ...user, point: pointsResult.data.newTotal };
            updateUser(updatedUser);

            // Trigger refresh of promotion info in parent Profile component
            if (onPointsUpdate) {
              onPointsUpdate();
            }

            toast.success(
              `Đã cộng ${pointsResult.data.pointsAdded} điểm vào tài khoản!`
            );
          } else {
            console.warn(
              "🏆 OrderDetail: Failed to add points:",
              pointsResult.message
            );
            toast.warning(
              "Đã xác nhận đơn hàng nhưng không thể cộng điểm tích lũy"
            );
          }
        }
      }

      // Update local state
      const updatedOrder = { ...order, status: "DELIVERED" };

      // Notify parent component
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }

      toast.success("Đã xác nhận giao hàng thành công!");
      onHide();
    } catch (error) {
      console.error("📦 OrderDetail: Error confirming delivery:", error);
      toast.error("Có lỗi xảy ra khi xác nhận giao hàng");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order?.id) return;

    setIsUpdating(true);
    try {
      console.log("❌ OrderDetail: Cancelling order:", order.id);

      // Cancel order
      await userOrderService.cancelOrder(order.id);
      console.log("❌ OrderDetail: Order cancelled");

      // Delete payment if exists
      if (paymentDetail?.id) {
        console.log("💳 OrderDetail: Deleting payment:", paymentDetail.id);
        await userPaymentService.deletePayment(paymentDetail.id);
      }

      // Update local state
      const updatedOrder = { ...order, status: "CANCELLED" };

      // Notify parent component
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }

      toast.success("Đã hủy đơn hàng thành công!");
      onHide();
    } catch (error) {
      console.error("❌ OrderDetail: Error cancelling order:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: "warning",
      CONFIRMED: "info",
      SHIPPING: "primary",
      DELIVERED: "success",
      CANCELLED: "danger",
    };

    const texts = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      SHIPPING: "Đang giao",
      DELIVERED: "Đã giao",
      CANCELLED: "Đã hủy",
    };

    return (
      <Badge bg={variants[status] || "secondary"}>
        {texts[status] || status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const variants = {
      PENDING: "warning",
      PAID: "success",
      Pending: "warning",
    };

    const texts = {
      PENDING: "Chờ thanh toán",
      PAID: "Đã thanh toán",
      Pending: "Chờ thanh toán",
    };

    return (
      <Badge bg={variants[status] || "secondary"}>
        {texts[status] || status}
      </Badge>
    );
  };

  const canConfirmDelivery = order?.status === "SHIPPING";
  const canCancelOrder = order?.status === "PENDING";

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết đơn hàng #{order?.id}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <p className="mt-2">Đang tải chi tiết đơn hàng...</p>
          </div>
        ) : (
          <Row>
            {/* Order Information */}
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Thông tin đơn hàng</h6>
                </Card.Header>
                <Card.Body>
                  <p>
                    <strong>Mã đơn hàng:</strong> #{order?.id}
                  </p>
                  <p>
                    <strong>Ngày đặt:</strong>
                    {new Date(
                      order?.created_at || order?.createdAt || order?.orderDate
                    ).toLocaleDateString("vi-VN")}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {getStatusBadge(order?.status)}
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong>
                    <span className="text-primary fw-bold">
                      {order?.totalAmount?.toLocaleString()} đ
                    </span>
                  </p>

                  {/* Order Items */}
                  <div className="mt-3">
                    <strong>Sản phẩm:</strong>
                    <ListGroup variant="flush" className="mt-2">
                      {(order?.items || order?.orderItems || []).map(
                        (item, index) => (
                          <ListGroup.Item key={index} className="px-0">
                            <div className="d-flex justify-content-between">
                              <div>
                                <div>
                                  {item.product?.title ||
                                    item.productName ||
                                    `Sản phẩm #${item.productId}`}
                                </div>
                                {item.product?.author && (
                                  <small className="text-muted">
                                    Tác giả: {item.product.author}
                                  </small>
                                )}
                              </div>
                              <div className="text-end">
                                <div>x{item.quantity}</div>
                                <div className="text-primary">
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                  đ
                                </div>
                              </div>
                            </div>
                          </ListGroup.Item>
                        )
                      )}
                    </ListGroup>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Payment Information */}
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Thông tin thanh toán</h6>
                </Card.Header>
                <Card.Body>
                  {paymentDetail ? (
                    <>
                      <p>
                        <strong>Mã thanh toán:</strong> #{paymentDetail.id}
                      </p>
                      <p>
                        <strong>Phương thức:</strong>
                        <BsCreditCard className="me-1" />
                        {paymentDetail.method}
                      </p>
                      <p>
                        <strong>Trạng thái:</strong>
                        {getPaymentStatusBadge(paymentDetail.status)}
                      </p>
                      <p>
                        <strong>Tổng tiền:</strong>
                        <span className="text-primary fw-bold">
                          {paymentDetail.totalamount?.toLocaleString()} đ
                        </span>
                      </p>
                      {paymentDetail.vouchercode && (
                        <p>
                          <strong>Voucher:</strong> <BsGift className="me-1" />
                          {paymentDetail.vouchercode}
                        </p>
                      )}
                      <p>
                        <strong>Tên người nhận:</strong> {paymentDetail.name}
                      </p>
                      <p>
                        <strong>Điện thoại:</strong> {paymentDetail.phone}
                      </p>
                      <p>
                        <strong>Địa chỉ:</strong> {paymentDetail.address}
                      </p>
                      {paymentDetail.paidAt && (
                        <p>
                          <strong>Thời gian thanh toán:</strong>
                          {new Date(paymentDetail.paidAt).toLocaleString(
                            "vi-VN"
                          )}
                        </p>
                      )}
                    </>
                  ) : (
                    <Alert variant="info">
                      Chưa có thông tin thanh toán cho đơn hàng này.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>

        {canCancelOrder && (
          <Button
            variant="danger"
            onClick={handleCancelOrder}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Spinner size="sm" className="me-2" />
                Đang hủy...
              </>
            ) : (
              <>
                <BsXCircle className="me-1" />
                Hủy đơn hàng
              </>
            )}
          </Button>
        )}

        {canConfirmDelivery && (
          <Button
            variant="success"
            onClick={handleConfirmDelivery}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Spinner size="sm" className="me-2" />
                Đang xác nhận...
              </>
            ) : (
              <>
                <BsCheckCircle className="me-1" />
                Xác nhận đã nhận hàng
              </>
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default OrderDetailModal;
