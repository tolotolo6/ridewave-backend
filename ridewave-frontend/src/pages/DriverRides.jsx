import { useState, useEffect } from "react";
import API from "../api";
import toast from "react-hot-toast";

export default function DriverRides() {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await API.get("/rides"); // fetch all rides
        setRides(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load rides.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRides();
  }, []);

  const handleAcceptRide = async (rideId) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await API.put(`/rides/accept/${rideId}`, {});
      setRides(rides.map(r => (r._id === rideId ? res.data.ride : r)));
      toast.success("Ride accepted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept ride.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Driver Rides</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isLoading && rides.length === 0 && <p>Loading rides...</p>}
      {rides.length === 0 && !isLoading && <p>No rides available.</p>}

      {rides.map((ride) => (
        <div key={ride._id} className="border p-3 mb-2 rounded flex justify-between items-center">
          <div>
            <p>
              {ride.pickup} → {ride.destination} | Fare: KES {ride.fare} | Status: {ride.status}
            </p>
          </div>
          {ride.status === "pending" && (
            <button
              onClick={() => handleAcceptRide(ride._id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
              disabled={isLoading}
            >
              Accept
            </button>
          )}
        </div>
      ))}
    </div>
  );
}


