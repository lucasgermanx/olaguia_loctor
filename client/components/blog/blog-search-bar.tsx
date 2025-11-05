"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

interface BlogSearchBarProps {
  initialValue?: string
}

export function BlogSearchBar({ initialValue = "" }: BlogSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      router.push("/blog")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Buscar artigos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
      />
      <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search className="h-5 w-5" />
      </button>
    </form>
  )
}
