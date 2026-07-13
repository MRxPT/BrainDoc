import axios from "axios";

// In development: use Vite proxy (/api → http://127.0.0.1:8000)
// In production:  use the full Render URL
const BASE_URL = import.meta.env.PROD
  ? "https://braindoc.onrender.com/api"
  : "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
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

    // Show a helpful message for timeout / server cold-start
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return Promise.reject(
        new Error("Server is starting up, please wait a moment and try again.")
      );
    }

    // Network error (backend not running locally)
    if (!error.response) {
      return Promise.reject(
        new Error(
          import.meta.env.PROD
            ? "Server is starting up, please wait a moment and try again."
            : "Cannot connect to backend. Make sure the FastAPI server is running on http://localhost:8000"
        )
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
