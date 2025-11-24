"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log({ email, password })
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/sessions`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log({ response })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Falha na autenticação")
      }

      // Salvar token no localStorage
      localStorage.setItem("token", data.token)

      // Verificar se o usuário é admin
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"}/me`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })

      console.log({ userResponse })

      const userData = await userResponse.json()

      if (userData.user.role !== "ADMIN") {
        localStorage.removeItem("token")
        throw new Error("Acesso restrito a administradores")
      }

      // Redirecionar para o painel de administração
      router.push("/admin")
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro durante o login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/images/logo.png" alt="Logo" width={200} height={80} className="mx-auto" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acesso ao Painel Administrativo</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o painel de administração.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full bg-navy-950 hover:bg-navy-900" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
