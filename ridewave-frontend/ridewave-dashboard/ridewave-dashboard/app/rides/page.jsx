import ProtectedRoute from "../../components/ProtectedRoute"
export default function RidesPage(){
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-4">Rides</h1>
        <p>Rides listing will appear here.</p>
      </div>
    </ProtectedRoute>
  )
}
