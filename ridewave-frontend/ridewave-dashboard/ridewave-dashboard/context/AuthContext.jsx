"use client"

import { useState, createContext, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import axios from "../lib/axios"

const AuthContext = createContext()

function computeAuthBase() {
  // Prefer explicit env var if set, else derive from location
  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  // envBase is expected to include /api at end (as configured)
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      return 'http://localhost:3000/api/auth'
    }
  }
  if (envBase) {
    // ensure no trailing slash then append /auth if not present
    const trimmed = envBase.replace(/\/+$/, '')
    if (trimmed.endsWith('/api')) {
      return trimmed + '/auth'.replace('//','/')
    }
    return trimmed + '/auth'
  }
  return 'https://ridewave-backend-vfhb.onrender.com/api/auth'
}

export function AuthProvider({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const AUTH_BASE = computeAuthBase()

  // On mount, check localStorage for token
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      // Optionally, fetch user profile (if backend provides /auth/me)
      axios.get(AUTH_BASE + '/me').then(res => {
        // if backend doesn't have /me this will likely 404; ignore
        if (res.data && res.data.user) setUser(res.data.user)
      }).catch(()=>{
        // ignore
      }).finally(()=> setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await axios.post(AUTH_BASE + "/login", { email, password })
    const token = res.data.token
    if (!token) throw new Error('No token returned from backend')
    localStorage.setItem("token", token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    // try to decode username from JWT? we'll just set a minimal user object
    setUser({ email })
    router.push("/dashboard")
  }

  const signup = async (username, email, password) => {
    // backend signup expects username, email, password, role, phone
    await axios.post(AUTH_BASE + "/signup", { username, email, password })
    // after successful signup, auto-login
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
