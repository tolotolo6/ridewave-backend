"use client"

import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white border-b p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">Ridewave</div>
      {user ? (
        <div>
          <span className="mr-4">Hi, {user.username || user.email}</span>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </div>
      ) : (
        <div>
          <a href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">Login</a>
        </div>
      )}
    </nav>
  )
}
