import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BASE_URL } from "../services/data_config";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async ({ email, password }) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    const { access_token, refresh_token } = response.data;
    // Lưu cả access token và refresh token
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    const { role } = jwtDecode(access_token);
    localStorage.setItem("role", role);
    return {
      success: true,
      message: "Đăng nhập thành công",
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/sign-in";
};
