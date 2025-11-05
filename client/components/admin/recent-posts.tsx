"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Plus } from "lucide-react"

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  published_at: string
  created_at: string
}

export function RecentPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:1003"}/posts?page=1&per_page=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts)
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Posts Recentes</CardTitle>
        <Button asChild size="sm" className="bg-navy-950 hover:bg-navy-900">
          <Link href="/admin/posts/new">
            <Plus size={16} className="mr-2" />
            Novo Post
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
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <h3 className="font-medium truncate max-w-[250px]">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(post.published_at || post.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button asChild size="icon" variant="outline">
                    <Link href={`/blog/${post.slug}`}>
                      <Eye size={16} />
                    </Link>
                  </Button>
                  <Button asChild size="icon" variant="outline">
                    <Link href={`/admin/posts/edit/${post.id}`}>
                      <Edit size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">Nenhum post encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
