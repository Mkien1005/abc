import apiClient from './data_config'
import { Category } from './api'

export class CategoryService {
  static getProducts(id, params) {
    const { page = 1, limit = 9 } = params || {}
    return apiClient.get(`${Category}/product/${id}`, { page, limit })
  }

  static getCategoryById(categoryId) {
    return apiClient.get(`${Category}/${categoryId}`)
  }

  static getCategories() {
    return apiClient.get(`${Category}`)
  }
}
