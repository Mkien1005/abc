import { userForgotPassword, userLogin } from "./api";
import { userRegister } from "./api";
import axios from "axios";
import { logIn } from "../store/slices/authSlice";
import { BASE_URL } from "./data_config";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default class AuthService {
  static login = async (email, password, dispatch) => {
    try {
      const res = await apiClient.post(userLogin, { email, password });
      if (res.status === 201) {
        dispatch(logIn(res.data));
        return res.data;
      }
    } catch (error) {
      throw error;
    }
  };
  static register = async (userData) => {
    return apiClient.post(userRegister, userData);
  };
  static forgotPassword = async (email) => {
    return apiClient.post(userForgotPassword, { email });
  };
}
