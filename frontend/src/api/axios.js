import axios from "axios";

const api = axios.create({
  baseURL:import.meta.env.VITE_BACKEND_URL, // backend base URL
  withCredentials: false,               // keep false unless using cookies
});

export default api;
