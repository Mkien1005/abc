import apiClient from "../services/data_config";

export const getSuppliers = async () => {
  const response = await apiClient.get("/suppliers");
  return response.data;
};

export const createSupplier = async (supplier) => {
  const response = await apiClient.post("/suppliers", supplier);
  return response.data;
};

export const updateSupplier = async (id, supplier) => {
  const response = await apiClient.patch(`/suppliers/${id}`, supplier);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await apiClient.delete(`/suppliers/${id}`);
  return response.data;
};

export const getSupplierById = async (id) => {
  const response = await apiClient.get(`/suppliers/${id}`);
  return response.data;
};
