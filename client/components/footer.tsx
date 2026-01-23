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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slotsRes, adsRes] = await Promise.all([
          fetch(`${API_URL}/home-slots`),
          fetch(`${API_URL}/ads?active_only=true`),
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
    <footer className="bg-[#126861] text-white pt-10">
      <div className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto px-4 lg:px-0 pb-10">
        {/* Top Row - Logo and COMO ANUNCIAR */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 pb-10 border-b border-white/20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/olaguia-branco.png" alt="Logo" width={300} height={80} className="max-w-32 md:max-w-52" />
              <Image src="/20anos-branco.png" alt="Logo" width={300} height={80} className="max-w-14 md:max-w-24" />
            </Link>
          </div>

          {/* COMO ANUNCIAR */}
          <div className="flex items-start space-x-4 max-w-xl">
            <div className="bg-white rounded-xl p-3 flex-shrink-0">
              <BsFillMegaphoneFill className="h-8 w-8 text-[#126861]" />
            </div>
            <div>
              <h3 className="font-open-sans font-semibold text-lg uppercase mb-2">COMO ANUNCIAR</h3>
              <p className="text-sm text-gray-200">
                Você gostaria de divulgar seu trabalho no Ecossistema do OLÁ Guia? 
                Fique tranquilo clique aqui que teremos o maior prazer em lhe explicar como tudo funciona e aí você poderá ter esta oportunidade de ser nosso parceiro!
                <br />
                <strong>OLÁ GUIA - Marketing de Baixo Custo e ALTO IMPACTO!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 pt-6 md:pt-8">
          {/* Navegação Column */}
          <div className="md:col-span-2 flex flex-col">
            <h3 className="font-open-sans font-semibold mb-3 text-sm leading-tight">Navegação</h3>
            <ul className="flex flex-row space-x-2 md:flex-col md:space-y-1.5 text-start">
              <li>
                <Link href="/" className="text-gray-200 hover:text-white transition-colors text-sm font-normal md:font-semibold">
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/sobre-nos" className="text-gray-200 hover:text-white transition-colors text-sm font-normal md:font-semibold">
                  SOBRE NÓS
                </Link>
              </li>
              <li>
                <Link href="/revista" className="text-gray-200 hover:text-white transition-colors text-sm font-normal md:font-semibold">
                  REVISTA
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-gray-200 hover:text-white transition-colors text-sm font-normal md:font-semibold">
                  PORTAL
                </Link>
              </li>
            </ul>
            <div className="border-t border-white/20 mt-6 md:border-none"></div>
          </div>

          {/* Middle Section - Article Cards */}
          <div className="md:col-span-6 flex flex-col">
            <h3 className="font-open-sans font-semibold mb-3 text-sm leading-tight invisible md:visible">Artigos</h3>
            <div className="space-y-3">
              {getSlots("EMPRESAS_NEGOCIOS", "SIDE").slice(0, 3).map((slot, index) => {
                const post = slot.post
                if (!post) return null

                return (
                  <Link key={slot.id} href={`/blog/${post.slug}`} className={`flex gap-3 sm:gap-4 group`}>
                    <div className="relative w-24 h-20 flex-shrink-0">
                      <Image
                        src={post.featured_image || placeholderImages.office}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-open-sans font-semibold text-sm text-gray-100 uppercase line-clamp-1 mb-1">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-xs font-lato text-gray-200 line-clamp-2 mb-1">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="font-lato text-[8px] italic text-gray-100 border border-gray-300 px-2 py-1 uppercase">
                        LEIA MAIS
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Side - TRABALHE COM AGENTE, FRANQUIA, Instagram */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            {/* TRABALHE COM AGENTE */}
            <div>
              <h3 className="font-open-sans font-bold text-sm uppercase mb-1.5 leading-tight">
                TRABALHE COM<br />A GENTE
              </h3>
              <p className="text-xs text-gray-200 leading-relaxed">
                Você é uma pessoa honesta, trabalhadora e gosta de trabalhar com Marketing e publicidade? 
                Entre em contato, sempre estamos procurando pessoas com vontade de trabalhar e crescer na empresa.
              </p>
            </div>

            {/* FRANQUIA */}
            <div>
              <h3 className="font-open-sans font-bold text-sm uppercase mb-1.5 leading-tight">FRANQUIA</h3>
              <p className="text-xs text-gray-200 leading-relaxed">
                Você gosta da proposta do OLÁ GUIA? Se você gostaria de ser dono do seu próprio negócio sendo nosso parceiro, entre em contato para conversar.
              </p>
            </div>

            {/* Instagram Group */}
            <div className="space-y-2">
              <p className="text-xs text-gray-200 leading-relaxed">
                Gostaria de receber notícias sobre o OLÁ GUIA.
              </p>
              <p className="text-xs text-gray-200 font-semibold leading-relaxed">
                Entre no nosso canal no Instagram
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="bg-white hover:bg-gray-100 text-[#353E5C] px-6 py-2 uppercase rounded-none text-xs font-semibold border border-gray-300">
                  SOU LEITOR
                </Button>
                <Button className="bg-white hover:bg-gray-100 text-[#353E5C] px-6 py-2 uppercase rounded-none text-xs font-semibold border border-gray-300">
                  SOU POTENCIAL ANUNCIANTE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Band - Copyright */}
      <div className="">
        <div className="border-t border-white/20 py-4 max-w-4xl" />
        <div className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl px-4 md:px-0 mx-auto">
          <p className="text-sm text-gray-300 text-center">
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
    </footer>
  )
}