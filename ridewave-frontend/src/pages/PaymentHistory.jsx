import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get("/api/payments/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPayments(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading payments...</p>;

  if (payments.length === 0) {
    return <p className="text-center mt-10">No payments found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment._id} className="p-4 border rounded-lg shadow bg-white">
            <p><strong>Amount:</strong> KES {payment.amount}</p>
            <p><strong>Status:</strong> {payment.status}</p>
            <p><strong>Reference:</strong> {payment.reference}</p>
            <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}</p>

            {payment.ride && (
              <div className="mt-3 p-3 bg-gray-100 rounded">
                <p className="font-semibold">Ride Info:</p>
                <p><strong>From:</strong> {payment.ride.pickupLocation}</p>
                <p><strong>To:</strong> {payment.ride.destination}</p>
                <p><strong>Fare:</strong> KES {payment.ride.fare}</p>
                <p><strong>Ride Status:</strong> {payment.ride.status}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;

