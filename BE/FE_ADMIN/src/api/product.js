import apiClient from '../services/data_config'

// Create a new product
export const createProduct = async (data) => {
  const response = await apiClient.post('/products', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Get all products with optional pagination parameters
export const getProducts = async (page = 1, limit = 10) => {
  const response = await apiClient.get('/products', {
    params: { page, limit },
  })
  return response.data
}

// Get a single product by ID
export const getProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`)
  return response.data
}

// Update an existing product
export const updateProduct = async (id, data) => {
  const response = await apiClient.patch(`/products/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Delete a product
export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/${id}`)
  return response.data
}
