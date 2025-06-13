import apiClient from "../services/data_config";

// Create a new category
export const createNewCategory = async (data) => {
  const response = await apiClient.post("/category", data);
  return response.data;
};

// Get all categorys with optional pagination parameters
export const getCategories = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/category", {
    params: { page, limit },
  });
  return response.data;
};

// Get a single category by ID
export const getCategoryById = async (id) => {
  const response = await apiClient.get(`/category/${id}`);
  return response.data;
};

// Update an existing category
export const updateCategory = async (id, data) => {
  const response = await apiClient.patch(`/category/${id}`, data);
  return response.data;
};

// Delete a category
export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/category/${id}`);
  return response.data;
};
