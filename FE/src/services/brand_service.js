import apiClient from './data_config'
import { Brand } from './api'

export class BrandService {
  static getBrands(id, params) {
    const { page = 1, limit = 9 } = params || {}
    return apiClient.get(`${Brand}`, { page, limit })
  }

  static getBrandById(brandId) {
    return apiClient.get(`${Brand}/${brandId}`)
  }

  static getCategories() {
    return apiClient.get(`${Brand}`)
  }
}
