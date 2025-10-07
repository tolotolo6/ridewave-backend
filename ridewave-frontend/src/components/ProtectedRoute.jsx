// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, role, children }) {
  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a role is required and user doesn't have it, redirect to home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // User is logged in and has proper role (if required)
  return children;
}
