import api from "./axios";
export const login = (username, password) =>
  api.post("/auth/login", { username, password });

export const getCategories = () => api.get("/products/categories");
export const getProducts = (params) => api.get("/products", { params });

export const searchProducts = (q, params) =>
  api.get("/products/search", { params: { q, ...params } });

export const getProduct = (id) => api.get(`/products/${id}`);
export const addProduct = (data) => api.post("/products/add", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
