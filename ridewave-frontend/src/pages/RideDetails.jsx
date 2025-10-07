import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const RideDetails = () => {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [riderName, setRiderName] = useState("Loading...");
  const [driverName, setDriverName] = useState("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const { data } = await axios.get(`/api/rides/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRide(data);

        if (data.rider) {
          const riderRes = await axios.get(`/api/users/${data.rider}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setRiderName(riderRes.data.username);
        }

        if (data.driver) {
          const driverRes = await axios.get(`/api/users/${data.driver}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setDriverName(driverRes.data.username);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load ride details");
      }
    };
    fetchRide();
  }, [id]);

  if (!ride) return <p className="text-center mt-10">Loading ride details...</p>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">🚖 Ride Receipt</h2>

      <p className="text-sm text-gray-500 mb-4 text-center">📅 {formatDate(ride.createdAt)}</p>

      <p><strong>Rider:</strong> {riderName}</p>
      <p><strong>Driver:</strong> {driverName}</p>
      <p><strong>From:</strong> {ride.pickupLocation}</p>
      <p><strong>To:</strong> {ride.destination}</p>
      <p><strong>Fare:</strong> KES {ride.fare}</p>

      {ride.status === "completed" && (
        <div className="mt-4 text-center">
          <p className="text-orange-600 font-semibold">✔ Completed (Pending Payment)</p>
          <button
            onClick={() => navigate(`/payments/${ride._id}`)}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Pay Now
          </button>
        </div>
      )}
      {ride.status === "paid" && (
        <p className="text-green-600 font-semibold mt-4 text-center">✅ Ride Paid</p>
      )}
      {ride.status === "cancelled" && (
        <p className="text-red-600 font-semibold mt-4 text-center">❌ Ride Cancelled</p>
      )}
    </div>
  );
};

export default RideDetails;
