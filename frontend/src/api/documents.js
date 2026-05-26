import api from "./axios";

export const uploadDocument = (formData, onProgress) =>
  api.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });

export const listDocuments = () => api.get("/documents/");

export const getDocument = (docId) => api.get(`/documents/${docId}`);

export const deleteDocument = (docId) => api.delete(`/documents/${docId}`);

export const askQuestion = (docId, question, sessionId = null) =>
  api.post(`/chat/${docId}/ask`, { question, session_id: sessionId });

export const listSessions = (docId) => api.get(`/chat/${docId}/sessions`);

export const getSession = (sessionId) => api.get(`/chat/sessions/${sessionId}`);

export const deleteSession = (sessionId) =>
  api.delete(`/chat/sessions/${sessionId}`);
