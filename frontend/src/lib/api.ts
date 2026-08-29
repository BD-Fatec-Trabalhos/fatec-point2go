import axios from "axios";

// URL base da API Django. Ajustável via .env do frontend (VITE_API_URL).
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
