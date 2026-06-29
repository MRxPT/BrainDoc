
import axios from "axios";

const api = axios.create({
  baseURL: "https://braindoc.onrender.com/api",
  timeout: 30000, // 30 second timeout — shows error instead of hanging forever
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";

    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/signup");

    // Handle timeout specifically
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return Promise.reject(
        new Error("Server is starting up, please wait a moment and try again.")
      );
    }

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
