import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const { data } = await axios.get("/api/rides/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRides(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load rides");
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading rides...</p>;

  if (rides.length === 0) {
    return <p className="text-center mt-10">No rides found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-6">My Rides</h2>
      <div className="space-y-4">
        {rides.map((ride) => (
          <div key={ride._id} className="p-4 border rounded-lg shadow bg-white">
            <p><strong>From:</strong> {ride.pickupLocation}</p>
            <p><strong>To:</strong> {ride.destination}</p>
            <p><strong>Fare:</strong> KES {ride.fare}</p>
            <p><strong>Status:</strong> {ride.status}</p>

            {ride.driver && ride.driverProfile && (
              <div className="mt-2 p-2 border-t">
                <h4 className="font-semibold">Driver Info</h4>
                <p>{ride.driver.name} ({ride.driver.email})</p>
                <p>Vehicle: {ride.driverProfile.vehicleModel} - {ride.driverProfile.vehiclePlate}</p>
                <p>Color: {ride.driverProfile.vehicleColor}</p>
                <p>License: {ride.driverProfile.licenseNumber}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRides;
