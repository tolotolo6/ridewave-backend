import { useState, useEffect } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Rides() {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchRides = async () => {
      try {
        const res = await API.get("/rides", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRides(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch rides");
      }
    };
    fetchRides();
  }, [user]);

  if (!user) return <p>Please login to view rides.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Rides</h2>
      {rides.length === 0 ? (
        <p>No rides found.</p>
      ) : (
        <ul className="space-y-2">
          {rides.map((ride) => (
            <li key={ride._id} className="border p-2 rounded">
              {ride.origin} → {ride.destination} | Status: {ride.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
