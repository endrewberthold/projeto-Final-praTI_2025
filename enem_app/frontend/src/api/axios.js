import axios from "axios";
const BASE_URL = "http://localhost:8080";

export default axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
