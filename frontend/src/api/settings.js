import api from "./axios";

export const getAISettings = () => api.get("/settings/ai");

export const saveAISettings = (data) => api.post("/settings/ai", data);

export const deleteAISettings = () => api.delete("/settings/ai");
