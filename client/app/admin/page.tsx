import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentPosts } from "@/components/admin/recent-posts"
import { RecentUsers } from "@/components/admin/recent-users"

// Função para verificar se o usuário está autenticado e é admin
async function getAuthStatus() {
  // Em um ambiente real, você verificaria o cookie/token do servidor
  // Para este exemplo, vamos apenas verificar se existe um token no localStorage
  // Isso é apenas para demonstração - em produção, use uma verificação do lado do servidor

  // Como não podemos acessar localStorage no servidor, vamos simular que o usuário está autenticado
  return { isAuthenticated: true, isAdmin: true }
}

export default async function AdminDashboardPage() {
  const { isAuthenticated, isAdmin } = await getAuthStatus()

  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  // Redirecionar para uma página de acesso negado se não for admin
  if (!isAdmin) {
    redirect("/admin/access-denied")
  }

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
