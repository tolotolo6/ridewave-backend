import axios from "axios";

// Determine environment
const isProduction = process.env.NODE_ENV === "production";

// Set baseURL based on environment
const baseURL = isProduction
  ? "https://ridewave-backend-vfhb.onrender.com/api" // ✅ Render live backend
  : "http://localhost:5000/api"; // ✅ Local backend

// Create Axios instance
const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Export instance
export default instance;
