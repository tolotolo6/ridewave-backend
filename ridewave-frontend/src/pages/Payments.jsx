import { useState, useEffect } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Payments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchPayments = async () => {
      try {
        const res = await API.get("/payments", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPayments(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch payments");
      }
    };
    fetchPayments();
  }, [user]);

  if (!user) return <p>Please login to view payments.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Payments</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <ul className="space-y-2">
          {payments.map((payment) => (
            <li key={payment._id} className="border p-2 rounded">
              Amount: {payment.amount} | Status: {payment.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
