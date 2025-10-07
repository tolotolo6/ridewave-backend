import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [rides, setRides] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRides();
    fetchPayments();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await axios.get(
        "https://ridewave-backend-vfhb.onrender.com/api/rides",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRides(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching rides");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        "https://ridewave-backend-vfhb.onrender.com/api/payment/mine",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching payments");
    }
  };

  const handlePayment = async (rideId, amount) => {
    const phoneNumber = prompt("Enter your phone number (2547XXXXXXXX)");

    if (!phoneNumber) return;

    try {
      const res = await axios.post(
        "https://ridewave-backend-vfhb.onrender.com/api/payment/stkpush",
        { rideId, phoneNumber, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("STK Push sent! Check your phone to complete payment.");
      console.log(res.data);
      fetchPayments(); // refresh payments after STK push
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Payment failed");
    }
  };

  if (loading) return <p className="p-6">Loading rides...</p>;

  const upcomingRides = rides.filter(r => r.status === "pending" || r.status === "accepted");
  const completedRides = rides.filter(r => r.status === "completed");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Rider Dashboard 🚖</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Upcoming Rides</h2>
        {upcomingRides.length === 0 ? (
          <p>No upcoming rides</p>
        ) : (
          <div className="flex flex-col gap-4">
            {upcomingRides.map(ride => (
              <div key={ride._id} className="border p-4 rounded shadow flex justify-between items-center">
                <div>
                  <p><strong>From:</strong> {ride.pickup} → <strong>To:</strong> {ride.destination}</p>
                  <p><strong>Fare:</strong> {ride.fare} KES | <strong>Status:</strong> {ride.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Completed Rides & Payments</h2>
        {completedRides.length === 0 ? (
          <p>No completed rides</p>
        ) : (
          <div className="flex flex-col gap-4">
            {completedRides.map(ride => {
              const payment = payments.find(p => p.rideId === ride._id);
              return (
                <div key={ride._id} className="border p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <p><strong>From:</strong> {ride.pickup} → <strong>To:</strong> {ride.destination}</p>
                    <p><strong>Fare:</strong> {ride.fare} KES | <strong>Status:</strong> {ride.status}</p>
                  </div>
                  {!payment ? (
                    <button
                      onClick={() => handlePayment(ride._id, ride.fare)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className="text-green-600 font-semibold">Paid ✅</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">All Payments</h2>
        {payments.length === 0 ? (
          <p>No payments yet</p>
        ) : (
          <div className="flex flex-col gap-4">
            {payments.map(p => (
              <div key={p._id} className="border p-3 rounded shadow flex justify-between items-center">
                <p><strong>Amount:</strong> {p.Amount} KES | <strong>Status:</strong> {p.ResultCode === 0 ? "Success" : "Failed"}</p>
                <p><strong>Date:</strong> {p.TransactionDate}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

