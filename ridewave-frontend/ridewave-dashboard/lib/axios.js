import axios from "axios";

// Default baseURL points to environment variable if present, otherwise localhost.
const baseURL =
  (process.env.NEXT_PUBLIC_API_BASE_URL &&
    process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "")) ||
  "http://localhost:3000/api";

// Override for production Render deployment
const isProduction = process.env.NODE_ENV === "production";
const finalBaseURL = isProduction
  ? "https://ridewave-backend-vfhb.onrender.com/api"
  : baseURL;

const instance = axios.create({
  baseURL: finalBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
