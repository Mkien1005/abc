import apiClient from "../services/data_config";

// 🟢 Tạo phiếu nhập kho
export const createImport = async (data) => {
  const response = await apiClient.post("/inventory-imports", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// 🟡 Lấy danh sách phiếu nhập kho (có phân trang)
export const getImports = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/inventory-imports", {
    params: { page, limit },
  });
  return response.data;
};

// 🔵 Lấy chi tiết phiếu nhập kho theo ID
export const getImportById = async (id) => {
  const response = await apiClient.get(`/inventory-imports/${id}`);
  return response.data;
};

// 🟠 Cập nhật phiếu nhập kho
export const updateImport = async (id, data) => {
  const response = await apiClient.put(`/inventory-imports/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// 🔴 Xóa phiếu nhập kho
export const deleteImport = async (id) => {
  const response = await apiClient.delete(`/inventory-imports/${id}`);
  return response.data;
};
