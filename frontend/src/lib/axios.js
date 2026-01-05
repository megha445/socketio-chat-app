import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:3000/api/" 
    : "https://socketio-chat-app-00va.onrender.com/api/",
  withCredentials: true,
});