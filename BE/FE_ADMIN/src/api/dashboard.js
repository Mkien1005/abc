import apiClient from "../services/data_config";

export const getCountCurrentUsers = async () => {
  const res = await apiClient.get("/users/count-current-users");
  return res.data.data;
};

export const getCountNewUsersLastMonth = async () => {
  const res = await apiClient.get("/users/count-new-last-month");
  return res.data.data;
};

export const getSuccessfulOrdersCurrentMonth = async () => {
  const res = await apiClient.get("/order/monthly-comparison");
  return res.data;
};

export const getSuccessfulOrdersSummary = async () => {
  const res = await apiClient.get("/order/summary-success");
  return res.data.data;
};

export const countThisMonthSuppliers = async () => {
  const res = await apiClient.get("/suppliers/count-this-month");
  return res.data.data;
};

export const getCountProduct = async () => {
  const res = await apiClient.get("/products/statistics/total");
  return res.data;
};

export const getDashboardStats = () => {
  return apiClient.get("/dashboard/stats");
};

export const getRevenueStats = () => {
  return apiClient.get("/dashboard/revenue");
};

export const getCustomerStats = () => {
  return apiClient.get("/dashboard/customers");
};

export const getOrderStats = () => {
  return apiClient.get("/dashboard/orders");
};

export const getProductStats = () => {
  return apiClient.get("/dashboard/products");
};

export const getMonthlyStats = () => {
  return apiClient.get("/dashboard/monthly");
};

export const getCategoryStats = () => {
  return apiClient.get("/dashboard/categories");
};

export const getTopProducts = () => {
  return apiClient.get("/dashboard/top-products");
};
