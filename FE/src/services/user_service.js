import apiClient from './data_config'
import { User } from './api'

export class UserService {
  static getInfoUser() {
    return apiClient.get(`${User}`)
  }

  static updateUser(id, data) {
    return apiClient.patch(`${User}/update`, data)
  }

  static changePassword(data) {
    return apiClient.patch(`${User}/change-password`, data)
  }
}
