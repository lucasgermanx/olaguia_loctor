"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Plus, UserCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "MEMBER"
  created_at: string
}

export function RecentUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:1003"}/admin/users?page=1&per_page=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUsers(data.users)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Usuários Recentes</CardTitle>
        <Button asChild size="sm" className="bg-navy-950 hover:bg-navy-900">
          <Link href="/admin/users/new">
            <Plus size={16} className="mr-2" />
            Novo Usuário
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <UserCircle className="h-8 w-8 text-gray-400 mr-3" />
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>
                    {user.role === "ADMIN" ? "Admin" : "Membro"}
                  </Badge>
                  <Button asChild size="icon" variant="outline">
                    <Link href={`/admin/users/edit/${user.id}`}>
                      <Edit size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">Nenhum usuário encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
