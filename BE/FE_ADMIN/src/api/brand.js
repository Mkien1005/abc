import apiClient from "../services/data_config";

// Create a new brand
export const createNewBrand = async (data) => {
  const response = await apiClient.post("/brand", data);
  return response.data;
};

// Get all brands with optional pagination parameters
export const getBrands = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/brand", {
    params: { page, limit },
  });
  return response.data;
};

// Get a single brand by ID
export const getBrandById = async (id) => {
  const response = await apiClient.get(`/brand/${id}`);
  return response.data;
};

// Update an existing brand
export const updateBrand = async (id, data) => {
  const response = await apiClient.patch(`/brand/${id}`, data);
  return response.data;
};

// Delete a brand
export const deleteBrand = async (id) => {
  const response = await apiClient.delete(`/brand/${id}`);
  return response.data;
};
