"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { AdBanner } from "@/components/ad-banner"
import { placeholderImages } from "@/lib/placeholder-images"

const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")

const SectionWrapper = ({
  children,
  className,
  contentClassName,
}: {
  children: ReactNode
  className?: string
  contentClassName?: string
}) => (
  <section
    className={cn(
      "w-full bg-white px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col justify-center min-h-[calc(100svh-6rem)]",
      className,
    )}
  >
    <div
      className={cn(
        "w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center gap-8",
        contentClassName,
      )}
    >
      {children}
    </div>
  </section>
)

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  featured_image?: string
  published_at?: string
  category?: {
    name: string
    slug: string
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

interface Ad {
  id: string
  title: string
  image_url: string
  link_url: string
  position: string
  active: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

export default function Home() {
  const [slots, setSlots] = useState<HomeSlot[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

        if (adsRes.ok) {
          const adsData = await adsRes.json()
          setAds(adsData.ads || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Função auxiliar para buscar slots por seção e posição
  const getSlot = (section: string, position: string, slotIndex: number | null = null) => {
    return slots.find(
      (slot) =>
        slot.section === section &&
        slot.position === position &&
        slot.slot_index === slotIndex
    )
  }

  // Função auxiliar para buscar múltiplos slots por seção e posição
  const getSlots = (section: string, position: string) => {
    return slots
      .filter((slot) => slot.section === section && slot.position === position)
      .sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0))
  }

  // Função auxiliar para buscar anúncio por posição
  const getAd = (position: string) => {
    return ads.find((ad) => ad.position === position && ad.active)
  }

  return (
    <div className="flex flex-col bg-white pt-20">
      {/* Hero Carousel */}
      <section className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full"></div>
          </div>
        ) : (
          <>
            <Carousel className="w-full h-full" opts={{ loop: true }}>
              <CarouselContent className="h-[350px]">
                {getSlots("HERO", "CAROUSEL").map((slot, index) => {
                  const post = slot.post
                  if (!post) return null

                  return (
                    <CarouselItem key={slot.id} className="h-full">
                      <Link href={`/blog/${post.slug}`} className="relative w-full h-full block">
                        <div className="relative w-full h-full">
                          <div>
                            <Image
                              src={post.featured_image || placeholderImages.hero}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex max-w-7xl mx-auto w-full">
                            <div className="absolute top-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] md:w-[calc(100%-8rem)] lg:w-auto lg:max-w-xl">
                              <div className="bg-white p-4 sm:p-4 md:p-5 shadow-xl border-t-[4px] sm:border-t-[6px] border-black">
                                <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3 sm:mb-4 text-xs sm:text-sm">
                                  {post.category?.name || "CATEGORIA"}
                                </Badge>
                                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-open-sans font-semibold mb-3 sm:mb-4 text-gray-900 text-left leading-tight line-clamp-2">
                                  {post.title}
                                </h1>
                                {post.excerpt && (
                                  <p className="text-sm sm:text-base mb-4 sm:mb-6 text-gray-600 text-left line-clamp-2">
                                    {post.excerpt}
                                  </p>
                                )}
                                <div className="text-left">
                                  <Button className="bg-white border-2 border-[#888888] text-[#666666] hover:bg-white font-lato text-xs sm:text-sm italic px-4 sm:px-6 py-2">
                                    LEIA MAIS
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:left-4 md:left-10 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white hidden sm:flex" />
              <CarouselNext className="right-2 sm:right-4 md:right-10 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white hidden sm:flex" />
            </Carousel>
            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {getSlots("HERO", "CAROUSEL").map((slot, idx) => (
                <div key={slot.id} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* EM DESTAQUE Section */}
      <section className="max-w-7xl mx-auto py-12 px-0 bg-white">
        <div className="flex items-center justify-center">
          <div className="h-3 w-full bg-gray-300"></div>
          <h2 className=" text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">EM</span> DESTAQUE</h2>
          <div className="h-3 w-full bg-gray-300"></div>
        </div>
        <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Main Featured Article */}
          {(() => {
            const slot = getSlot("EM_DESTAQUE", "MAIN", null)
            const post = slot?.post
            return (
              <Link href={post ? `/blog/${post.slug}` : "#"} className="relative h-[400px] 2xl:h-[500px] group block">
                {post?.featured_image ? (
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200"></div>
                )}
                {post && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3">
                        {post.category?.name || "CATEGORIA"}
                      </Badge>
                      <h3 className="text-2xl 2xl:text-3xl font-open-sans font-semibold mb-3 uppercase line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </>
                )}
              </Link>
            )
          })()}

          {/* Side Articles */}
          <div className="grid grid-rows-3 h-[400px] 2xl:h-[500px]">
            {getSlots("EM_DESTAQUE", "SIDE").slice(0, 3).map((slot, index) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link
                  key={slot.id}
                  href={`/blog/${post.slug}`}
                  className={`flex gap-10 group ${index === 1 || index === 2 ? "border-t border-[#EEEEEE] py-2 2xl:py-5" : ""}`}
                >
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-1 2xl:mb-2 text-xs">
                      {post.category?.name || "CATEGORIA"}
                    </Badge>
                    <h4 className="font-open-sans font-semibold text-lg max-w-56 transition-colors uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="relative w-40 h-28 2xl:h-32 flex-shrink-0">
                    <Image
                      src={post.featured_image || placeholderImages.office}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Business Banner - Ad */}
      {(() => {
        const ad = getAd("BUSINESS_BANNER_1")
        if (!ad) return null
        return (
          <AdBanner
            imageUrl={ad.image_url}
            title={ad.title}
            buttonLink={ad.link_url}
            backgroundColor="bg-white"
            variant="horizontal"
          />
        )
      })()}

      {/* PARA REFLEXÃO Section */}
      <section className="max-w-7xl mx-auto w-full py-12 px-0 bg-white">
        <div className="mx-auto w-full items-center justify-center">
          <div className="flex items-center justify-center w-full">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">PARA</span> REFLEXÃO</h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
        </div>
        <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {getSlots("PARA_REFLEXAO", "CAROUSEL").map((slot) => {
              const post = slot.post
              if (!post) return null

              return (
                <CarouselItem key={slot.id} className="md:basis-1/3">
                  <Link href={`/blog/${post.slug}`} className="relative h-[600px] group block">
                    <Image
                      src={post.featured_image || placeholderImages.reflection}
                      alt={post.title}
                      fill
                      className="object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-12 left-8 right-8 text-white">
                      <p className="font-volkhov font-medium text-3xl max-w-xs mb-2 uppercase line-clamp-2">
                        {post.title}
                      </p>
                      {post.excerpt && (
                        <p className="text-lg font-lato opacity-90 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/80 hover:bg-white" />
          <CarouselNext className="right-4 bg-white/80 hover:bg-white" />
        </Carousel>
        <div className="flex justify-center mt-4 space-x-2">
          {getSlots("PARA_REFLEXAO", "CAROUSEL").map((slot, idx) => (
            <div key={slot.id} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
          ))}
        </div>
      </section>

      {/* NOSSA SAÚDE Section */}
      <section className="max-w-7xl mx-auto w-full py-12 px-0 bg-white">
        <div className="flex items-center justify-center">
          <div className="h-3 w-full bg-gray-300"></div>
          <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">NOSSA</span> SAÚDE</h2>
          <div className="h-3 w-full bg-gray-300"></div>
        </div>
        <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Article */}
          {(() => {
            const slot = getSlot("NOSSA_SAUDE", "MAIN", null)
            const post = slot?.post
            return (
              <Link href={post ? `/blog/${post.slug}` : "#"} className="relative bg-white group border-b-8 border-[#B4B9C9] block">
                <div className="relative w-full h-72">
                  <Image
                    src={post?.featured_image || placeholderImages.business}
                    alt={post?.title || "Health"}
                    fill
                    className="object-cover"
                  />
                </div>
                {post && (
                  <div className="px-4 bg-white absolute top-[40%] left-0 right-10">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mt-5 mb-2 text-xs uppercase">
                      {post.category?.name || "CATEGORIA"}
                    </Badge>
                    <h3 className="text-2xl font-open-sans font-semibold mb-3 text-gray-900 uppercase line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-base font-lato text-gray-600 mb-5 max-w-72 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <Button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-lato text-sm uppercase rounded-sm">
                      LEIA MAIS
                    </Button>
                  </div>
                )}
              </Link>
            )
          })()}

          {/* Side Articles */}
          <div className="space-y-4">
            {getSlots("NOSSA_SAUDE", "SIDE").slice(0, 4).map((slot) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link key={slot.id} href={`/blog/${post.slug}`} className="flex gap-4 group">
                  <div className="relative w-40 h-32 flex-shrink-0">
                    <Image
                      src={post.featured_image || placeholderImages.boy}
                      alt={post.title}
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-1 text-xs uppercase">
                      {post.category?.name || "CATEGORIA"}
                    </Badge>
                    <h4 className="font-open-sans font-semibold text-lg mb-2 transition-colors uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-base font-normal font-lato text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Ad Banner - Tamanho: 300x600px */}
          {(() => {
            const ad = getAd("NOSSA_SAUDE_RIGHT")
            if (!ad) return null
            return (
              <AdBanner
                imageUrl={ad.image_url}
                title={ad.title}
                buttonLink={ad.link_url}
                backgroundColor="bg-transparent"
                className="h-[600px]"
                variant="vertical"
              />
            )
          })()}
        </div>
      </section>

      {/* SOBRE RELACIONAMENTOS Section (Carousel) */}
      <section className="max-w-7xl mx-auto h-full w-full py-12 px-0 bg-white">
        <div className="mx-auto w-full items-center justify-center">
          <div className="flex items-center justify-center w-full">
            <div className="h-3 w-full bg-gray-300" />
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">SOBRE</span> RELACIONAMENTOS</h2>
            <div className="h-3 w-full bg-gray-300" />
          </div>
        </div>
        <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {getSlots("SOBRE_RELACIONAMENTOS", "CAROUSEL").map((slot) => {
              const post = slot.post
              if (!post) return null

              return (
                <CarouselItem key={slot.id} className="md:basis-1/3">
                  <Link href={`/blog/${post.slug}`} className="relative bg-white group pb-32 block">
                    <div className="relative w-full h-72">
                      <Image
                        src={post.featured_image || placeholderImages.business}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="px-4 py-4 bg-white absolute top-[40%] left-0 right-10 shadow-lg">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3 text-xs uppercase">
                        {post.category?.name || "CATEGORIA"}
                      </Badge>
                      <h3 className="text-2xl font-open-sans font-semibold mb-2 text-gray-900 uppercase line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-base font-lato text-gray-600 mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <Button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-lato text-sm uppercase rounded-sm">
                        LEIA MAIS
                      </Button>
                    </div>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="left-2 top-1/3 bg-white/80 hover:bg-white" />
          <CarouselNext className="right-2 top-1/3 bg-white/80 hover:bg-white" />
        </Carousel>
        <div className="flex justify-center mt-4 space-x-2">
          {getSlots("SOBRE_RELACIONAMENTOS", "CAROUSEL").map((slot, idx) => (
            <div key={slot.id} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
          ))}
        </div>
      </section>

      {/* Promotional Banner - Ad */}
      {(() => {
        const ad = getAd("PROMOTIONAL_BANNER_1")
        if (!ad) return null
        return (
          <AdBanner
            imageUrl={ad.image_url}
            title={ad.title}
            buttonLink={ad.link_url}
            backgroundColor="bg-transparent"
            variant="horizontal"
          />
        )
      })()}

      {/* EMPRESAS & NEGÓCIOS Section */}
      <section className="max-w-7xl mx-auto py-12 px-0 bg-white">
        <div className="flex items-center justify-center">
          <div className="h-3 w-full bg-gray-300"></div>
          <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">EMPRESAS</span> & NEGÓCIOS</h2>
          <div className="h-3 w-full bg-gray-300"></div>
        </div>
        <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Articles - Left Column */}
          <div className="md:col-span-2 space-y-4">
            {getSlots("EMPRESAS_NEGOCIOS", "MAIN").slice(0, 3).map((slot, index) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link
                  key={slot.id}
                  href={`/blog/${post.slug}`}
                  className={`flex gap-4 group bg-white pb-4 ${index === 0 || index === 1 ? 'border-b-2' : ''}`}
                >
                  <div className="relative w-72 h-44 flex-shrink-0">
                    <Image
                      src={post.featured_image || placeholderImages.office}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs uppercase">
                      {post.category?.name || "EMPRESAS & NEGÓCIOS"}
                    </Badge>
                    <h4 className="font-open-sans font-semibold text-lg mb-2 text-gray-900 uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-sm font-lato text-gray-600 line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                    )}
                    <Button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-lato text-xs px-3 py-1 h-auto uppercase">
                      LEIA MAIS
                    </Button>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Right Column - Ad Banner and Smaller Articles */}
          <div className="space-y-2 border border-[#B6B6B6] p-4">
            {/* Ad Banner */}
            {(() => {
              const ad = getAd("EMPRESAS_NEGOCIOS_RIGHT")
              if (!ad) return null
              return (
                <AdBanner
                  imageUrl={ad.image_url}
                  title={ad.title}
                  buttonLink={ad.link_url}
                  backgroundColor="bg-transparent"
                  className="h-56 border-none"
                  variant="vertical"
                />
              )
            })()}

            {/* Smaller Articles */}
            {getSlots("EMPRESAS_NEGOCIOS", "SIDE").slice(0, 3).map((slot) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link key={slot.id} href={`/blog/${post.slug}`} className="flex gap-4 group">
                  <div className="relative w-40 h-28 flex-shrink-0">
                    <Image
                      src={post.featured_image || placeholderImages.office}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-open-sans font-semibold text-sm mb-1 text-gray-900 uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-xs font-lato text-gray-600 line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                    )}
                    <Button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-lato text-xs px-2 py-1 h-auto uppercase">
                      LEIA MAIS
                    </Button>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ESTÉTICA & BELEZA Section */}
      <section className="max-w-7xl w-full mx-auto py-12 px-0 bg-white">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-full">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">ESTÉTICA</span> & BELEZA</h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
        </div>
        <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {getSlots("ESTETICA_BELEZA", "GRID").slice(0, 6).map((slot) => {
            const post = slot.post
            if (!post) return null

            return (
              <Link key={slot.id} href={`/blog/${post.slug}`} className="relative h-64 group block">
                <Image
                  src={post.featured_image || placeholderImages.beauty}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-open-sans font-semibold text-lg uppercase line-clamp-2">
                    {post.title}
                  </p>
                </div>
              </Link>
            )
          })}
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
              {getSlots("RINDO_A_TOA", "SIDE").slice(0, 3).map((slot) => {
                const post = slot.post
                if (!post) return null

                return (
                  <Link key={slot.id} href={`/blog/${post.slug}`} className="grid grid-cols-2 gap-4 group">
                    <div className="flex-1 text-end">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs uppercase">
                        {post.category?.name || "RINDO À TOA"}
                      </Badge>
                      <h4 className="font-open-sans font-semibold text-lg mb-2 transition-colors uppercase line-clamp-2">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-sm font-lato text-gray-600 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="relative flex-shrink-0">
                      <Image
                        src={post.featured_image || placeholderImages.cartoon}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Ad Banner Middle */}
          {(() => {
            const ad = getAd("RINDO_A_TOA_MIDDLE")
            if (!ad) return null
            return (
              <AdBanner
                imageUrl={ad.image_url}
                title={ad.title}
                buttonLink={ad.link_url}
                backgroundColor="bg-transparent"
                className="h-full min-h-[400px]"
                variant="vertical"
              />
            )
          })()}

          {/* QUEBRA CUCA */}
          <div>
            <div className="space-y-4">
              {getSlots("QUEBRA_CUCA", "SIDE").slice(0, 3).map((slot) => {
                const post = slot.post
                if (!post) return null

                return (
                  <Link key={slot.id} href={`/blog/${post.slug}`} className="grid grid-cols-2 gap-4 group">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={post.featured_image || placeholderImages.cartoon}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs uppercase">
                        {post.category?.name || "QUEBRA CUCA"}
                      </Badge>
                      <h4 className="font-open-sans font-semibold text-lg mb-2 transition-colors uppercase line-clamp-2">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-sm font-lato text-gray-600 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* BUILD YOUR BUSINESS Banner - Ad */}
      {(() => {
        const ad = getAd("BUILD_BUSINESS_BANNER")
        if (!ad) return null
        return (
          <AdBanner
            imageUrl={ad.image_url}
            title={ad.title}
            buttonLink={ad.link_url}
            backgroundColor="bg-transparent"
            variant="horizontal"
          />
        )
      })()}

      {/* GASTRONOMIA Section (Carousel) */}
      <section className="max-w-7xl w-full mx-auto py-12 px-0 bg-white">
        <div className="flex items-center w-full justify-center">
          <div className="h-3 w-full bg-gray-300"></div>
          <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]">GASTRONOMIA</h2>
          <div className="h-3 w-full bg-gray-300"></div>
        </div>
        <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {getSlots("GASTRONOMIA", "CAROUSEL").map((slot) => {
              const post = slot.post
              if (!post) return null

              return (
                <CarouselItem key={slot.id} className="md:basis-1/3">
                  <Link href={`/blog/${post.slug}`} className="relative h-[500px] group block">
                    <Image
                      src={post.featured_image || placeholderImages.food}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-open-sans font-semibold mb-2 uppercase line-clamp-2">
                        {post.title}
                      </p>
                      {post.excerpt && (
                        <p className="text-xs font-lato opacity-90 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/80 hover:bg-white" />
          <CarouselNext className="right-4 bg-white/80 hover:bg-white" />
        </Carousel>
        <div className="flex justify-center mt-4 space-x-2">
          {getSlots("GASTRONOMIA", "CAROUSEL").map((slot, idx) => (
            <div key={slot.id} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
          ))}
        </div>
      </section>

      {/* SUPER DICAS Section */}
      <section className="max-w-7xl mx-auto py-12 px-0 bg-white">
        <div className="flex items-center justify-center">
          <div className="h-3 w-full bg-gray-300"></div>
          <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">SUPER</span> DICAS</h2>
          <div className="h-3 w-full bg-gray-300"></div>
        </div>
        <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

        <div className="flex gap-10">
          {/* Main Article */}
          {(() => {
            const slot = getSlot("SUPER_DICAS", "MAIN", null)
            const post = slot?.post
            return (
              <Link href={post ? `/blog/${post.slug}` : "#"} className="relative w-[774.77px] group block">
                {post?.featured_image ? (
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200"></div>
                )}
                {post && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3 uppercase">
                        {post.category?.name || "CATEGORIA"}
                      </Badge>
                      <h3 className="text-3xl font-open-sans font-semibold mb-3 uppercase line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </>
                )}
              </Link>
            )
          })()}

          {/* Side Articles */}
          <div className="space-y-4">
            {getSlots("SUPER_DICAS", "SIDE").slice(0, 3).map((slot) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link key={slot.id} href={`/blog/${post.slug}`} className="flex gap-4 group">
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs uppercase">
                      {post.category?.name || "CATEGORIA"}
                    </Badge>
                    <h4 className="font-open-sans font-semibold text-xl mb-2 transition-colors uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-sm font-lato text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="relative w-48 h-32 flex-shrink-0">
                    <Image
                      src={post.featured_image || placeholderImages.couple}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
