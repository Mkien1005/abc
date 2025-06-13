"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Section from "@/components/elements/Section";
import Footer from "@/components/footer/Footer";
import HeaderFive from "@/components/header/HeaderFive";
import ServiceTwo from "@/components/services/ServiceTwo";
import { CartService } from "@/services/cart_service";
import Swal from "sweetalert2";
import { UserService } from "@/services/user_service";
import { OrderService } from "@/services/order_service";
import { formatVND } from "@/utils/formatVND";
import Preloader from "@/components/preloader/Preloader";
import { eventBus } from "@/utils/eventBus";

const PaymentMethod = {
  COD: "cod",
  BANK_TRANSFER: "bank_transfer",
  VNPAY_QR: "vnpay_qr",
};
const Checkout = () => {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  useEffect(() => {
    let isMounted = true;

    CartService.getCart()
      .then((data) => {
        if (isMounted) setCartProducts(data.data);
      })
      .catch(() => {
        Swal.fire({
          title: "Error",
          text: "Lỗi hệ thống, vui lòng thử lại sau",
          icon: "error",
        });
      });

    UserService.getInfoUser().then((res) => {
      if (isMounted) setUserInfo(res.data.data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      paymentMethod: PaymentMethod.COD,
    },
  });
  const paymethod = watch("paymentMethod");
  const checkoutFormHandler = (data) => {
    if (cartProducts.cartDetails && cartProducts.cartDetails.length > 0) {
      if (data.paymentMethod === PaymentMethod.COD) {
        OrderService.createOrder({
          shippingAddress: userInfo.address,
          paymentMethod: data.paymentMethod,
          orderDetails: cartProducts.cartDetails.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          note: data.note || "",
        })
          .then(async (response) => {
            const cartDetailIds = cartProducts.cartDetails.map(
              (item) => item.id
            );
            for (const id of cartDetailIds) {
              await CartService.removeProductFromCart(id);
            }
            eventBus.emit("cartUpdated");
            Swal.fire({
              title: "Thành công",
              text: "Đặt hàng thành công!",
              icon: "success",
            });
            router.push(
              `${window.location.origin}/checkout/order-received/${response.data.id}`
            );
          })
          .catch((error) => {
            Swal.fire({
              title: "Lỗi",
              text: error.message || "Đã xảy ra lỗi khi đặt hàng",
              icon: "error",
            });
          });
      } else if (data.paymentMethod === PaymentMethod.VNPAY_QR) {
        OrderService.vnpay({
          amount: cartProducts.cartDetails.reduce(
            (total, item) =>
              total +
              (item?.salePrice ?? item?.product?.price ?? 0) *
                (item?.quantity ?? 0),
            0
          ),
          orderInfo: "Thanh toán đơn hàng",
          orderType: "billpayment",
          ipAddress: "127.0.0.1",
        })
          .then((res) => {
            window.location.href = res.data.data;
          })
          .catch((error) => {
            Swal.fire({
              title: "Lỗi",
              text: error.message || "Đã xảy ra lỗi khi thanh toán",
              icon: "error",
            });
          });
      }
    }
  };

  return (
    <>
      <Preloader />
      <HeaderFive headerSlider />
      <main className="main-wrapper">
        <Section pClass="axil-checkout-area">
          {cartProducts.cartDetails && cartProducts.cartDetails.length > 0 ? (
            <form onSubmit={handleSubmit(checkoutFormHandler)}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="axil-checkout-billing">
                    <h4 className="title mb--40">Chi tiết hóa đơn</h4>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>
                            Họ và tên <span>*</span>
                          </label>
                          <input
                            type="text"
                            placeholder={userInfo.fullName}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>
                            Địa chỉ <span>*</span>
                          </label>
                          <input
                            type="text"
                            placeholder={userInfo.address}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>
                            Phone <span>*</span>
                          </label>
                          <input
                            type="number"
                            placeholder={userInfo.phoneNumber}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>
                            Email <span>*</span>
                          </label>
                          <input
                            type="email"
                            placeholder={userInfo.email}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>Ghi chú khác (Có thể để trống)</label>
                          <textarea
                            rows="2"
                            {...register("note")}
                            placeholder="Ghi chú về đơn hàng của bạn, ví dụ ghi chú cho việc vận chuyển"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="axil-order-summery order-checkout-summery">
                    <h5 className="title mb--20">Đơn hàng của bạn</h5>
                    <div className="summery-table-wrap">
                      <table className="table summery-table">
                        <thead>
                          <tr>
                            <th>Sản phẩm</th>
                            <th>Tổng phụ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartProducts.cartDetails.map((items, index) => (
                            <tr className="order-product" key={index}>
                              <td>
                                {items.product.name}{" "}
                                <span className="quantity">
                                  x{items.quantity}
                                </span>
                              </td>
                              <td className="subtotal-product">
                                {formatVND(
                                  items.salePrice
                                    ? items.salePrice * items.quantity
                                    : items.product.price * items.quantity
                                )}{" "}
                              </td>
                            </tr>
                          ))}
                          <tr className="order-total">
                            <td>Tổng giá</td>
                            <td className="order-total-amount">
                              {formatVND(
                                (cartProducts?.cartDetails || []).reduce(
                                  (total, item) =>
                                    total +
                                    (item?.salePrice ??
                                      item?.product?.price ??
                                      0) *
                                      (item?.quantity ?? 0),
                                  0
                                )
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="order-payment-method">
                      <div className="single-payment">
                        <div className="input-group">
                          <input
                            type="radio"
                            {...register("paymentMethod")}
                            id="bank"
                            value={PaymentMethod.BANK_TRANSFER}
                          />
                          <label htmlFor="bank">
                            Chuyển khoản ngân hàng (Sắp ra mắt)
                          </label>
                        </div>
                        <p>
                          Thanh toán trực tiếp vào tài khoản ngân hàng của chúng
                          tôi. Vui lòng sử dụng mã đơn hàng làm tham chiếu thanh
                          toán. Đơn hàng của bạn sẽ không được giao cho đến khi
                          tiền được ghi có vào tài khoản của chúng tôi.
                        </p>
                      </div>

                      <div className="single-payment">
                        <div className="input-group">
                          <input
                            type="radio"
                            {...register("paymentMethod")}
                            id="cod"
                            value={PaymentMethod.COD}
                          />

                          <label htmlFor="cod">Thanh toán khi nhận hàng</label>
                        </div>
                        <p>Thanh toán bằng tiền mặt khi nhận hàng.</p>
                      </div>

                      <div className="single-payment">
                        <div className="input-group justify-content-between align-items-center">
                          <input
                            type="radio"
                            {...register("paymentMethod")}
                            id="vnpay_qr"
                            value={PaymentMethod.VNPAY_QR}
                          />
                          <label htmlFor="vnpay_qr">VNPay</label>
                          <Image
                            src="/images/others/payment.png"
                            height={28}
                            width={156}
                            alt="Thanh toán bằng VNPay"
                          />
                        </div>
                        <p>Thanh toán qua VNPay Qr.</p>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="axil-btn btn-bg-primary checkout-btn"
                    >
                      Thanh toán
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <h4>There is no item for checkout</h4>
              <Link href="/shop" className="axil-btn btn-bg-primary">
                Back to shop
              </Link>
            </div>
          )}
        </Section>
        <ServiceTwo />
      </main>
      <Footer />
    </>
  );
};

export default Checkout;