import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5002/api"
      : "https://real-time-chat-app-production-65f6.up.railway.app/api",
  withCredentials: true,
});