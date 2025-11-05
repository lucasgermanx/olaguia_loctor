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
        isScrolled ? "bg-white shadow-md py-3" : "bg-white py-4",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/images/logo-olaguia.png" alt="Logo" width={276} height={54} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-900 transition-colors hover:text-green-600"
          >
            HOME
          </Link>
          <Link
            href="/sobre"
            className="text-sm font-medium text-gray-900 transition-colors hover:text-green-600"
          >
            SOBRE NÓS
          </Link>
          <Link
            href="/revista"
            className="text-sm font-medium text-gray-900 transition-colors hover:text-green-600"
          >
            REVISTA
          </Link>
          <Link
            href="/portal"
            className="text-sm font-medium text-gray-900 transition-colors hover:text-green-600"
          >
            PORTAL
          </Link>
          <Link
            href="/contato"
            className="text-sm font-medium text-gray-900 transition-colors hover:text-green-600"
          >
            CONTATO
          </Link>
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

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
          {isMobileMenuOpen ? (
            <X className="text-gray-900" />
          ) : (
            <Menu className="text-gray-900" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-6">
          <nav className="container mx-auto px-4 flex flex-col space-y-5">
            <Link
              href="/"
              className="text-gray-900 hover:text-green-600 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              HOME
            </Link>
            <Link
              href="/sobre"
              className="text-gray-900 hover:text-green-600 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              SOBRE
            </Link>
            <Link
              href="/contato"
              className="text-gray-900 hover:text-green-600 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              CONTATO
            </Link>
            <Link
              href="/blog"
              className="text-gray-900 hover:text-green-600 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              BLOG
            </Link>
            <Link
              href="/loja"
              className="text-gray-900 hover:text-green-600 transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              LOJA
            </Link>
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
              <button className="p-2">
                <Search className="h-5 w-5 text-gray-900" />
              </button>
              <button className="p-2">
                <User className="h-5 w-5 text-gray-900" />
              </button>
              <Button className="bg-orange-400 hover:bg-orange-500 text-white rounded-md px-6">
                LOGIN
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
