"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [contactName, setContactName] = useState("")
  const [contactArea, setContactArea] = useState("")

  const handleOpenContactModal = () => {
    setIsContactModalOpen(true)
  }

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false)
  }

  const handleSendWhatsApp = () => {
    if (!contactName || !contactArea) return

    const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5581999999999"
    const message = encodeURIComponent(
      `Olá, meu nome é ${contactName} e atuo na área de ${contactArea}. Gostaria de entrar em contato pelo portal Olá Guia.`,
    )
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`

    window.open(url, "_blank")
    setIsContactModalOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-[#928575] shadow-md py-3" : "bg-[#928575] py-4",
      )}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Logo" width={200} height={54} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-50 transition-colors hover:text-gray-100"
          >
            HOME
          </Link>
          <Link
            href="http://localhost:3000/blog?tag=sobre-nos"
            className="text-sm font-medium text-gray-50 transition-colors hover:text-gray-100"
          >
            SOBRE NÓS
          </Link>
          <Link
            href="http://localhost:3000/blog?tag=revista"
            className="text-sm font-medium text-gray-50 transition-colors hover:text-gray-100"
          >
            REVISTA
          </Link>
          <Link
            href="http://localhost:3000/blog?tag=portal"
            className="text-sm font-medium text-gray-50 transition-colors hover:text-gray-100"
          >
            PORTAL
          </Link>
          <button
            type="button"
            onClick={handleOpenContactModal}
            className="text-sm font-medium text-gray-50 transition-colors hover:text-green-600"
          >
            CONTATO
          </button>
        </nav>

        {/* Right Side Icons and Login */}
        <div className="hidden md:flex items-center space-x-4">
          <Button className="bg-[#928575] hover:bg-[#928575d0] text-white rounded-full px-6 text-sm">
            ANÚNCIE
          </Button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="h-5 w-5 text-[#126861]" />
          </button>
        </div>

        {/* Mobile Menu Button (não usado mais, menu mobile foi movido para o bottom nav) */}
        <div className="md:hidden" />
      </div>
      {/* Mobile Navigation removida em favor do menu fixo inferior */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Fale conosco pelo WhatsApp</h2>
            <p className="text-sm text-gray-600 mb-4">
              Informe seus dados para iniciarmos a conversa pelo WhatsApp.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-name">
                  Nome
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#126861]"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-area">
                  Área de atuação
                </label>
                <input
                  id="contact-area"
                  type="text"
                  value={contactArea}
                  onChange={(e) => setContactArea(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#126861]"
                  placeholder="Ex: Psicologia, Nutrição, Fisioterapia..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseContactModal}>
                Cancelar
              </Button>
              <Button
                className="bg-[#126861] hover:bg-[#0f5650] text-white"
                onClick={handleSendWhatsApp}
                disabled={!contactName || !contactArea}
              >
                Enviar para WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
