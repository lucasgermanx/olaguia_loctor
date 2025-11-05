import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { volkhov, openSans, lato } from "@/lib/fonts"

export const metadata: Metadata = {
  title: "OLÁGUIA - Blog",
  description: "OLÁGUIA - Seu guia de informações e conteúdos",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${volkhov.variable} ${openSans.variable} ${lato.variable}`}>
      <body>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
