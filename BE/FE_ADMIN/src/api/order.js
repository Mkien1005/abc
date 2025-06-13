import apiClient from "../services/data_config";

// Get all orders with optional pagination parameters
export const getOrders = async (page = 1, limit = 10, query = "") => {
  const response = await apiClient.get("/admin/order", {
    params: { page, limit, query },
  });
  return response.data;
};

// Get a single order by ID
export const getOrderById = async (id) => {
  const response = await apiClient.get(`/admin/order/${id}`);
  return response.data;
};

// Update an existing order
export const updateOrder = async (id, data) => {
  const response = await apiClient.patch(`/admin/order/${id}`, data);
  return response.data;
};
