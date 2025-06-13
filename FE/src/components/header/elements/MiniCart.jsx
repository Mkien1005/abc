import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { removeCartItem, miniCartHandler } from "@/store/slices/productSlice";
import { useEffect, useState } from "react";
import { CartService } from "@/services/cart_service";
import { eventBus } from "@/utils/eventBus";
import { calculateTotalPrice } from "@/utils/index";
import { formatVND } from "@/utils/formatVND";

const MiniCart = () => {
  const dispatch = useDispatch();
  const getProducts = useSelector((state) => state.productData);
  const router = useRouter();
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const updateCart = () => {
      CartService.getCart().then((res) => {
        if (res.data) {
          setCartData(res.data);
        }
      });
    };
    updateCart();
    eventBus.on("cartUpdated", updateCart);

    return () => {
      eventBus.off("cartUpdated", updateCart);
    };
  }, []);
  const removeCartHandler = (productId) => {
    CartService.removeProductFromCart(productId).then(() => {
      eventBus.emit("cartUpdated");  
    });
  };

const handleQuantityChange = (cartItemId, newQuantity) => {
  if (newQuantity < 1) return; 

  CartService.updateProductQuantity(cartItemId, newQuantity)
    .then(() => {
      eventBus.emit("cartUpdated");
    })
    .catch((err) => {
      console.error("Không thể cập nhật số lượng", err);
    });
};

  const cartHandler = (data) => {
    dispatch(miniCartHandler(data));
  };

  const miniCartFooterBtnHandler = (data) => {
    router.push(data);
    dispatch(miniCartHandler(false));
  };
  return (
    <>
      <div
        className={`cart-dropdown ${getProducts.isMinicartOpen ? "open" : ""}`}
      >
        <div className="cart-content-wrap">
          <div className="cart-header">
            <h2 className="header-title">Giỏ hàng</h2>
            <button
              className="cart-close sidebar-close"
              onClick={() => cartHandler(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="cart-body">
            <ul className="cart-item-list">
              {cartData &&
              cartData.cartDetails &&
              cartData.cartDetails.length > 0 ? (
                cartData.cartDetails.map((data) => (
                  <li className="cart-item" key={data.product?.id || data.id}>
                    <div className="item-img">
                      {data.product?.image_url?.[0] && (
                        <Image
                          src={data.product.image_url[0]}
                          alt={data.product?.name || "Không có tên"}
                          height={100}
                          width={100}
                        />
                      )}
                      <button
                        className="close-btn"
                        onClick={() => removeCartHandler(data.id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="item-content">
                      <h3 className="item-title">
                        {data.product?.name || "Sản phẩm không xác định"}
                      </h3>
                      <div className="item-price">
                        {formatVND(data.product?.price || 0)}
                        <span> x {data.quantity || 1}</span>
                      </div>
                      <div className="pro-qty item-quantity">
                        <input
                          type="number"
                          className="quantity-input"
                          defaultValue={data.quantity || 1}
                          min={1}
                          onChange={(e) => handleQuantityChange(data.id, parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <h4 className="text-center">Giỏ hàng của bạn đang trống</h4>
              )}
            </ul>
          </div>
          {cartData &&
              cartData.cartDetails &&
              cartData.cartDetails.length > 0 ? (
            <div className="cart-footer">
              <h3 className="cart-subtotal">
                <span className="subtotal-title">Tổng tiền:</span>
                <span className="subtotal-amount">
                  {formatVND(calculateTotalPrice(cartData))}
                </span>
              </h3>
              <div className="group-btn">
                <button
                  className="axil-btn btn-bg-primary viewcart-btn"
                  onClick={() => miniCartFooterBtnHandler("/cart")}
                >
                  Xem giỏ hàng
                </button>
                <button
                  className="axil-btn btn-bg-secondary checkout-btn"
                  onClick={() => miniCartFooterBtnHandler("/checkout")}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {getProducts.isMinicartOpen && (
        <div className="closeMask" onClick={() => cartHandler(false)}></div>
      )}
    </>
  );
};

export default MiniCart;