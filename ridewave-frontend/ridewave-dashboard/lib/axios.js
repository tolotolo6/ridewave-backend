import axios from "axios"

// Default baseURL points to environment variable if present, otherwise localhost.
const baseURL = (process.env.NEXT_PUBLIC_API_BASE_URL && process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, '')) || 'http://localhost:3000/api'

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
})

export default instance
