import axios from "axios";

// export const BASE_URL = "https://tcophar.click/api";
export const BASE_URL = "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cờ để tránh lặp lại yêu cầu refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Xử lý chuyển hướng đến trang đăng nhập
const redirectToLogin = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/#/login";
};

// Interceptor thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    //Nếu không có token, chuyển hướng về trang đăng nhập
    if (!token) {
      redirectToLogin();
      return Promise.reject(new Error("Không có access token"));
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý response
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu gặp lỗi 401 và chưa từng refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          redirectToLogin();
          return Promise.reject(error);
        }

        // Gửi yêu cầu làm mới token
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refresh_token: refreshToken,
        });

        const { access_token: newToken, refresh_token: newRefreshToken } =
          response.data;

        // Lưu lại token mới vào localStorage
        localStorage.setItem("access_token", newToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        // Cập nhật header cho yêu cầu ban đầu
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        return await axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Xóa token và chuyển hướng đến trang đăng nhập
        redirectToLogin();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
