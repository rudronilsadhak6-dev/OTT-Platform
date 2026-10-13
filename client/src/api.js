import axios from "axios";
import { SERVER_URL } from "./config";

// One axios setup for the whole app. The backend runs on port 8000.
const api = axios.create({
  baseURL: `${SERVER_URL}/api`,
});

// Before every request, attach the login token (JWT) if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is expired / wrong, log out and go to the login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Turns any axios error into a message we can show the user
export function errorText(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (!navigator.onLine) return "You are offline. Connect to the internet and try again.";
  return "Cannot reach the server. Check that the backend is running on port 8000.";
}

export default api;
