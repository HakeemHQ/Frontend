import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://hakeem1.runasp.net",
  timeout: 10000,
});
