import { DashboardStats } from "@/dashboard-stats"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <DashboardStats />
    </div>
  )
}
