// src/App.jsx
import React from "react";   
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import Spinner from "./components/Spinner";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rides from "./pages/Rides";
import Payments from "./pages/Payments";
import DriverSetup from "./pages/DriverSetup";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RideDetails from "./pages/RideDetails";


function AppContent() {
  const { loading } = useLoading();

  // Load user from localStorage
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <>
      {loading && <Spinner />}
      <Navbar user={user} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register onRegister={setUser} />} />

        {/* Protected routes */}
        <Route
          path="/rides"
          element={
            <ProtectedRoute user={user}>
              <Rides user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute user={user}>
              <Payments user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-setup"
          element={
            <ProtectedRoute user={user} role="driver">
              <DriverSetup user={user} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <Router>
        <AppContent />
      </Router>
    </LoadingProvider>
  );
}

// inside <Routes>
<Route path="/ride/:id" element={<RideDetails />} />

