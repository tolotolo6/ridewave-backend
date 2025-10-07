import ProtectedRoute from "../../components/ProtectedRoute"
export default function PaymentsPage(){
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-4">Payments</h1>
        <p>Payment history & actions will appear here.</p>
      </div>
    </ProtectedRoute>
  )
}
