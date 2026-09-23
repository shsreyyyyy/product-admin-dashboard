import axios from "axios";
import { getToken, clearToken } from "./auth";
const api = axios.create({ baseURL: "https://dummyjson.com" });
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      if (
        typeof window !== "undefined" &&
        !location.pathname.startsWith("/login")
      )
        location.href = "/login";
    }
    return Promise.reject(err);
  },
);
export default api;
