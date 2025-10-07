// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // remove persistent user
    navigate("/login");
    window.location.reload(); // refresh to clear user-dependent state
  };

{user && (
  <Link to="/my-rides" className="px-3 py-2 hover:text-blue-500">
    My Rides
  </Link>
)}

{user && (
  <Link to="/payment-history" className="px-3 py-2 hover:text-blue-500">
    Payment History
  </Link>
)}

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div className="flex gap-6">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/rides" className="hover:text-gray-300">Rides</Link>
        <Link to="/payments" className="hover:text-gray-300">Payments</Link>
        {user?.role === "driver" && (
          <Link to="/driver-setup" className="hover:text-gray-300">Driver Setup</Link>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/register" className="hover:text-gray-300">Register</Link>
          </>
        ) : (
          <>
            <span className="text-green-400 font-semibold">
              Role: {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}


