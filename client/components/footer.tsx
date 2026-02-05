"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BsFillMegaphoneFill } from "react-icons/bs";
import { placeholderImages } from "@/lib/placeholder-images";
import { useEffect, useState } from "react";

interface HomeSlot {
  id: string
  section: string
  position: string
  slot_index: number | null
  order: number
  post_id: string | null
  post: any | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

export function Footer() {
  const [slots, setSlots] = useState<HomeSlot[]>([])

  // Contact modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [contactName, setContactName] = useState("")
  const [contactArea, setContactArea] = useState("")
  const [contactCity, setContactCity] = useState("")

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
      `Olá, meu nome é ${contactName}, sou de ${contactCity} e atuo na área de ${contactArea}. Gostaria de saber como anunciar no portal Olá Guia.`,
    )
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`

    window.open(url, "_blank")
    setIsContactModalOpen(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slotsRes] = await Promise.all([
          fetch(`${API_URL}/home-slots`),
        ])

        if (slotsRes.ok) {
          const slotsData = await slotsRes.json()
          setSlots(slotsData.slots || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
      }
    }

    fetchData()
  }, [])

  const getSlots = (section: string, position: string) => {
    return slots
      .filter((slot) => slot.section === section && slot.position === position)
      .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
  }

  return (
    <footer className="bg-[#126861] text-white">
      <div className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto py-10">
        <div className="border-b border-white/20 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/olaguia-branco.png" alt="Logo" width={300} height={80} className="max-w-32 md:max-w-52" />
                <Image src="/20anos-branco.png" alt="Logo" width={300} height={80} className="max-w-14 md:max-w-24" />
              </Link>

              <div className="flex flex-col gap-4 text-sm">
                <span className="font-open-sans font-semibold text-gray-100">Navegação:</span>
                <div className="flex gap-x-4 text-gray-200">
                  <Link href="/" className="hover:text-white transition-colors font-open-sans font-semibold">HOME</Link>
                  <Link href="/blog?tag=sobre-nos" className="hover:text-white transition-colors font-open-sans font-semibold">SOBRE NÓS</Link>
                  <Link href="/blog?tag=revista" className="hover:text-white transition-colors font-open-sans font-semibold">REVISTA</Link>
                  <Link href="/blog?tag=portal" className="hover:text-white transition-colors font-open-sans font-semibold">PORTAL</Link>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenContactModal}
              className="flex items-start gap-4 max-w-2xl lg:justify-self-end text-left hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="bg-white rounded-xl p-3 flex-shrink-0">
                <BsFillMegaphoneFill className="h-8 w-8 text-[#126861]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-open-sans font-semibold text-base uppercase">COMO ANUNCIAR</h3>
                <p className="text-sm font-open-sans text-gray-200 leading-relaxed">
                  Você gostaria de divulgar seu trabalho no Ecossistema do OLÁ Guia? Clique aqui que teremos o maior prazer em lhe explicar como tudo funciona.
                  <br />
                  OLÁ GUIA - Marketing de Baixo Custo e ALTO IMPACTO!
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              {getSlots("EMPRESAS_NEGOCIOS", "SIDE").slice(0, 3).map((slot) => {
                const post = slot.post
                if (!post) return null

                return (
                  <Link key={slot.id} href={`/blog/${post.slug}`} className="flex gap-2 items-stretch">
                    <div className="relative w-16 flex-shrink-0 border border-white/10">
                      <Image
                        src={post.featured_image || placeholderImages.office}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-open-sans font-semibold text-sm text-gray-100 uppercase line-clamp-1">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-sm font-open-sans text-gray-200 line-clamp-2 mt-1">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="inline-block mt-2 font-lato text-[10px] italic text-gray-100 border border-white/30 px-2 py-1 uppercase">
                        LEIA MAIS
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="lg:col-span-5 lg:pl-10 lg:border-l lg:border-white/20 flex flex-col justify-between gap-5">
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex gap-3">
                    <img src="./logoicon.png" alt="" className="w-auto h-5" />
                    <h3 className="font-open-sans font-bold text-[#928575]/90 text-sm uppercase">TRABALHE COM A GENTE</h3>
                  </div>
                  <p className="text-sm font-open-sans text-gray-200 leading-relaxed">
                    Você é uma pessoa honesta, trabalhadora e gosta de trabalhar com marketing e publicidade? Entre em contato.
                  </p>
                </div>

                {/* Linha separadora */}
                <div className="border-t border-white/20"></div>

                <div className="space-y-1">
                  <div className="flex gap-3">
                    <img src="./logoicon.png" alt="" className="w-auto h-5" />
                    <h3 className="font-open-sans font-bold text-[#928575]/90 text-sm uppercase">FRANQUIA</h3>
                  </div>
                  <p className="text-sm font-open-sans text-gray-200 leading-relaxed">
                    Você gosta da proposta do OLÁ GUIA? Gostaria de ser dono do seu próprio negócio. Entre em contato.
                  </p>
                </div>

                {/* Linha separadora */}
                <div className="border-t border-white/20"></div>

                <div className="space-y-0.5">
                  <div className="flex gap-3">
                    <img src="./logoicon.png" alt="" className="w-auto h-5" />
                    <p className="text-sm text-gray-200 leading-relaxed">
                      Gostaria de receber notícias sobre o OLÁ GUIA.
                    </p>
                  </div>
                  <p className="text-sm text-gray-100 font-semibold leading-relaxed">
                    Entre no nosso canal no Instagram
                  </p>
                </div>
              </div>

              {/* Botões lado a lado */}
              <div className="flex flex-row gap-3">
                <Button className="flex-1 bg-white hover:bg-gray-100 text-[#353E5C] px-3 py-2 rounded-none text-xs font-semibold border border-gray-300">
                  Canal para leitores
                </Button>
                <Button className="flex-1 bg-white hover:bg-gray-100 text-[#353E5C] px-3 py-2 rounded-none text-xs font-semibold border border-gray-300">
                  Canal para interessados
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto py-4">
          <p className="text-xs sm:text-sm text-gray-300 text-center">
            Copyright © 2025 OLÁ Guia | Todos os direitos reservados |{" "}
            <Link href="/termos" className="underline hover:text-gray-200">
              Termos e Condições
            </Link>{" "}
            |{" "}
            <Link href="/privacidade" className="underline hover:text-gray-200">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
      {/* Contact Modal */}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-area">
                  Cidade
                </label>
                <input
                  id="contact-city"
                  type="text"
                  value={contactCity}
                  onChange={(e) => setContactCity(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#126861]"
                  placeholder="Nome da cidade"
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
    </footer>
  )
}
