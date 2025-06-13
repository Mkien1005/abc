import apiClient from './data_config'
import { Order } from './api'
import { Payment } from './api'

export class OrderService {
  static createOrder(data) {
    return apiClient.post(Order, data)
  }

  static getOders(id, params) {
    const { page = 1, limit = 9 } = params || {}
    return apiClient.get(`${Order}/product/${id}`, { page, limit })
  }

  static getOrderById(orderId) {
    return apiClient.get(`${Order}/${orderId}`)
  }

  static deleteOrder(id) {
    return apiClient.delete(`${Order}/${id}`)
  }

  static getOrderAll() {
    return apiClient.get(`${Order}`)
  }

  static vnpay(data) {
    return apiClient.post(`${Payment}/create`, data)
  }
}
