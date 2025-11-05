"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Folder, Tag } from "lucide-react"

interface Stats {
  posts: number
  users: number
  categories: number
  tags: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    users: 0,
    categories: 0,
    tags: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statItems = [
    {
      title: "Posts",
      value: stats.posts,
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Usuários",
      value: stats.users,
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Categorias",
      value: stats.categories,
      icon: Folder,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Tags",
      value: stats.tags,
      icon: Tag,
      color: "bg-amber-100 text-amber-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <div className={`p-2 rounded-full ${item.color}`}>
              <item.icon size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" /> : item.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
