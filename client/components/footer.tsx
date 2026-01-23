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

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                <span className="font-open-sans font-semibold text-gray-100">Navegação:</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-200">
                  <Link href="/" className="hover:text-white transition-colors font-open-sans font-semibold">HOME</Link>
                  <Link href="/blog?tag=sobre-nos" className="hover:text-white transition-colors font-open-sans font-semibold">SOBRE NÓS</Link>
                  <Link href="/blog?tag=revista" className="hover:text-white transition-colors font-open-sans font-semibold">REVISTA</Link>
                  <Link href="/blog?tag=portal" className="hover:text-white transition-colors font-open-sans font-semibold">PORTAL</Link>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 max-w-2xl lg:justify-self-end">
              <div className="bg-white rounded-xl p-3 flex-shrink-0">
                <BsFillMegaphoneFill className="h-8 w-8 text-[#126861]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-open-sans font-semibold text-base uppercase">COMO ANUNCIAR</h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  Você gostaria de divulgar seu trabalho no Ecossistema do OLÁ Guia? Clique aqui que teremos o maior prazer em lhe explicar como tudo funciona.
                  <br />
                  OLÁ GUIA - Marketing de Baixo Custo e ALTO IMPACTO!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              {getSlots("EMPRESAS_NEGOCIOS", "SIDE").slice(0, 3).map((slot) => {
                const post = slot.post
                if (!post) return null

                return (
                  <Link key={slot.id} href={`/blog/${post.slug}`} className="flex gap-4 items-start">
                    <div className="relative w-28 h-20 flex-shrink-0 border border-white/10">
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
                        <p className="text-xs font-lato text-gray-200 line-clamp-2 mt-1">
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

            <div className="lg:col-span-5 lg:pl-10 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-open-sans font-bold text-sm uppercase">TRABALHE COM AGENTE</h3>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    Você é uma pessoa honesta, trabalhadora e gosta de trabalhar com marketing e publicidade? Entre em contato.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-open-sans font-bold text-sm uppercase">FRANQUIA</h3>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    Você gosta da proposta do OLÁ GUIA? Gostaria de ser dono do seu próprio negócio. Entre em contato.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-200 leading-relaxed">
                    Gostaria de receber notícias sobre o OLÁ GUIA.
                  </p>
                  <p className="text-sm text-gray-100 font-semibold leading-relaxed">
                    Entre no nosso canal no Instagram
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="bg-white hover:bg-gray-100 text-[#353E5C] px-5 py-2 rounded-none text-sm font-semibold border border-gray-300">
                  Canal para leitores
                </Button>
                <Button className="bg-white hover:bg-gray-100 text-[#353E5C] px-5 py-2 rounded-none text-sm font-semibold border border-gray-300">
                  Canal para interessados em anunciar
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
    </footer>
  )
}
