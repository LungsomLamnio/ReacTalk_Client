export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const API_ENDPOINTS = {
  AUTH: `${BASE_URL}/api/auth`,
  USER: `${BASE_URL}/api/user`,
  MESSAGES: `${BASE_URL}/api/messages`,
};