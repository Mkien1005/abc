// apiServerClient.js - dùng cho server, truyền token thủ công
import axios from "axios";
import { BASE_URL } from "./data_config";

const apiServerClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor thêm token vào header
apiServerClient.interceptors.request.use(
  (config) => {
    // Token will be passed directly in the request config
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiServerClient;
