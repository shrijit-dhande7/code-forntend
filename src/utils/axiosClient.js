import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://code-backend-zeta.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Add interceptor to attach token from localStorage
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // adjust key name if different
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
