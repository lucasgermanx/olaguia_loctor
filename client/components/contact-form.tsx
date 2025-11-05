"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="mt-8 rounded-lg bg-green-50 p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h4 className="mt-4 text-xl font-medium text-green-800">Mensagem enviada com sucesso!</h4>
        <p className="mt-2 text-green-700">Agradecemos seu contato. Nossa equipe retornará em breve.</p>
        <Button className="mt-6 bg-navy-950 hover:bg-navy-900" onClick={() => setIsSubmitted(false)}>
          Enviar nova mensagem
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-navy-950">
            Nome Completo
          </label>
          <Input
            id="name"
            placeholder="Seu nome completo"
            required
            className="border-gray-200 focus:border-gold focus:ring-gold/30"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-navy-950">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            required
            className="border-gray-200 focus:border-gold focus:ring-gold/30"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-navy-950">
          Telefone
        </label>
        <Input
          id="phone"
          placeholder="(00) 00000-0000"
          className="border-gray-200 focus:border-gold focus:ring-gold/30"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium text-navy-950">
          Assunto
        </label>
        <Input
          id="subject"
          placeholder="Assunto da mensagem"
          required
          className="border-gray-200 focus:border-gold focus:ring-gold/30"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-navy-950">
          Mensagem
        </label>
        <Textarea
          id="message"
          placeholder="Descreva sua necessidade jurídica"
          required
          className="min-h-[120px] border-gray-200 focus:border-gold focus:ring-gold/30"
        />
      </div>
      <Button type="submit" className="w-full bg-navy-950 hover:bg-navy-900 py-6" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar Mensagem"
        )}
      </Button>
    </form>
  )
}
