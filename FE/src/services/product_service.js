import apiClient from "./data_config";
import { productList } from "./api";
import apiServerClient from "./apiServerClient";

export class ProductService {
  static getProducts(params) {
    const { page = 1, limit = 10, name } = params || {};
    return apiClient.get(productList, {
      params: { page, limit, name },
    });
  }

  static getProductById(productId) {
    console.log("productId :>> ", productId);
    console.log("productList :>> ", apiClient);
    return apiClient.get(`${productList}/${productId}`);
  }

  static searchProducts(params) {
    return apiClient.get(productList, {
      params,
    });
  }

  static getProductByIdPage(productId, token) {
    return apiServerClient.get(`${productList}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  static getProductsPage(params, token) {
    const { page = 1, limit = 10, name } = params || {};
    return apiServerClient.get(productList, {
      params: { page, limit, name },
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
