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
  CarouselApi,
} from "@/components/ui/carousel"
import { AdBanner } from "@/components/ad-banner"
import { placeholderImages } from "@/lib/placeholder-images"
import { FaFacebookF, FaLinkedin, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa"
import { AiFillInstagram } from "react-icons/ai"
import { IoLogoWhatsapp, IoMdArrowForward } from "react-icons/io"
import { SocialShare } from "@/components/blog/social-share"

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
        "w-full max-w-[1080px] 2xl:max-w-7xl mx-auto flex-1 flex flex-col justify-center gap-8",
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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

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

  // Atualizar o índice do slide atual quando o carousel muda
  useEffect(() => {
    if (!carouselApi) {
      return
    }

    setCurrentSlide(carouselApi.selectedScrollSnap())

    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap())
    })
  }, [carouselApi])

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
    <div className="flex flex-col bg-white">
      {/* Hero Carousel */}
      <section className="relative w-full h-[300px] sm:h-[300px] lg:h-[350px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full"></div>
          </div>
        ) : (
          <>
            <Carousel
              className="w-full h-full"
              opts={{ loop: true }}
              setApi={setCarouselApi}
            >
              <CarouselContent className="h-[300px] sm:h-[300px] lg:h-[350px]">
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
                          <div className="flex w-full max-w-[1080px] 2xl:max-w-7xl mx-auto">
                            <div className="absolute top-1/2 -translate-y-1/2 max-sm:left-1/2 max-sm:-translate-x-1/2 w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] md:w-[calc(100%-8rem)] lg:w-auto lg:max-w-xl">
                              <div className="bg-white p-4 sm:p-4 md:p-5 shadow-xl border-t-[4px] sm:border-t-[6px] border-[#126861]">
                                <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3 sm:mb-4 text-xs sm:text-sm uppercase">
                                  {post.category?.name || "CATEGORIA"}
                                </Badge>
                                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-open-sans font-semibold mb-3 sm:mb-4 text-gray-900 text-left leading-tight line-clamp-2 uppercase">
                                  {post.title}
                                </h1>
                                {post.excerpt && (
                                  <p className="text-sm sm:text-base mb-4 sm:mb-6 text-gray-600 text-left line-clamp-2 hidden sm:block">
                                    {post.excerpt}
                                  </p>
                                )}
                                <div className="text-left">
                                  <span className="font-lato text-[10px] sm:text-xs italic text-gray-500 border border-gray-400 px-3 py-1.5 uppercase">
                                    LEIA MAIS
                                  </span>
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
              <CarouselPrevious className="left-2 sm:left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-500/60 hover:bg-gray-500/80 border-0 rounded-xl hidden sm:flex" />
              <CarouselNext className="right-2 sm:right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-500/60 hover:bg-gray-500/80 border-0 rounded-xl hidden sm:flex" />
            </Carousel>
            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {getSlots("HERO", "CAROUSEL").map((slot, idx) => (
                <button
                  key={slot.id}
                  onClick={() => carouselApi?.scrollTo(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-[#6D758F] w-6' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Ir para slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* EM DESTAQUE Section */}
      <section className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl mx-auto py-8 sm:py-12 bg-white">
        <div className="flex items-center justify-center mb-5 md:mb-0">
          <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
          <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl font-volkhov text-nowrap mx-4 sm:mx-8 lg:mx-12 font-bold text-[#126861]"><span className="text-[#928575]">EM</span> DESTAQUE</h2>
          <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
        </div>
        <p className="text-center font-lato text-sm sm:text-base lg:text-xl text-gray-500 mb-6 sm:mb-8 hidden sm:block">Place for the subtitle</p>

        <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-6 lg:gap-8">
          {/* Main Featured Article */}
          {(() => {
            const slot = getSlot("EM_DESTAQUE", "MAIN", null)
            const post = slot?.post
            const publishedDate = post?.published_at ? new Date(post.published_at) : new Date()
            const day = publishedDate.getDate()
            const month = publishedDate.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()

            return (
              <Link href={post ? `/blog/${post.slug}` : "#"} className="relative h-[300px] sm:h-[350px] lg:h-[400px] 2xl:h-[450px] group block">
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
                    {/* Date Badge - Top Left */}
                    <div className="absolute top-4 left-4 bg-[#333333] text-white text-center px-3 py-2">
                      <div className="text-2xl font-bold leading-none">{day}</div>
                      <div className="w-8 h-[2px] bg-[#C68C0E] mx-auto my-1"></div>
                      <div className="text-xs font-medium tracking-wide">{month}</div>
                    </div>

                    {/* Play Button - Center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white text-xs uppercase px-3 py-1">
                          {post.category?.name || "CATEGORIA"}
                        </Badge>
                        <span className="text-xs text-gray-300 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeWidth="2" d="M12 6v6l4 2" /></svg>
                          {publishedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-open-sans font-bold uppercase line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                    </div>
                  </>
                )}
              </Link>
            )
          })()}

          {/* Side Articles */}
          <div className="flex flex-col justify-between">
            {getSlots("EM_DESTAQUE", "SIDE").slice(0, 3).map((slot, index) => {
              const post = slot.post
              if (!post) return null
              const publishedDate = post?.published_at ? new Date(post.published_at) : new Date()

              return (
                <Link
                  key={slot.id}
                  href={`/blog/${post.slug}`}
                  className={`flex gap-4 group ${index !== 0 ? "border-t border-[#EEEEEE] pt-4" : ""} ${index !== 2 ? "pb-4" : ""}`}
                >
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs uppercase px-3 py-1">
                      {post.category?.name || "CATEGORIA"}
                    </Badge>
                    <h4 className="font-open-sans font-bold text-base lg:text-lg text-gray-900 uppercase line-clamp-2 leading-tight mb-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeWidth="2" d="M12 6v6l4 2" /></svg>
                      {publishedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}
                    </div>
                  </div>
                  <div className="relative w-32 lg:w-40 h-24 lg:h-28 flex-shrink-0">
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
        {/* Main Featured Article Mobile */}
        <div className="grid md:hidden grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-6 lg:px-0">
          {/* Side Articles */}
          <div className="grid grid-rows-2 gap-1 sm:gap-0 h-auto sm:h-[350px] lg:h-[400px] 2xl:h-[500px]">
            {getSlots("EM_DESTAQUE", "SIDE").slice(0, 2).map((slot, index) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link
                  key={slot.id}
                  href={`/blog/${post.slug}`}
                  className={`flex gap-4 sm:gap-6 lg:gap-10 group ${index === 1 || index === 2 ? "border-t border-[#EEEEEE] pt-2 sm:py-2 2xl:py-5" : ""}`}
                >
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-1 2xl:mb-2 text-xs uppercase">
                      {post.category?.name || "CATEGORIA"}
                    </Badge>
                    <h4 className="font-open-sans font-semibold text-base sm:text-lg max-w-full sm:max-w-56 transition-colors uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="relative w-28 h-28 sm:w-40 sm:h-28 flex-shrink-0 self-stretch">
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
          {(() => {
            const slot = getSlot("EM_DESTAQUE", "MAIN", null)
            const post = slot?.post
            return (
              <Link href={post ? `/blog/${post.slug}` : "#"} className="relative h-[300px] sm:h-[350px] lg:h-[400px] 2xl:h-[500px] group block">
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
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 sm:mb-3 text-xs uppercase">
                        {post.category?.name || "CATEGORIA"}
                      </Badge>
                      <h3 className="text-lg sm:text-xl lg:text-2xl 2xl:text-3xl font-open-sans font-semibold mb-2 sm:mb-3 uppercase line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </>
                )}
              </Link>
            )
          })()}
          <div className="grid grid-rows-1 gap-2 sm:gap-0 h-auto sm:h-[350px] lg:h-[400px] 2xl:h-[500px]">
            {getSlots("EM_DESTAQUE", "SIDE").slice(2, 4).map((slot, index) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link
                  key={slot.id}
                  href={`/blog/${post.slug}`}
                  className={`flex gap-4 sm:gap-6 lg:gap-10 group ${index === 1 || index === 2 ? "border-t border-[#EEEEEE] pt-4 sm:py-2 2xl:py-5" : ""}`}
                >
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-1 2xl:mb-2 text-xs uppercase">
                      {post.category?.name || "CATEGORIA"}
                    </Badge>
                    <h4 className="font-open-sans font-semibold text-base sm:text-lg max-w-full sm:max-w-56 transition-colors uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="relative w-28 h-28 sm:w-40 sm:h-28 2xl:h-32 flex-shrink-0">
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
      <section className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl mx-auto bg-white">
        <div className="flex items-center w-full mb-5 md:mb-0">
          <div className="h-2 sm:h-3 w-full bg-gray-300" />
          <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl text-center font-volkhov text-nowrap mx-2 sm:mx-8 lg:mx-12 font-bold text-[#126861]">
            <span className="text-[#928575]">PARA</span> REFLEXÃO
          </h2>
          <div className="h-2 sm:h-3 w-full bg-gray-300" />
        </div>
        <p className="text-center font-lato text-sm sm:text-base lg:text-xl text-gray-500 mb-6 sm:mb-8 hidden sm:block">Place for the subtitle</p>

        <div className="w-full max-w-[1080px] 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <Carousel className="w-full" opts={{ loop: false }}>
            <CarouselContent>
              {getSlots("PARA_REFLEXAO", "CAROUSEL").map((slot) => {
                const post = slot.post
                if (!post) return null

                return (
                  <CarouselItem key={slot.id} className="basis-5/6 md:basis-1/2 lg:basis-1/3">
                    <Link href={`/blog/${post.slug}`} className="relative h-[280px] sm:h-[320px] lg:h-[380px] group block">
                      <Image
                        src={post.featured_image || placeholderImages.reflection}
                        alt={post.title}
                        fill
                        className="object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
                      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-5 right-4 sm:right-5 text-white">
                        <p className="font-open-sans font-semibold text-base sm:text-lg lg:text-xl max-w-xs mb-2 uppercase line-clamp-2">
                          {post.title}
                        </p>
                        {post.excerpt && (
                          <p className="text-xs sm:text-sm font-lato opacity-90 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:left-4 bg-white/80 hover:bg-white hidden sm:flex" />
            <CarouselNext className="right-2 sm:right-4 bg-white/80 hover:bg-white hidden sm:flex" />
          </Carousel>
          <div className="flex justify-center mt-4 space-x-2">
            {getSlots("PARA_REFLEXAO", "CAROUSEL").map((slot, idx) => (
              <div key={slot.id} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* NOSSA SAÚDE Section */}
      <section className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl mx-auto sm:pt-4 bg-white">
        <div className="flex items-center justify-center mb-5 md:mb-0">
          <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
          <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl text-center font-volkhov text-nowrap mx-4 sm:mx-8 lg:mx-12 font-bold text-[#126861]"><span className="text-[#928575]">NOSSA</span> SAÚDE</h2>
          <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
        </div>
        <p className="text-center font-lato text-sm sm:text-base lg:text-xl text-gray-500 mb-6 sm:mb-8 hidden sm:block">Place for the subtitle</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-0">
          {/* Main Article */}
          {(() => {
            const slot = getSlot("NOSSA_SAUDE", "MAIN", null)
            const post = slot?.post
            return (
              <Link href={post ? `/blog/${post.slug}` : "#"} className="relative bg-white group md:border-b-8 border-[#B4B9C9] block min-h-[200px] sm:min-h-[350px]">
                <div className="relative w-full h-60 sm:h-72">
                  <Image
                    src={post?.featured_image || placeholderImages.business}
                    alt={post?.title || "Health"}
                    fill
                    className="object-cover"
                  />
                </div>
                {post && (
                  <div className="px-4 bg-white absolute top-[35%] sm:top-[50%] left-0 right-6 sm:right-10">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mt-4 sm:mt-5 mb-2 text-xs uppercase">
                      {post.category?.name || "CATEGORIA"}
                    </Badge>
                    <h3 className="font-open-sans font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900 uppercase line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm sm:text-base font-lato text-gray-600 mb-4 sm:mb-5 max-w-full lg:max-w-72">
                        {post.excerpt}
                      </p>
                    )}
                    {/* <Button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 -py-2 px-1 font-lato text-xs italic uppercase rounded-sm">
                      LEIA MAIS
                    </Button> */}
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
                <Link key={slot.id} href={`/blog/${post.slug}`} className="flex gap-3 sm:gap-4 group">
                  <div className="relative w-32 sm:w-40 h-auto sm:h-32 flex-shrink-0">
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
                    <h4 className="font-open-sans font-semibold text-base sm:text-lg mb-1 transition-colors uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-sm sm:text-base lg:text-base font-lato text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    {/* <Button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 -py-2 px-1 font-lato text-xs italic uppercase rounded-sm">
                      LEIA MAIS
                    </Button> */}
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
              <div className="hidden lg:block">
                <AdBanner
                  imageUrl={ad.image_url}
                  title={ad.title}
                  buttonLink={ad.link_url}
                  backgroundColor="bg-transparent"
                  className="h-[600px] object-contain"
                  imageClassName="object-contain"
                  variant="vertical"
                />
              </div>
            )
          })()}
        </div>
      </section>

      {/* SOBRE RELACIONAMENTOS Section (Carousel) */}
      <section className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl mx-auto sm:pt-4 bg-white">
        <div className="flex items-center w-full mb-5 md:mb-0">
          <div className="h-2 sm:h-3 w-full bg-gray-300" />
          <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl text-center font-volkhov md:text-nowrap mx-2 sm:mx-8 lg:mx-12 font-bold text-[#126861]">
            <span className="text-[#928575]">DICAS DE</span> RELACIONAMENTO
          </h2>
          <div className="h-2 sm:h-3 w-full bg-gray-300" />
        </div>
        <p className="text-center font-lato text-sm sm:text-base lg:text-xl text-gray-500 mb-6 sm:mb-8 hidden sm:block">Place for the subtitle</p>

        <Carousel className="w-full pl-4 sm:pl-1" >
          <CarouselContent>
            {getSlots("SOBRE_RELACIONAMENTOS", "CAROUSEL").map((slot) => {
              const post = slot.post
              if (!post) return null

              return (
                <CarouselItem key={slot.id} className="basis-5/6 md:basis-1/2 lg:basis-1/3">
                  <Link href={`/blog/${post.slug}`} className="relative bg-white group pb-24 sm:pb-32 block">
                    <div className="relative w-full h-48 sm:h-56">
                      <Image
                        src={post.featured_image || placeholderImages.business}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="px-3 sm:px-4 py-3 sm:py-4 bg-white absolute top-[30%] sm:top-[35%] left-0 right-6 sm:right-10 shadow-lg">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 sm:mb-3 text-xs uppercase">
                        {post.category?.name || "CATEGORIA"}
                      </Badge>
                      <h3 className="font-open-sans font-semibold text-base sm:text-lg lg:text-xl mb-2 text-gray-900 uppercase line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs sm:text-sm font-lato text-gray-600 mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="font-lato text-[10px] italic text-gray-500 border border-gray-300 px-2 py-1 uppercase">
                        LEIA MAIS
                      </span>
                    </div>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="left-2 top-1/3 bg-white/80 hover:bg-white hidden sm:flex" />
          <CarouselNext className="right-2 top-1/3 bg-white/80 hover:bg-white hidden sm:flex" />
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
      <section className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl mx-auto sm:pt-4 bg-white">
        <div className="flex items-center w-full mb-5 md:mb-0">
          <div className="h-2 sm:h-3 w-full bg-gray-300" />
          <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl text-center font-volkhov md:text-nowrap mx-2 sm:mx-8 lg:mx-12 font-bold text-[#126861]">
            <span className="text-[#928575] text-nowrap">EMPRESAS &</span> NEGÓCIOS
          </h2>
          <div className="h-2 sm:h-3 w-full bg-gray-300" />
        </div>
        <p className="text-center font-lato text-sm sm:text-base lg:text-xl text-gray-500 mb-6 sm:mb-8 hidden sm:block">Place for the subtitle</p>

        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          {/* Main Articles - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {getSlots("EMPRESAS_NEGOCIOS", "MAIN").slice(0, 3).map((slot, index) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link
                  key={slot.id}
                  href={`/blog/${post.slug}`}
                  className={`flex flex-col sm:flex-row gap-3 sm:gap-4 group bg-white pb-4 ${index === 0 || index === 1 ? 'border-b-2' : ''}`}
                >
                  <div className="relative w-full sm:w-60 md:w-72 h-48 sm:h-auto flex-shrink-0">
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
                    <h4 className="font-open-sans font-semibold text-base sm:text-lg mb-2 text-gray-900 uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-xs sm:text-sm font-lato text-gray-600 line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="font-lato text-[10px] italic text-gray-500 border border-gray-300 px-2 py-1 uppercase">
                      LEIA MAIS
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Right Column - Ad Banner and Smaller Articles */}
          <div className="space-y-2 border border-[#B6B6B6] p-3 sm:p-4">
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
                  className="h-64 border-none"
                  imageClassName="object-cover"
                  variant="vertical"
                />
              )
            })()}

            {/* Smaller Articles */}
            {getSlots("EMPRESAS_NEGOCIOS", "SIDE").slice(0, 3).map((slot) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link key={slot.id} href={`/blog/${post.slug}`} className="flex gap-3 sm:gap-4 group">
                  <div className="relative w-32 sm:w-40 h-24 sm:h-28 flex-shrink-0">
                    <Image
                      src={post.featured_image || placeholderImages.office}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-open-sans font-semibold text-xs sm:text-sm mb-1 text-gray-900 uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-xs font-lato text-gray-600 line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="font-lato text-[10px] italic text-gray-500 border border-gray-300 px-2 py-1 uppercase">
                      LEIA MAIS
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
        <div className="md:hidden space-y-5 px-4 sm:px-6 lg:px-0">

          {/* Smaller Articles */}
          {getSlots("EMPRESAS_NEGOCIOS", "SIDE").slice(0, 3).map((slot) => {
            const post = slot.post
            if (!post) return null

            return (
              <Link key={slot.id} href={`/blog/${post.slug}`} className="flex gap-3 sm:gap-4 group">
                <div className="relative w-32 sm:w-40 h-auto sm:h-28 flex-shrink-0">
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
                  <h4 className="font-open-sans font-semibold text-base sm:text-lg text-gray-900 uppercase line-clamp-2">
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="font-lato text-[10px] italic text-gray-500 border border-gray-300 px-2 py-1 uppercase">
                    LEIA MAIS
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ESTÉTICA & BELEZA Section */}
      <section className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl mx-auto bg-white">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-full mb-5 md:mb-0">
            <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
            <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl text-center font-volkhov md:text-nowrap mx-2 sm:mx-8 lg:mx-12 font-bold text-[#126861]">
              <span className="text-[#928575] text-nowrap">ESTÉTICA &</span> BELEZA
            </h2>
            <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
          </div>
        </div>
        <p className="text-center font-lato text-sm sm:text-base lg:text-xl text-gray-500 mb-6 sm:mb-8 hidden sm:block">Place for the subtitle</p>

        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {getSlots("ESTETICA_BELEZA", "GRID").slice(0, 6).map((slot) => {
            const post = slot.post
            if (!post) return null

            return (
              <Link key={slot.id} href={`/blog/${post.slug}`} className="relative h-48 sm:h-56 lg:h-64 group block">
                <Image
                  src={post.featured_image || placeholderImages.beauty}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                  <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs uppercase">
                    {post.category?.name || "ESTÉTICA & BELEZA"}
                  </Badge>
                  <p className="font-open-sans font-semibold text-sm sm:text-base lg:text-lg uppercase line-clamp-2">
                    {post.title}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="md:hidden w-full max-w-[1080px] 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <Carousel className="w-full" opts={{ loop: false }}>
            <CarouselContent>
              {getSlots("ESTETICA_BELEZA", "GRID").map((slot) => {
                const post = slot.post
                if (!post) return null

                return (
                  <CarouselItem key={slot.id} className="basis-5/6 md:basis-1/2 lg:basis-1/3">
                    <Link href={`/blog/${post.slug}`} className="relative h-[300px] sm:h-[400px] lg:h-[500px] group block">
                      <Image
                        src={post.featured_image || placeholderImages.reflection}
                        alt={post.title}
                        fill
                        className="object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
                      <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 text-white">
                        <p className="font-open-sans font-semibold text-base sm:text-lg lg:text-3xl max-w-xs mb-2 uppercase line-clamp-2">
                          {post.title}
                        </p>
                      </div>
                    </Link>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:left-4 bg-white/80 hover:bg-white hidden sm:flex" />
            <CarouselNext className="right-2 sm:right-4 bg-white/80 hover:bg-white hidden sm:flex" />
          </Carousel>
          <div className="flex justify-center mt-4 space-x-2">
            {getSlots("PARA_REFLEXAO", "CAROUSEL").map((slot, idx) => (
              <div key={slot.id} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>

      </section>

      {/* RINDO À TOA & QUEBRA CUCA Section */}
      <section className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl mx-auto sm:pt-4 bg-white">
        <div className="hidden md:flex items-center justify-center mb-6 sm:mb-10">
          <div className="flex items-center justify-center w-full">
            <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl 2xl:text-5xl font-volkhov text-nowrap mx-2 sm:mx-6 lg:mx-12 font-bold text-[#928575]">RINDO À TOA</h2>
            <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
            <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl 2xl:text-5xl font-volkhov text-nowrap mx-2 sm:mx-6 lg:mx-12 font-bold text-[#126861]">QUEBRA CUCA</h2>
          </div>
        </div>
        <div className="flex md:hidden items-center justify-center">
          <div className="flex items-center justify-center w-full mb-5 md:mb-0">
            <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
            <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl text-center font-volkhov md:text-nowrap mx-2 sm:mx-8 lg:mx-12 font-bold text-[#126861]">
              <span className="text-[#928575] text-nowrap">RINDO à TOA &</span> QUEBRA CUCA
            </h2>
            <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-0">
          {/* RINDO À TOA */}
          <div>
            <div className="space-y-4">
              {getSlots("RINDO_A_TOA", "SIDE").slice(0, 3).map((slot) => {
                const post = slot.post
                if (!post) return null

                return (
                  <Link key={slot.id} href={`/blog/${post.slug}`} className="grid grid-cols-2 gap-3 sm:gap-4 group">
                    <div className="flex-1 text-start">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-1 sm:mb-2 text-xs uppercase">
                        {post.category?.name || "RINDO À TOA"}
                      </Badge>
                      <h4 className="font-open-sans font-semibold text-base sm:text-lg lg:text-lg mb-1 sm:mb-2 transition-colors uppercase line-clamp-2">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="relative flex-shrink-0 w-auto sm:w-auto h-auto sm:h-40">
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
              <div className="hidden lg:block">
                <AdBanner
                  imageUrl={ad.image_url}
                  title={ad.title}
                  buttonLink={ad.link_url}
                  backgroundColor="bg-transparent"
                  className="h-full min-h-[400px]"
                  imageClassName=""
                  variant="vertical"
                />
              </div>
            )
          })()}

          {/* QUEBRA CUCA */}
          <div>
            <div className="space-y-4">
              {getSlots("QUEBRA_CUCA", "SIDE").slice(0, 3).map((slot) => {
                const post = slot.post
                if (!post) return null

                return (
                  <Link key={slot.id} href={`/blog/${post.slug}`} className="grid grid-cols-2 gap-3 sm:gap-4 group">
                    <div className="relative flex-shrink-0 w-auto sm:w-auto h-auto sm:h-40 text-start">
                      <Image
                        src={post.featured_image || placeholderImages.cartoon}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-1 sm:mb-2 text-xs uppercase">
                        {post.category?.name || "QUEBRA CUCA"}
                      </Badge>
                      <h4 className="font-open-sans font-semibold text-base sm:text-lg lg:text-lg mb-1 sm:mb-2 transition-colors uppercase line-clamp-2">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
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
      <section className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl pt-5 mx-auto bg-white">
        <div className="flex items-center w-full justify-center mb-5 md:mb-0">
          <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
          <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl text-center font-volkhov md:text-nowrap mx-4 sm:mx-8 lg:mx-12 font-bold text-[#126861]">GASTRONOMIA</h2>
          <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
        </div>
        <p className="text-center font-lato text-sm sm:text-base lg:text-xl text-gray-500 mb-6 sm:mb-8 hidden sm:block">Place for the subtitle</p>
        <div className="pl-4 sm:pl-6 lg:pl-0">
          <Carousel className="w-full" opts={{ loop: false }}>
            <CarouselContent>
              {getSlots("GASTRONOMIA", "CAROUSEL").map((slot) => {
                const post = slot.post
                if (!post) return null

                return (
                  <CarouselItem key={slot.id} className="basis-5/6 md:basis-1/2 lg:basis-1/3">
                    <Link href={`/blog/${post.slug}`} className="relative h-[280px] sm:h-[320px] lg:h-[380px] group block">
                      <Image
                        src={post.featured_image || placeholderImages.food}
                        alt={post.title}
                        fill
                        className="object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
                      <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 text-white">
                        <p className="font-open-sans font-semibold text-base sm:text-lg uppercase line-clamp-2 mb-1">
                          {post.title}
                        </p>
                        {post.excerpt && (
                          <p className="text-xs sm:text-sm font-lato opacity-90 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:left-4 bg-white/80 hover:bg-white hidden sm:flex" />
            <CarouselNext className="right-2 sm:right-4 bg-white/80 hover:bg-white hidden sm:flex" />
          </Carousel>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {getSlots("GASTRONOMIA", "CAROUSEL").map((slot, idx) => (
            <div key={slot.id} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
          ))}
        </div>
      </section>

      {/* SUPER DICAS Section */}
      <section className="w-full max-w-[720px] lg:max-w-[1080px] 2xl:max-w-7xl pt-5 mx-auto bg-white">
        <div className="flex items-center justify-center mb-5 md:mb-0">
          <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
          <h2 className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl 2xl:text-5xl text-center font-volkhov text-nowrap mx-4 sm:mx-8 lg:mx-12 font-bold text-[#126861]"><span className="text-[#928575]">SUPER</span> DICAS</h2>
          <div className="h-2 sm:h-3 w-full bg-gray-300"></div>
        </div>
        <p className="text-center font-lato text-sm sm:text-base lg:text-xl text-gray-500 mb-6 sm:mb-8 hidden sm:block">Place for the subtitle</p>

        <div className="hidden md:flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-6 lg:px-0">
          {/* Main Article */}
          {(() => {
            const slot = getSlot("SUPER_DICAS", "MAIN", null)
            const post = slot?.post
            return (
              <Link href={post ? `/blog/${post.slug}` : "#"} className="relative w-full md:w-[60%] lg:w-[774.77px] h-auto group block">
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
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 sm:mb-3 text-xs uppercase">
                        {post.category?.name || "CATEGORIA"}
                      </Badge>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-open-sans font-semibold mb-2 sm:mb-3 uppercase line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </>
                )}
              </Link>
            )
          })()}

          {/* Side Articles */}
          <div className="space-y-4 flex-1">
            {getSlots("SUPER_DICAS", "SIDE").slice(0, 3).map((slot) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link key={slot.id} href={`/blog/${post.slug}`} className="flex gap-3 sm:gap-4 group">
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-1 sm:mb-2 text-xs uppercase">
                      {post.category?.name || "CATEGORIA"}
                    </Badge>
                    <h4 className="font-open-sans font-semibold text-base sm:text-lg lg:text-xl mb-1 sm:mb-2 transition-colors uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-xs sm:text-sm font-lato text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="relative w-40 sm:w-48 h-28 sm:h-32 flex-shrink-0">
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
        <div className="grid md:hidden grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-6 lg:px-0">
          {/* Side Articles */}
          <div className="grid grid-rows-2 gap-4 sm:gap-0 h-auto sm:h-[350px] lg:h-[400px] 2xl:h-[500px]">
            {getSlots("SUPER_DICAS", "SIDE").slice(0, 2).map((slot, index) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link
                  key={slot.id}
                  href={`/blog/${post.slug}`}
                  className={`flex gap-4 sm:gap-6 lg:gap-10 group ${index === 1 || index === 2 ? "border-t border-[#EEEEEE] pt-4 sm:py-2 2xl:py-5" : ""}`}
                >
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-1 2xl:mb-2 text-xs">
                      {post.category?.name || "CATEGORIA"}
                    </Badge>
                    <h4 className="font-open-sans font-semibold text-base sm:text-lg max-w-full sm:max-w-56 transition-colors uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="relative w-32 sm:w-40 h-auto sm:h-28 2xl:h-32 flex-shrink-0">
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
          {(() => {
            const slot = getSlot("SUPER_DICAS", "MAIN", null)
            const post = slot?.post
            return (
              <Link href={post ? `/blog/${post.slug}` : "#"} className="relative h-[300px] sm:h-[350px] lg:h-[400px] 2xl:h-[500px] group block">
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
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 sm:mb-3 text-xs">
                        {post.category?.name || "CATEGORIA"}
                      </Badge>
                      <h3 className="text-lg sm:text-xl lg:text-2xl 2xl:text-3xl font-open-sans font-semibold mb-2 sm:mb-3 uppercase line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </>
                )}
              </Link>
            )
          })()}
          <div className="grid grid-rows-1 gap-4 sm:gap-0 h-auto sm:h-[350px] lg:h-[400px] 2xl:h-[500px]">
            {getSlots("SUPER_DICAS", "SIDE").slice(2, 4).map((slot, index) => {
              const post = slot.post
              if (!post) return null

              return (
                <Link
                  key={slot.id}
                  href={`/blog/${post.slug}`}
                  className={`flex gap-4 sm:gap-6 lg:gap-10 group ${index === 1 || index === 2 ? "border-t border-[#EEEEEE] pt-4 sm:py-2 2xl:py-5" : ""}`}
                >
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-1 2xl:mb-2 text-xs">
                      {post.category?.name || "CATEGORIA"}
                    </Badge>
                    <h4 className="font-open-sans font-semibold text-base sm:text-lg max-w-full sm:max-w-56 transition-colors uppercase line-clamp-2">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="relative w-32 sm:w-40 h-24 sm:h-28 2xl:h-32 flex-shrink-0">
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
        {/* Social Share */}
        <div className="flex justify-center">
          <SocialShare />
        </div>
      </section>
    </div>
  )
}
