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
      {/* Top Band */}
      <div className="max-w-7xl mx-auto px-4 pb-14">
        {/* TOP Side - Logo and Privacy */}
        <div className="flex flex-col lg:flex-row gap-x-40 pb-14">
          <div className="flex items-center space-x-3 mb-4">
            <Image src="/logo.png" alt="Logo" width={256} height={100} />
          </div>
          <p className="text-lg text-gray-200">
            Concordo em receber novas notícias através do nosso grupo. <br /> Para mais informações consulte nossa:{" "}
            <Link href="/privacidade" className="text-xl underline hover:text-white font-semibold">
              Política de Privacidade
            </Link>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-r border-white/20">
            {/* Links Column */}
            <div>
              <h3 className="font-open-sans font-semibold mb-4 text-sm">Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacidade" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/termos" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Termos e Condições
                  </Link>
                </li>
                <li>
                  <Link href="/trabalhe-conosco" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Trabalhe com a gente
                  </Link>
                </li>
                <li>
                  <Link href="/franquia" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Franquia
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Navegação Column */}
            <div>
              <h3 className="font-open-sans font-semibold mb-4 text-sm">Navegação</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="blog?tag=sobre-nos" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link href="/biblioteca" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Biblioteca
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Middle Section - Article Cards */}
          <div className="space-y-4 border-r border-white/20 pr-10">
            {getSlots("EMPRESAS_NEGOCIOS", "SIDE").slice(0, 3).map((slot, index) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link key={slot.id} href={`/blog/${post.slug}`} className={`flex gap-3 sm:gap-4 group ${index == 1 ? "border-y border-[#EEEEEE] py-4" : ""}`}>
                  <div className="relative w-24 h-auto flex-shrink-0">
                    <Image
                      src={post.featured_image || placeholderImages.office}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-open-sans font-semibold text-xs sm:text-xs text-gray-100 uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-[10px] font-lato text-gray-200 line-clamp-2 mb-1">
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

          {/* Right Side - COMO ANUNCIAR and Social */}
          <div className="space-y-6">
            {/* COMO ANUNCIAR */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-white rounded-xl p-4">
                  <BsFillMegaphoneFill className="h-8 w-8 text-[#126861]" />
                </div>
                <div>
                  <h3 className="font-open-sans font-semibold text-lg uppercase">COMO ANUNCIAR</h3>
                  <p className="text-sm text-gray-200">
                    Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy and Social */}
            <div className="space-y-3">
              <p className="text-sm text-gray-200">
                Concordo em receber novas notícias através do nosso grupo. Para mais informações consulte nossa:{" "}
                <Link href="/privacidade" className="underline hover:text-white font-semibold">
                  Política de Privacidade
                </Link>
              </p>
              <p className="text-sm text-gray-200 font-semibold">
                Entre no nosso canal do instagram
              </p>
              <Button className="bg-white hover:bg-white text-[#353E5C] px-4 py-1 uppercase rounded-full">
                ENTRAR NO GRUPO
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Band - Copyright */}
      <div className="border-t border-white/20 py-4 max-w-4xl mx-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-400 text-center">
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
