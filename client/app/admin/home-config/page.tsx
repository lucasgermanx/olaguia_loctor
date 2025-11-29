"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Edit2, X } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { AdBanner } from "@/components/ad-banner"
import { placeholderImages } from "@/lib/placeholder-images"

interface Post {
  id: string
  title: string
  slug: string
  featured_image?: string
  category?: {
    name: string
  }
}

interface HomeSlot {
  id: string
  section: string
  position: string
  slot_index: number | null
  order: number
  post_id: string | null
  post: Post | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

export default function HomeConfigPage() {
  const [slots, setSlots] = useState<HomeSlot[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<HomeSlot | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const [slotsRes, postsRes] = await Promise.all([
        fetch(`${API_URL}/home-slots`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/posts?per_page=100`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (slotsRes.ok) {
        const slotsData = await slotsRes.json()
        setSlots(slotsData.slots || [])
      } else {
        const errorData = await slotsRes.json().catch(() => ({}))
        console.error("Error fetching slots:", errorData)
        // Se a tabela não existir, mostrar mensagem
        if (slotsRes.status === 500) {
          console.warn("HomeSlot table may not exist. Please run migration first.")
        }
      }

      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData.posts || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSlotClick = (slot: HomeSlot) => {
    setSelectedSlot(slot)
    setIsDialogOpen(true)
  }

  const handleAssignPost = async (postId: string | null) => {
    if (!selectedSlot) return

    setIsSaving(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`${API_URL}/home-slots/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          postId,
        }),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        setSelectedSlot(null)
        fetchData()
      }
    } catch (error) {
      console.error("Error assigning post:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getSlotsBySection = (section: string) => {
    return slots.filter((slot) => slot.section === section)
  }

  const getSlotByKey = (section: string, position: string, slotIndex: number | null) => {
    return slots.find(
      (slot) =>
        slot.section === section &&
        slot.position === position &&
        slot.slot_index === slotIndex,
    )
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  // Se não houver slots, mostrar mensagem informativa
  if (slots.length === 0 && !isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2 text-yellow-800">Tabela HomeSlot não encontrada</h2>
            <p className="text-yellow-700 mb-4">
              Para usar esta funcionalidade, você precisa executar a migration do banco de dados primeiro.
            </p>
            <div className="bg-white p-4 rounded border border-yellow-200">
              <p className="font-semibold mb-2">Execute os seguintes comandos no diretório server:</p>
              <code className="block bg-gray-100 p-2 rounded text-sm mb-2">
                npx prisma migrate dev --name add_home_slots
              </code>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                npx tsx prisma/seed-home-slots.ts
              </code>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex flex-col bg-white pt-20">
        <div className="p-6 bg-gray-100 border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Configuração da Home</h1>
            <p className="text-sm text-gray-600">Clique em qualquer post para configurá-lo</p>
          </div>
        </div>

        {/* Hero Carousel */}
        <section className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px]">
          <Carousel className="w-full h-full" opts={{ loop: true }}>
            <CarouselContent className="h-[350px]">
              {[0, 1, 2].map((index) => {
                const slot = getSlotByKey("HERO", "CAROUSEL", index)
                return (
                  <CarouselItem key={index} className="h-full">
                    <div
                      className="relative w-full h-full cursor-pointer group"
                      onClick={() => slot && handleSlotClick(slot)}
                    >
                      {slot?.post?.featured_image ? (
                        <Image
                          src={slot.post.featured_image}
                          alt={slot.post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <Edit2 className="mx-auto mb-2 text-gray-400" size={24} />
                            <p className="text-sm text-gray-500">Clique para adicionar post</p>
                          </div>
                        </div>
                      )}
                      {slot?.post && (
                        <div className="absolute top-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] md:w-[calc(100%-8rem)] lg:w-auto lg:max-w-xl">
                            <div className="bg-white p-4 sm:p-4 md:p-5 shadow-xl border-t-[4px] sm:border-t-[6px] border-black">
                              <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3 sm:mb-4 text-xs sm:text-sm">
                                {slot.post.category?.name || "CATEGORIA"}
                              </Badge>
                              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-open-sans font-semibold mb-3 sm:mb-4 text-gray-900 text-left leading-tight">
                                {slot.post.title}
                              </h1>
                            </div>
                          </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Edit2 className="text-white" size={32} />
                      </div>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        </section>

        {/* EM DESTAQUE Section */}
        <section className="max-w-7xl mx-auto py-12 px-0 bg-white">
          <div className="flex items-center justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]">
              <span className="text-[#928575]">EM</span> DESTAQUE
            </h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Main Featured Article */}
            {(() => {
              const slot = getSlotByKey("EM_DESTAQUE", "MAIN", null)
              return (
                <div
                  className="relative h-[400px] 2xl:h-[500px] group cursor-pointer"
                  onClick={() => slot && handleSlotClick(slot)}
                >
                  {slot?.post?.featured_image ? (
                    <Image
                      src={slot.post.featured_image}
                      alt={slot.post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <Edit2 className="mx-auto mb-2 text-gray-400" size={24} />
                        <p className="text-sm text-gray-500">Clique para adicionar post</p>
                      </div>
                    </div>
                  )}
                  {slot?.post && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3">
                          {slot.post.category?.name || "CATEGORIA"}
                        </Badge>
                        <h3 className="text-2xl 2xl:text-3xl font-open-sans font-semibold mb-3">
                          {slot.post.title}
                        </h3>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Edit2 className="text-white" size={32} />
                  </div>
                </div>
              )
            })()}

            {/* Side Articles */}
            <div className="grid grid-rows-3 h-[400px] 2xl:h-[500px]">
              {[0, 1, 2].map((index) => {
                const slot = getSlotByKey("EM_DESTAQUE", "SIDE", index)
                return (
                  <div
                    key={index}
                    className={`flex gap-10 group cursor-pointer ${index === 1 || index === 2 ? "border-t border-[#EEEEEE] py-2 2xl:py-5" : ""}`}
                    onClick={() => slot && handleSlotClick(slot)}
                  >
                    <div className="flex-1">
                      {slot?.post ? (
                        <>
                          <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-1 2xl:mb-2 text-xs">
                            {slot.post.category?.name || "CATEGORIA"}
                          </Badge>
                          <h4 className="font-open-sans font-semibold text-lg max-w-56 transition-colors">
                            {slot.post.title}
                          </h4>
                        </>
                      ) : (
                        <div className="flex items-center h-full">
                          <Edit2 className="text-gray-400" size={20} />
                          <p className="text-sm text-gray-500 ml-2">Adicionar post</p>
                        </div>
                      )}
                    </div>
                    <div className="relative w-40 h-28 2xl:h-32 flex-shrink-0">
                      {slot?.post?.featured_image ? (
                        <Image
                          src={slot.post.featured_image}
                          alt={slot.post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Edit2 className="text-gray-400" size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Business Banner - Ad */}
        <section className="max-w-7xl mx-auto py-6">
          <div className="text-center text-sm text-gray-500 mb-2">Banner de Anúncio (BUSINESS_BANNER_1)</div>
          <div className="text-center text-xs text-gray-400">
            Configure este anúncio em: <Link href="/admin/ads" className="text-blue-600 hover:underline">Anúncios</Link>
          </div>
        </section>

        {/* PARA REFLEXÃO Section */}
        <section className="max-w-7xl mx-auto w-full py-12 px-0 bg-white">
          <div className="mx-auto w-full items-center justify-center">
            <div className="flex items-center justify-center w-full">
              <div className="h-3 w-full bg-gray-300"></div>
              <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]">
                <span className="text-[#928575]">PARA</span> REFLEXÃO
              </h2>
              <div className="h-3 w-full bg-gray-300"></div>
            </div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {getSlotsBySection("PARA_REFLEXAO")
                .filter((slot) => slot.position === "CAROUSEL")
                .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
                .map((slot) => (
                  <CarouselItem key={slot.id} className="md:basis-1/3">
                    <div
                      className="relative h-[600px] group cursor-pointer"
                      onClick={() => handleSlotClick(slot)}
                    >
                      {slot.post?.featured_image ? (
                        <Image
                          src={slot.post.featured_image}
                          alt={slot.post.title}
                          fill
                          className="object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-xl">
                          <div className="text-center">
                            <Edit2 className="mx-auto mb-2 text-gray-400" size={24} />
                            <p className="text-sm text-gray-500">Clique para adicionar post</p>
                          </div>
                        </div>
                      )}
                      {slot.post && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
                          <div className="absolute bottom-12 left-8 right-8 text-white">
                            <p className="font-volkhov font-medium text-3xl max-w-xs mb-2">
                              {slot.post.title}
                            </p>
                          </div>
                        </>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-xl">
                        <Edit2 className="text-white" size={32} />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/80 hover:bg-white" />
            <CarouselNext className="right-4 bg-white/80 hover:bg-white" />
          </Carousel>
        </section>

        {/* NOSSA SAÚDE Section */}
        <section className="max-w-7xl mx-auto w-full py-12 px-0 bg-white">
          <div className="flex items-center justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]">
              <span className="text-[#928575]">NOSSA</span> SAÚDE
            </h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Article */}
            {(() => {
              const slot = getSlotByKey("NOSSA_SAUDE", "MAIN", null)
              return (
                <div
                  className="relative bg-white group border-b-8 border-[#B4B9C9] cursor-pointer"
                  onClick={() => slot && handleSlotClick(slot)}
                >
                  <div className="relative w-full h-72">
                    {slot?.post?.featured_image ? (
                      <Image
                        src={slot.post.featured_image}
                        alt={slot.post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Edit2 className="text-gray-400" size={24} />
                      </div>
                    )}
                  </div>
                  {slot?.post && (
                    <div className="px-4 bg-white absolute top-[40%] left-0 right-10">
                      <h3 className="text-2xl font-open-sans font-semibold mb-3 mt-5 text-gray-900">
                        {slot.post.title}
                      </h3>
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-7 text-xs">
                        {slot.post.category?.name || "CATEGORIA"}
                      </Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Edit2 className="text-white" size={32} />
                  </div>
                </div>
              )
            })()}

            {/* Side Articles */}
            <div className="space-y-4">
              {getSlotsBySection("NOSSA_SAUDE")
                .filter((slot) => slot.position === "SIDE")
                .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
                .slice(0, 4)
                .map((slot) => (
                  <div
                    key={slot.id}
                    className="flex gap-4 group cursor-pointer"
                    onClick={() => handleSlotClick(slot)}
                  >
                    <div className="relative w-40 h-32 flex-shrink-0">
                      {slot.post?.featured_image ? (
                        <Image
                          src={slot.post.featured_image}
                          alt={slot.post.title}
                          fill
                          className="object-cover rounded-sm"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-sm">
                          <Edit2 className="text-gray-400" size={16} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      {slot.post ? (
                        <>
                          <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">
                            {slot.post.category?.name || "CATEGORIA"}
                          </Badge>
                          <h4 className="font-open-sans font-semibold text-lg mb-2 transition-colors">
                            {slot.post.title}
                          </h4>
                        </>
                      ) : (
                        <div className="flex items-center h-full">
                          <Edit2 className="text-gray-400" size={16} />
                          <p className="text-sm text-gray-500 ml-2">Adicionar post</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Ad Banner */}
            <div className="text-center text-sm text-gray-500">
              <p>Anúncio (NOSSA_SAUDE_RIGHT)</p>
              <p className="text-xs text-gray-400 mt-1">
                Configure em: <Link href="/admin/ads" className="text-blue-600 hover:underline">Anúncios</Link>
              </p>
            </div>
          </div>
        </section>

        {/* SOBRE RELACIONAMENTOS Section */}
        <section className="max-w-7xl mx-auto h-full w-full py-12 px-0 bg-white">
          <div className="mx-auto w-full items-center justify-center">
            <div className="flex items-center justify-center w-full">
              <div className="h-3 w-full bg-gray-300" />
              <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]">
                <span className="text-[#928575]">SOBRE</span> RELACIONAMENTOS
              </h2>
              <div className="h-3 w-full bg-gray-300" />
            </div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {getSlotsBySection("SOBRE_RELACIONAMENTOS")
                .filter((slot) => slot.position === "CAROUSEL")
                .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
                .map((slot) => (
                  <CarouselItem key={slot.id} className="md:basis-1/3">
                    <div
                      className="relative bg-white group pb-32 cursor-pointer"
                      onClick={() => handleSlotClick(slot)}
                    >
                      <div className="relative w-full h-72">
                        {slot.post?.featured_image ? (
                          <Image
                            src={slot.post.featured_image}
                            alt={slot.post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Edit2 className="text-gray-400" size={24} />
                          </div>
                        )}
                      </div>
                      {slot.post && (
                        <div className="px-4 py-4 bg-white absolute top-[40%] left-0 right-10 shadow-lg">
                          <h3 className="text-2xl font-open-sans font-semibold mb-2 text-gray-900">
                            {slot.post.title}
                          </h3>
                          <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3 text-xs">
                            {slot.post.category?.name || "CATEGORIA"}
                          </Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Edit2 className="text-white" size={32} />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 top-1/3 bg-white/80 hover:bg-white" />
            <CarouselNext className="right-2 top-1/3 bg-white/80 hover:bg-white" />
          </Carousel>
        </section>

        {/* Promotional Banner - Ad */}
        <section className="max-w-7xl mx-auto py-6">
          <div className="text-center text-sm text-gray-500 mb-2">Banner Promocional (PROMOTIONAL_BANNER_1)</div>
          <div className="text-center text-xs text-gray-400">
            Configure em: <Link href="/admin/ads" className="text-blue-600 hover:underline">Anúncios</Link>
          </div>
        </section>

        {/* EMPRESAS & NEGÓCIOS Section */}
        <section className="max-w-7xl mx-auto py-12 px-0 bg-white">
          <div className="flex items-center justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]">
              <span className="text-[#928575]">EMPRESAS</span> & NEGÓCIOS
            </h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Articles - Left Column */}
            <div className="md:col-span-2 space-y-4">
              {getSlotsBySection("EMPRESAS_NEGOCIOS")
                .filter((slot) => slot.position === "MAIN")
                .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
                .slice(0, 3)
                .map((slot, index) => (
                  <div
                    key={slot.id}
                    className={`flex gap-4 group bg-white pb-4 cursor-pointer ${index === 0 || index === 1 ? 'border-b-2' : ''}`}
                    onClick={() => handleSlotClick(slot)}
                  >
                    <div className="relative w-72 h-44 flex-shrink-0">
                      {slot.post?.featured_image ? (
                        <Image
                          src={slot.post.featured_image}
                          alt={slot.post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Edit2 className="text-gray-400" size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      {slot.post ? (
                        <>
                          <h4 className="font-open-sans font-semibold text-lg mb-2 text-gray-900 uppercase">
                            {slot.post.title}
                          </h4>
                          <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">
                            {slot.post.category?.name || "EMPRESAS & NEGÓCIOS"}
                          </Badge>
                        </>
                      ) : (
                        <div className="flex items-center h-full">
                          <Edit2 className="text-gray-400" size={20} />
                          <p className="text-sm text-gray-500 ml-2">Adicionar post</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Right Column - Ad Banner and Smaller Articles */}
            <div className="space-y-2 border border-[#B6B6B6] p-4">
              {/* Ad Banner */}
              <div className="text-center text-xs text-gray-500 mb-2">
                Anúncio (EMPRESAS_NEGOCIOS_RIGHT)
              </div>

              {/* Smaller Articles */}
              {getSlotsBySection("EMPRESAS_NEGOCIOS")
                .filter((slot) => slot.position === "SIDE")
                .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
                .slice(0, 3)
                .map((slot) => (
                  <div
                    key={slot.id}
                    className="flex gap-4 group cursor-pointer"
                    onClick={() => handleSlotClick(slot)}
                  >
                    <div className="relative w-40 h-28 flex-shrink-0">
                      {slot.post?.featured_image ? (
                        <Image
                          src={slot.post.featured_image}
                          alt={slot.post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Edit2 className="text-gray-400" size={14} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      {slot.post ? (
                        <>
                          <h4 className="font-open-sans font-semibold text-sm mb-1 text-gray-900 uppercase">
                            {slot.post.title}
                          </h4>
                        </>
                      ) : (
                        <div className="flex items-center h-full">
                          <Edit2 className="text-gray-400" size={14} />
                          <p className="text-xs text-gray-500 ml-1">Adicionar</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* ESTÉTICA & BELEZA Section */}
        <section className="max-w-7xl w-full mx-auto py-12 px-0 bg-white">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-full">
              <div className="h-3 w-full bg-gray-300"></div>
              <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]">
                <span className="text-[#928575]">ESTÉTICA</span> & BELEZA
              </h2>
              <div className="h-3 w-full bg-gray-300"></div>
            </div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {getSlotsBySection("ESTETICA_BELEZA")
              .filter((slot) => slot.position === "GRID")
              .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
              .slice(0, 6)
              .map((slot) => (
                <div
                  key={slot.id}
                  className="relative h-64 group cursor-pointer"
                  onClick={() => handleSlotClick(slot)}
                >
                  {slot.post?.featured_image ? (
                    <Image
                      src={slot.post.featured_image}
                      alt={slot.post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Edit2 className="text-gray-400" size={24} />
                    </div>
                  )}
                  {slot.post && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="font-open-sans font-semibold text-sm">
                          {slot.post.title}
                        </p>
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Edit2 className="text-white" size={32} />
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* RINDO À TOA & QUEBRA CUCA Section */}
        <section className="max-w-7xl mx-auto py-12 px-0 bg-white">
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center justify-center w-full">
              <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#928575]">RINDO À TOA</h2>
              <div className="h-3 w-full bg-gray-300"></div>
              <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]">QUEBRA CUCA</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* RINDO À TOA */}
            <div>
              <div className="space-y-4">
                {getSlotsBySection("RINDO_A_TOA")
                  .filter((slot) => slot.position === "SIDE")
                  .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
                  .slice(0, 3)
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className="grid grid-cols-2 gap-4 group cursor-pointer"
                      onClick={() => handleSlotClick(slot)}
                    >
                      <div className="flex-1 text-end">
                        {slot.post ? (
                          <>
                            <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">
                              {slot.post.category?.name || "RINDO À TOA"}
                            </Badge>
                            <h4 className="font-open-sans font-semibold text-lg mb-2 transition-colors">
                              {slot.post.title}
                            </h4>
                          </>
                        ) : (
                          <div className="flex items-center justify-end h-full">
                            <Edit2 className="text-gray-400" size={16} />
                            <p className="text-sm text-gray-500 ml-2">Adicionar</p>
                          </div>
                        )}
                      </div>
                      <div className="relative flex-shrink-0">
                        {slot.post?.featured_image ? (
                          <Image
                            src={slot.post.featured_image}
                            alt={slot.post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Edit2 className="text-gray-400" size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Ad Banner Middle */}
            <div className="text-center text-sm text-gray-500">
              <p>Anúncio (RINDO_A_TOA_MIDDLE)</p>
              <p className="text-xs text-gray-400 mt-1">
                Configure em: <Link href="/admin/ads" className="text-blue-600 hover:underline">Anúncios</Link>
              </p>
            </div>

            {/* QUEBRA CUCA */}
            <div>
              <div className="space-y-4">
                {getSlotsBySection("QUEBRA_CUCA")
                  .filter((slot) => slot.position === "SIDE")
                  .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
                  .slice(0, 3)
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className="grid grid-cols-2 gap-4 group cursor-pointer"
                      onClick={() => handleSlotClick(slot)}
                    >
                      <div className="relative flex-shrink-0">
                        {slot.post?.featured_image ? (
                          <Image
                            src={slot.post.featured_image}
                            alt={slot.post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Edit2 className="text-gray-400" size={16} />
                          </div>
                        )}
                      </div>
                      <div className="">
                        {slot.post ? (
                          <>
                            <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">
                              {slot.post.category?.name || "QUEBRA CUCA"}
                            </Badge>
                            <h4 className="font-open-sans font-semibold text-lg mb-2 transition-colors">
                              {slot.post.title}
                            </h4>
                          </>
                        ) : (
                          <div className="flex items-center h-full">
                            <Edit2 className="text-gray-400" size={16} />
                            <p className="text-sm text-gray-500 ml-2">Adicionar</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* BUILD YOUR BUSINESS Banner - Ad */}
        <section className="max-w-7xl mx-auto py-6">
          <div className="text-center text-sm text-gray-500 mb-2">Banner Build Business (BUILD_BUSINESS_BANNER)</div>
          <div className="text-center text-xs text-gray-400">
            Configure em: <Link href="/admin/ads" className="text-blue-600 hover:underline">Anúncios</Link>
          </div>
        </section>

        {/* GASTRONOMIA Section */}
        <section className="max-w-7xl w-full mx-auto py-12 px-0 bg-white">
          <div className="flex items-center w-full justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]">GASTRONOMIA</h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {getSlotsBySection("GASTRONOMIA")
                .filter((slot) => slot.position === "CAROUSEL")
                .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
                .map((slot) => (
                  <CarouselItem key={slot.id} className="md:basis-1/3">
                    <div
                      className="relative h-[500px] group cursor-pointer"
                      onClick={() => handleSlotClick(slot)}
                    >
                      {slot.post?.featured_image ? (
                        <Image
                          src={slot.post.featured_image}
                          alt={slot.post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <Edit2 className="mx-auto mb-2 text-gray-400" size={24} />
                            <p className="text-sm text-gray-500">Clique para adicionar post</p>
                          </div>
                        </div>
                      )}
                      {slot.post && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <p className="font-open-sans font-semibold mb-2">
                              {slot.post.title}
                            </p>
                          </div>
                        </>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Edit2 className="text-white" size={32} />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/80 hover:bg-white" />
            <CarouselNext className="right-4 bg-white/80 hover:bg-white" />
          </Carousel>
        </section>

        {/* SUPER DICAS Section */}
        <section className="max-w-7xl mx-auto py-12 px-0 bg-white">
          <div className="flex items-center justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]">
              <span className="text-[#928575]">SUPER</span> DICAS
            </h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <div className="flex gap-10">
            {/* Main Article */}
            {(() => {
              const slot = getSlotByKey("SUPER_DICAS", "MAIN", null)
              return (
                <div
                  className="relative w-[774.77px] group cursor-pointer"
                  onClick={() => slot && handleSlotClick(slot)}
                >
                  {slot?.post?.featured_image ? (
                    <Image
                      src={slot.post.featured_image}
                      alt={slot.post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <Edit2 className="mx-auto mb-2 text-gray-400" size={24} />
                        <p className="text-sm text-gray-500">Clique para adicionar post</p>
                      </div>
                    </div>
                  )}
                  {slot?.post && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3">
                          {slot.post.category?.name || "CATEGORIA"}
                        </Badge>
                        <h3 className="text-3xl font-open-sans font-semibold mb-3">
                          {slot.post.title}
                        </h3>
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Edit2 className="text-white" size={32} />
                  </div>
                </div>
              )
            })()}

            {/* Side Articles */}
            <div className="space-y-4">
              {getSlotsBySection("SUPER_DICAS")
                .filter((slot) => slot.position === "SIDE")
                .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
                .slice(0, 3)
                .map((slot) => (
                  <div
                    key={slot.id}
                    className="flex gap-4 group cursor-pointer"
                    onClick={() => handleSlotClick(slot)}
                  >
                    <div className="flex-1">
                      {slot.post ? (
                        <>
                          <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">
                            {slot.post.category?.name || "CATEGORIA"}
                          </Badge>
                          <h4 className="font-open-sans font-semibold text-xl mb-2 transition-colors">
                            {slot.post.title}
                          </h4>
                        </>
                      ) : (
                        <div className="flex items-center h-full">
                          <Edit2 className="text-gray-400" size={16} />
                          <p className="text-sm text-gray-500 ml-2">Adicionar post</p>
                        </div>
                      )}
                    </div>
                    <div className="relative w-48 h-32 flex-shrink-0">
                      {slot.post?.featured_image ? (
                        <Image
                          src={slot.post.featured_image}
                          alt={slot.post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Edit2 className="text-gray-400" size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Dialog para selecionar post */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Selecionar Post</DialogTitle>
              <DialogDescription>
                Escolha qual post deve aparecer nesta posição
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Botão para remover post */}
              <Button
                variant="outline"
                className="w-full justify-start border-red-200 hover:bg-red-50"
                onClick={() => handleAssignPost(null)}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Remover post desta posição
              </Button>

              {/* Lista de posts em grid de 2 colunas */}
              <div className="max-h-[500px] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-3">
                  {posts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handleAssignPost(post.id)}
                      disabled={isSaving}
                      className={`group relative overflow-hidden rounded-lg border-2 transition-all hover:border-[#126861] hover:shadow-lg text-left ${
                        selectedSlot?.post_id === post.id ? 'border-[#126861] ring-2 ring-[#126861]' : 'border-gray-200'
                      }`}
                    >
                      {/* Imagem */}
                      <div className="relative w-full h-32">
                        {post.featured_image ? (
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Sem imagem</span>
                          </div>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="p-3 space-y-2">
                        {/* Tag/Categoria */}
                        {post.category && (
                          <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] text-white text-[10px] uppercase">
                            {post.category.name}
                          </Badge>
                        )}

                        {/* Título */}
                        <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight uppercase group-hover:text-[#126861]">
                          {post.title}
                        </h4>
                      </div>

                      {/* Indicador de seleção */}
                      {selectedSlot?.post_id === post.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#126861] rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

