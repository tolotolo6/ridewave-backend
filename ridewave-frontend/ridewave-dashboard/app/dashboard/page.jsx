import ProtectedRoute from "../../components/ProtectedRoute"
import { useAuth } from "../../context/AuthContext"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent(){
  const { user } = useAuth()
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome back, {user?.username || user?.email} 👋</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">Quick links</div>
        <div className="p-4 bg-white rounded shadow">Recent activity</div>
      </div>
    </div>
  )
}
