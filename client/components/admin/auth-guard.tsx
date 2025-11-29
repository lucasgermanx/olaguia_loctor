"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
    children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token")

                if (!token) {
                    router.push("/admin/login")
                    return
                }

                // Verificar se o token é válido
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (!response.ok) {
                    localStorage.removeItem("token")
                    router.push("/admin/login")
                    return
                }

                const data = await response.json()

                // Verificar se é admin
                if (data.user.role !== "ADMIN") {
                    localStorage.removeItem("token")
                    router.push("/admin/login")
                    return
                }

                setIsAuthenticated(true)
            } catch (error) {
                console.error("Erro ao verificar autenticação:", error)
                localStorage.removeItem("token")
                router.push("/admin/login")
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [router])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-600">Verificando autenticação...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}

