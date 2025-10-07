// src/pages/RidesPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RidesPage = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCache, setUserCache] = useState({}); // id -> username
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const { data } = await axios.get("/api/rides/my", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRides(data);
      } catch (err) {
        console.error("fetchRides:", err);
        toast.error("Failed to load rides");
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  const fetchUserName = async (id) => {
    if (!id) return "Unknown";
    if (userCache[id]) return userCache[id];

    try {
      const { data } = await axios.get(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const username = data.username || "Unknown";
      setUserCache((prev) => ({ ...prev, [id]: username }));
      return username;
    } catch (err) {
      console.error("fetchUserName error:", err);
      setUserCache((prev) => ({ ...prev, [id]: "Unknown" }));
      return "Unknown";
    }
  };

  // prefetch names for rides
  useEffect(() => {
    rides.forEach((ride) => {
      if (ride.rider) fetchUserName(ride.rider);
      if (ride.driver) fetchUserName(ride.driver);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rides]);

  if (loading) return <p className="text-center mt-10">Loading rides...</p>;
  if (rides.length === 0) return <p className="text-center mt-10">No rides found.</p>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const activeRides = rides.filter((r) => r.status === "requested" || r.status === "accepted");
  const pastRides = rides.filter((r) => ["completed", "paid", "cancelled"].includes(r.status));

  const renderRideCard = (ride) => (
    <div
      key={ride._id}
      className="p-4 border rounded-lg shadow bg-white cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/ride/${ride._id}`)}
    >
      <p className="text-sm text-gray-500 mb-2">📅 {formatDate(ride.createdAt)}</p>
      <p><strong>From:</strong> {ride.pickupLocation}</p>
      <p><strong>To:</strong> {ride.destination}</p>
      <p><strong>Fare:</strong> KES {ride.fare}</p>
      <p><strong>Rider:</strong> {userCache[ride.rider] || (ride.rider ? "Loading..." : "N/A")}</p>
      <p><strong>Driver:</strong> {userCache[ride.driver] || (ride.driver ? "Loading..." : "N/A")}</p>

      <div className="mt-2">
        {ride.status === "requested" && <p className="text-yellow-600 font-semibold">⏳ Requested</p>}
        {ride.status === "accepted" && <p className="text-blue-600 font-semibold">🚖 Accepted</p>}
        {ride.status === "completed" && (
          <div className="mt-2">
            <p className="text-orange-600 font-semibold">✔ Completed (Pending Payment)</p>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/payments/${ride._id}`); }}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Pay Now
            </button>
          </div>
        )}
        {ride.status === "paid" && <p className="text-green-600 font-semibold">✅ Ride Paid</p>}
        {ride.status === "cancelled" && <p className="text-red-600 font-semibold">❌ Cancelled</p>}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 space-y-8">
      <h2 className="text-2xl font-bold mb-6">My Rides</h2>

      <section>
        <h3 className="text-xl font-semibold mb-4">🚖 Active Rides</h3>
        {activeRides.length > 0 ? (
          <div className="space-y-4">{activeRides.map(renderRideCard)}</div>
        ) : (
          <p className="text-gray-500">No active rides.</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">📜 Past Rides</h3>
        {pastRides.length > 0 ? (
          <div className="space-y-4">{pastRides.map(renderRideCard)}</div>
        ) : (
          <p className="text-gray-500">No past rides.</p>
        )}
      </section>
    </div>
  );
};

export default RidesPage;


