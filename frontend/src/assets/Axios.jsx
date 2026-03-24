import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // This works with your Vite/CRA proxy
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://url-shortner-backend-zzmm.vercel.app/api", // This works with your Vite/CRA proxy
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// export default api;
