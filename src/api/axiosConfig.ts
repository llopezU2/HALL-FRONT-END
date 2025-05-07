// src/api/axiosConfig.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor para inyectar el bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers!["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
