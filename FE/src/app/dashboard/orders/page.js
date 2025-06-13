"use client";
import Link from "next/link";
import { OrderService } from "@/services/order_service";
import { useEffect, useState } from "react";
const OrderStatusVN = {
  pending: "Đang chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang vận chuyển",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
};

const getOrderStatusVN = (status) => {
  return OrderStatusVN[status] || "Không xác định";
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    OrderService.getOrderAll()
      .then((res) => {
        setOrders(res.data.items);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      });
  }, []);

  return (
    <div className="axil-dashboard-order">
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Mã đơn</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Tổng tiền</th>
              <th scope="col">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <th scope="row">#{order.id}</th>
                  <td>{getOrderStatusVN(order.status)}</td>
                  <td>{order.totalAmount.toLocaleString()} VND</td>
                  <td>
                    <Link
                      href={`/dashboard/orders/view/${order.id}`}
                      className="axil-btn view-btn"
                    >
                      Xem
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrders;