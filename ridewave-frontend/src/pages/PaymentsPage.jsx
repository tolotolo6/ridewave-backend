import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const PaymentsPage = () => {
  const [rides, setRides] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ridesRes, paymentsRes] = await Promise.all([
          axios.get("/api/rides/my", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          axios.get("/api/payments/my", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);
        setRides(ridesRes.data);
        setPayments(paymentsRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePay = async (rideId, fare) => {
    setPaying(rideId);
    try {
      await axios.post(
        "/api/payments/pay",
        { rideId, amount: fare },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Payment initiated!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setPaying(null);
    }
  };

  const isRidePaid = (rideId) =>
    payments.some((p) => p.ride?._id === rideId && p.status === "completed");

  if (loading) return <p className="text-center mt-10">Loading rides...</p>;

  if (rides.length === 0) {
    return <p className="text-center mt-10">No rides found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-6">My Rides (Pay for Completed)</h2>
      <div className="space-y-4">
        {rides.map((ride) => (
          <div key={ride._id} className="p-4 border rounded-lg shadow bg-white">
            <p><strong>From:</strong> {ride.pickupLocation}</p>
            <p><strong>To:</strong> {ride.destination}</p>
            <p><strong>Fare:</strong> KES {ride.fare}</p>
            <p><strong>Status:</strong> {ride.status}</p>

            {ride.status === "completed" && !isRidePaid(ride._id) && (
              <button
                onClick={() => handlePay(ride._id, ride.fare)}
                disabled={paying === ride._id}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {paying === ride._id ? "Processing..." : `Pay KES ${ride.fare}`}
              </button>
            )}

            {ride.status === "paid" && (
  <p className="mt-3 text-green-600 font-semibold">✅ Ride Paid</p>
)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentsPage;
