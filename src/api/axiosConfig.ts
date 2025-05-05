// filepath: c:\Users\carli\Downloads\HALL\frontend\HALL-FRONT-END\src\api\axiosConfig.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // URL del backend en el puerto 3000
  withCredentials: true, // Habilitar el envío de cookies o credenciales
});

export default api;
