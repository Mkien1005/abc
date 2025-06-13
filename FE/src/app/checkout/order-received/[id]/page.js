"use client";

import Section from "@/components/elements/Section";
import Footer from "@/components/footer/Footer";
import HeaderFive from "@/components/header/HeaderFive";
import { OrderService } from "@/services/order_service";
import { formatVND } from "@/utils/formatVND";
import domtoimage from "dom-to-image";
import { jsPDF } from "jspdf";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const OrderReceived = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const orderRef = useRef(null);

  useEffect(() => {
    OrderService.getOrderById(id).then((res) => {
      setOrder(res.data);
    });
  }, [id]);

  const generatePDF = () => {
    if (orderRef.current && order) {
      domtoimage.toPng(orderRef.current)
        .then((dataUrl) => {
          const doc = new jsPDF("p", "mm", "a4");
          const imgWidth = 190;
          const imgHeight = 250;
  
          doc.addImage(dataUrl, "PNG", 10, 10, imgWidth, imgHeight);
          doc.save(`order-${order.id}.pdf`);
        })
        .catch((error) => console.error("Lỗi khi tạo ảnh:", error));
    }
  };

  return (
    <>
      <HeaderFive />
      <main className="main-wrapper">
        <Section pClass="order-received">
          {order && (
            <>
              <button onClick={generatePDF} className="p-3 mb-5 fw-bold">In hóa đơn</button>
              <div ref={orderRef}>
                <h1 className="thank-you-text">Cảm ơn bạn đã đặt hàng.</h1>
                <ul className="order-overview">
                  <li className="px-3 border-end">MÃ ĐƠN HÀNG: <strong>{order.id}</strong></li>
                  <li className="px-3 border-end">EMAIL: <strong>{order.user.email}</strong></li>
                  <li className="px-3 border-end">TỔNG CỘNG: <strong>{formatVND(order.totalAmount)}</strong></li>
                  <li className="px-3 border border-0">PHƯƠNG THỨC THANH TOÁN: <strong>Thanh toán khi nhận hàng</strong></li>
                </ul>
                <div className="order-details">
                  <h5>Order details</h5>
                  <table className="table">
                    <thead>
                      <tr><th>Sản phẩm</th><th>Tổng cộng</th></tr>
                    </thead>
                    <tbody>
                      {order.orderDetails.map((data, index) => (
                        <tr key={index}>
                          <td>{data.product.name} <strong>X {data.quantity}</strong></td>
                          <td>{formatVND(data.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr><th>Đơn giá:</th><th>{formatVND(order.totalAmount)}</th></tr>
                      <tr><th>Phương thức thanh toán:</th><th>Thanh toán khi nhận hàng</th></tr>
                      <tr><th>Tổng cộng:</th><th>{formatVND(order.totalAmount)}</th></tr>
                    </tfoot>
                  </table>
                </div>
                <div className="customer-details">
                  <h5>Shipping address</h5>
                  <address>
                    {order.user.fullName} <br />
                    {order.shippingAddress} <br />
                    <p><i className="far fa-phone"></i> {order.user.phoneNumber}</p>
                    <p><i className="far fa-envelope"></i> {order.user.email}</p>
                  </address>
                </div>
              </div>
            </>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
};

export default OrderReceived;