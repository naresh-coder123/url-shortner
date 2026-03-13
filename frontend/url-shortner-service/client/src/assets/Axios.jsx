import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/", // This works with your Vite/CRA proxy
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default api;
