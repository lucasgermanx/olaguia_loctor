"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentPosts } from "@/components/admin/recent-posts"
import { RecentUsers } from "@/components/admin/recent-users"

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <RecentPosts />
          <RecentUsers />
        </div>
      </div>
    </AdminLayout>
  )
}
