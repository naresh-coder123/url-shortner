import axios from "axios";

const api = axios.create({
  baseURL: "/api", // This works with your Vite/CRA proxy
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;