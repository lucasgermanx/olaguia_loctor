"use client"

import { useState } from "react"
import { Phone, X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 rounded-lg bg-white p-4 shadow-lg border border-gray-100 w-72 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold text-navy-950">Fale Conosco</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-navy-950 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Estamos prontos para atender suas necessidades jurídicas. Entre em contato agora mesmo.
          </p>
          <div className="space-y-3">
            <a
              href="tel:+558532617063"
              className="flex items-center justify-center rounded-md bg-navy-950 px-4 py-2 text-sm font-medium text-white hover:bg-navy-900 transition-colors w-full"
            >
              <Phone className="mr-2 h-4 w-4" /> (85) 3261-7063
            </a>
            <a
              href="https://wa.me/5585991926336"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors w-full"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
            </a>
            <a
              href="#contato"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-md bg-gold px-4 py-2 text-sm font-medium text-navy-950 hover:bg-gold/90 transition-colors w-full"
            >
              Agende uma Consulta
            </a>
          </div>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "rounded-full w-14 h-14 shadow-lg transition-all",
          isOpen ? "bg-navy-950 hover:bg-navy-900" : "bg-gold hover:bg-gold/90",
        )}
        aria-label="Contato"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
      </Button>
    </div>
  )
}
