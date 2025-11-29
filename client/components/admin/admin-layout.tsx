"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FileText, Users, Tag, Folder, LogOut, Menu, X, Megaphone, Layout, UserCheck } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Verificar se é mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/admin/login")
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Posts", href: "/admin/posts", icon: FileText },
    { name: "Profissionais", href: "/admin/professionals", icon: UserCheck },
    { name: "Configurar Home", href: "/admin/home-config", icon: Layout },
    { name: "Anúncios", href: "/admin/ads", icon: Megaphone },
    { name: "Usuários", href: "/admin/users", icon: Users },
    { name: "Categorias", href: "/admin/categories", icon: Folder },
    { name: "Tags", href: "/admin/tags", icon: Tag },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-navy-950 text-white w-64 fixed inset-y-0 z-50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
      >
        <div className="p-4 flex justify-between items-center">
          <Link href="/admin" className="flex items-center">
            <Image 
              src="/images/logo-olaguia.png" 
              alt="Logo" 
              width={150} 
              height={40} 
              className="h-8 w-auto"
              onError={(e) => {
                // Fallback se a imagem não existir
                e.currentTarget.style.display = 'none'
              }}
            />
          </Link>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} className="text-white lg:hidden">
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    pathname === item.href ? "bg-navy-900 text-gold" : "hover:bg-navy-900"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-white border-white hover:bg-navy-900 bg-transparent"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sair</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(true)} className="mr-4 lg:hidden">
              <Menu size={24} />
            </button>
          )}
          <h1 className="text-xl font-semibold text-gray-800">Painel Administrativo</h1>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}
