import axios from "axios";

// Em desenvolvimento, usa o proxy do Vite
// Em produção, usa a URL completa do backend
const BASE_URL = import.meta.env.DEV ? "" : "http://localhost:8080";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
