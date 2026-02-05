"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { ScrollToTop } from "@/components/scroll-to-top"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")
  const isHomePage = pathname === "/"

  return (
    <>
      {!isAdminRoute && <Header isHomePage={isHomePage} />}
      <main className={!isAdminRoute ? "pt-20 pb-16 md:pb-10" : ""}>{children}</main>
      {!isAdminRoute && <Footer />}
      {/* Menu mobile apenas nas páginas internas, não na home */}
      {!isAdminRoute && !isHomePage && <MobileBottomNav />}
      {/* Botão de voltar ao topo fixo na tela */}
      {!isAdminRoute && <ScrollToTop />}
    </>
  )
}

