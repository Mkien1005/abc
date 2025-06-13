import apiClient from "./data_config";
import { Cart } from "./api";

export class CartService {
  static getCart() {
    return apiClient.get(`${Cart}`);
  }

  static addProductToCart(productId, quantity) {
    return apiClient.post(`${Cart}-details`, { productId, quantity });
  }

  static updateProductQuantity(cartId, quantity) {
    return apiClient.patch(`${Cart}-details/${cartId}`, { quantity });
  }

  static removeProductFromCart(cartId) {
    return apiClient.delete(`${Cart}-details/${cartId}`);
  }
}
