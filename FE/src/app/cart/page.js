"use client"
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { slugify } from "@/utils";
import {
  updateCartAmount,
} from "@/store/slices/productSlice";
import Footer from "@/components/footer/Footer";
import { useEffect, useState } from "react";
import { calculateTotalPrice2 } from "@/utils/index";
import { CartService } from "@/services/cart_service";
import { eventBus } from "@/utils/eventBus";
import { formatVND } from "@/utils/formatVND";

const Cart = () => {
  const dispatch = useDispatch();
  const [cartProducts, setCartProducts] = useState([]);

  const getCartProduct = async () => {
    const res = await CartService.getCart();
    setCartProducts(res.data.cartDetails);
  };
  useEffect(() => {
    getCartProduct();
  }, []);
  const removeCartHandler = (data) => {
    CartService.removeProductFromCart(data).then(() => {
      async function getCartProduct() {
        const res = await CartService.getCart();
        setCartProducts(res.data.cartDetails);
        getCartProduct();
      }
      getCartProduct();
      eventBus.emit("cartUpdated");
    });
  };

  const quantityIncreaseHandler = (data) => {
    CartService.updateProductQuantity(data.id, data.quantity + 1)
      .then(() => {
        eventBus.emit("cartUpdated");
        getCartProduct();
      })
      .catch((err) => {
        console.error("Failed to update quantity", err);
      });
  };
  const quantityDecreaseHandler = (data) => {
    CartService.updateProductQuantity(data.id, data.quantity - 1)
      .then(() => {
        eventBus.emit("cartUpdated");
        getCartProduct();
      })
      .catch((err) => {
        console.error("Failed to update quantity", err);
      });
  };

  const updateCartHandler = () => {
    dispatch(updateCartAmount());
  };
  return (
    <>
      <main className="main-wrapper">
        <div className="axil-product-cart-area axil-section-gap">
          <div className="container">
            {cartProducts.length > 0 ? (
              <div className="axil-product-cart-wrap">
                <div className="product-table-heading">
                  <h4 className="title">Your Cart</h4>
                </div>
                <div className="table-responsive">
                  <table className="table axil-product-table axil-cart-table mb--40">
                    <thead>
                      <tr>
                        <th scope="col" className="product-remove" />
                        <th scope="col" className="product-thumbnail">
                          Hình ảnh
                        </th>
                        <th scope="col" className="product-title">
                          Tên sản phẩm
                        </th>
                        <th scope="col" className="product-price">
                          Giá
                        </th>
                        <th scope="col" className="product-quantity">
                          Số lượng
                        </th>
                        <th scope="col" className="product-subtotal">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartProducts.map((item) => (
                        <tr key={item.product.id}>
                          <td className="product-remove">
                            <button
                              className="remove-wishlist"
                              onClick={() => removeCartHandler(item.id)}
                            >
                              <i className="fal fa-times" />
                            </button>
                          </td>
                          <td className="product-thumbnail">
                            <Link
                              href={`/products/${slugify(item.product.id)}`}
                            >
                              <Image
                                src={
                                  item.product.image_url.length > 0
                                    ? item.product.image_url[0]
                                    : ""
                                }
                                width={80}
                                height={80}
                                alt={item.product.name}
                              />
                            </Link>
                          </td>
                          <td className="product-title">
                            <Link
                              href={`/products/${slugify(item.product.id)}`}
                            >
                              {item.product.name}
                            </Link>
                          </td>
                          <td className="product-price" data-title="Price">
                            {formatVND(
                              item.product.salePrice
                                ? item.product.salePrice
                                : item.product.price
                            )}
                          </td>
                          <td className="product-quantity" data-title="Qty">
                            <div className="pro-qty">
                              <span
                                className="qtybtn"
                                onClick={() => quantityDecreaseHandler(item)}
                              >
                                -
                              </span>
                              <input
                                type="number"
                                className="quantity-input"
                                value={item.quantity}
                                readOnly
                              />
                              <span
                                className="qtybtn"
                                onClick={() => quantityIncreaseHandler(item)}
                              >
                                +
                              </span>
                            </div>
                          </td>
                          <td
                            className="product-subtotal"
                            data-title="Subtotal"
                          >
                            {formatVND(
                              item.product.salePrice
                                ? item.product.salePrice * item.product.quantity
                                : item.product.price * item.quantity
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="cart-update-btn-area">
                  <div className="update-btn">
                    <button
                      className="axil-btn btn-outline"
                      onClick={() => updateCartHandler()}
                    >
                      Cập nhật giỏ hàng
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-5 col-lg-7 offset-xl-7 offset-lg-5">
                    <div className="axil-order-summery mt--80">
                      <h5 className="title mb--20">Thanh toán</h5>
                      <div className="summery-table-wrap">
                        <table className="table summery-table mb--30">
                          <tbody>
                            <tr className="order-total">
                              <td>Total</td>
                              <td className="order-total-amount">
                                {formatVND(calculateTotalPrice2(cartProducts))}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <Link
                        href="/checkout"
                        className="axil-btn btn-bg-primary checkout-btn"
                      >
                        Tiến hành đặt hàng
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h4>Your Cart is empty</h4>
                <Link className="axil-btn btn-bg-primary" href="/shop">
                  Back to shop
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
