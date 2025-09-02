import axios from "axios";

const api = axios.create({
  baseURL: "https://nebula-1jpx.onrender.com",
  withCredentials: true,
});

export const loginUser = (userDetails) =>
  api.post("/api/auth/login", userDetails);

export const registerUser = (userDetails) =>
  api.post("/api/auth/register", userDetails);

export default api