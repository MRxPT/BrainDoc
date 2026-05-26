import api from "./axios";

export const signup = (data) => api.post("/auth/signup", data);

export const login = (data) => api.post("/auth/login", data);

export const getMe = () => api.get("/users/me");

export const updateMe = (data) => api.put("/users/me", data);

export const deleteMe = () => api.delete("/users/me");
