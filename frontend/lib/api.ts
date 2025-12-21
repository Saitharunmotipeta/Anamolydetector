import axios from "axios";

export const api = axios.create({
  baseURL: process.env.Next_public_url || "http://localhost:8000",
});
