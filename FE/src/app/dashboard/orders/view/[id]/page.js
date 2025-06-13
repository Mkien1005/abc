"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderService } from "@/services/order_service";
import { formatVND } from "@/utils/formatVND";
import Preloader from "@/components/preloader/Preloader";
// const OrderStatusVN = {
//   pending: "Đang chờ xác nhận",
//   confirmed: "Đã xác nhận",
//   processing: "Đang xử lý",
//   shipped: "Đang vận chuyển",
//   delivered: "Đã giao hàng",
//   cancelled: "Đã hủy",
// };
const OrderStatusVN = {
  pending: "Đang chờ xác nhận",
  paid: "Đã thanh toán",
  failed: "Thất bại",
};
const getOrderStatusVN = (status) => {
  return OrderStatusVN[status] || "Không xác định";
};

const OrderView = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;
    OrderService.getOrderById(id)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
      });
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <>
      <Preloader />
      <div className="axil-dashboard-order-view">
        <p>
          Mã đơn hàng <strong>#{order.id}</strong> được đặt vào lúc{" "}
          <strong>{new Date().toLocaleDateString()}</strong>
        </p>
        <div className="order-details">
          <h2 className="block-title">Chi tiết đơn hàng</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {order.orderDetails.map((item) => (
                <tr key={item.product.id}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatVND(item.product.price)}</td>
                  <td>{formatVND(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot> 
              <tr>
                <th colSpan="3">Tổng cộng:</th>
                <th>{formatVND(order.totalAmount)}</th>
              </tr>
              <tr>
                <th colSpan="3">Phương thức thanh toán:</th>
                <th>{order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "VNPay"}</th>
              </tr>
              <tr>
                <th colSpan="3">Trạng thái thanh toán:</th>
                <th>{getOrderStatusVN(order.paymentStatus)}</th>
              </tr> 
            </tfoot>
          </table>
        </div>
        <div className="order-address">
          <h2 className="block-title">Thông tin giao hàng</h2>
          <address>
            {order.user.fullName} <br />
            {order.shippingAddress}
            <br />
            <p className="address-phone">
              <i className="far fa-phone"></i> {order.user.phoneNumber || "Không có"}
            </p>
            <p className="address-email">
              <i className="far fa-envelope"></i> {order.user.email}
            </p>
          </address>
        </div>
      </div>
    </>

  );
};

export default OrderView;
