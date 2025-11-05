"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

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

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  image_url?: string
  published_at?: string
  category?: {
    name: string
    slug: string
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003"

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([])
  const [heroPosts, setHeroPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts?per_page=20`)
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts || [])
          setFeaturedPosts(data.posts?.slice(0, 4) || [])
          setHeroPosts(data.posts?.slice(0, 3) || [])
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white pt-20">
      {/* Hero Carousel */}
      <section className="relative w-full h-[500px] mb-12">
        <Carousel className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-[500px]">
            {[1, 2, 3].map((item) => (
              <CarouselItem key={item} className="h-full">
                <div className="relative w-full h-full">
                  <Image
                    src={placeholderImages.hero}
                    alt="Hero"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute left-[268px] top-1/2 -translate-y-1/2 max-w-xl">
                    <div className="bg-white p-8 shadow-xl border-t-[6px] border-black">
                      <Badge className="bg-[#C68C0E] rounded-sm text-white mb-4">GASTRONOMIA</Badge>
                      <h1 className="text-3xl md:text-4xl font-open-sans font-semibold mb-4 text-gray-900 text-left">
                        LOREM IPSUM DOLOR SIT AMET SEE YOU
                      </h1>
                      <p className="text-base mb-6 text-gray-600 text-left">
                        Diam dis. Id taciti sagittis ligula eget vel mi dictum nunc cras donec mi
                        placerat magnis molestie imperdiet natoque fames faucibus faucibus ipsum
                        parturient auctor ...
                      </p>
                      <div className="text-left">
                        <Button className="bg-white border-2 border-[#888888] text-[#666666] hover:bg-white font-lato text-sm italic">
                          LEIA MAIS
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-10 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" />
          <CarouselNext className="right-10 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" />
        </Carousel>
        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {[1, 2, 3].map((dot, idx) => (
            <div key={dot} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
          ))}
        </div>
      </section>

      {/* EM DESTAQUE Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">EM</span> DESTAQUE</h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Main Featured Article */}
            <div className="relative h-[500px] group">
              <Image
                src={placeholderImages.car}
                alt="Featured"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3">EMPRESAS & NEGÓCIOS</Badge>
                <h3 className="text-3xl font-open-sans font-semibold mb-3">
                  LOREM IPSUM DOLOR SIT YOU SEE CONSETETUR
                </h3>
              </div>
            </div>

            {/* Side Articles */}
            <div className="grid grid-rows-3">
              {[1, 2, 3].map((item, index) => (
                <div key={item} className={`flex gap-10 group ${index === 1 || index === 2 ? "border-t border-[#EEEEEE] py-5" : ""}`}>
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">SPORT</Badge>
                    <h4 className="font-open-sans font-semibold text-lg mb-2 max-w-56 transition-colors">
                      LOREM IPSUM DOLOR SIT YOU SEE CONSETETUR
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      Lorem ipsum dolor sit amet consectetur adipiscing mattis sit ate met you.
                    </p>
                  </div>
                  <div className="relative w-40 h-32 flex-shrink-0">
                    <Image
                      src={placeholderImages.office}
                      alt={`Article ${item}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Banner - Ad */}
      <AdBanner
        imageUrl="/ads/business-banner.jpg"
        title="Anúncio"
        backgroundColor="bg-white"
        variant="horizontal"
      />

      {/* PARA REFLEXÃO Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">PARA</span> REFLEXÃO</h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <CarouselItem key={item} className="md:basis-1/3">
                  <div className="relative h-[600px] group">
                    <Image
                      src={placeholderImages.reflection}
                      alt={`Reflection ${item}`}
                      fill
                      className="object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg" />
                    <div className="absolute bottom-12 left-8 right-8 text-white">
                      <p className="font-volkhov font-medium text-3xl max-w-xs mb-2">
                        Lorem ipsum dolor sit amet consectetur
                      </p>
                      <p className="text-lg font-lato opacity-90">
                        Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/80 hover:bg-white" />
            <CarouselNext className="right-4 bg-white/80 hover:bg-white" />
          </Carousel>
          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2, 3, 4, 5, 6].map((dot, idx) => (
              <div key={dot} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* NOSSA SAÚDE Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">NOSSA</span> SAÚDE</h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Article */}
            <div className="relative bg-white group">
              <div className="relative w-full h-72">
                <Image
                  src={placeholderImages.business}
                  alt="Health"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-4 bg-white absolute top-[60%] -translate-y-1/2 left-0 right-10">
                <h3 className="text-2xl font-open-sans font-semibold mb-3 text-gray-900">
                  ODIO CONSEQUAT LIBERO LAOREET SIT
                </h3>
                <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3 text-xs">TECH</Badge>
                <p className="text-base font-lato text-gray-600 mb-4">
                  Tristique faucibus facilisis magna sit aliquam vestibulum. Etiam aliquam magnis eros. Eros euismod curabitur. At aliquam dignissim condimentum vestibulum ad. Odio consequat ...
                </p>
                <Button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-lato text-sm uppercase rounded-sm">
                  LEIA MAIS
                </Button>
              </div>
            </div>

            {/* Side Articles */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex gap-4 group">
                  <div className="relative w-40 h-32 flex-shrink-0">
                    <Image
                      src={placeholderImages.boy}
                      alt={`Health ${item}`}
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">TECH</Badge>
                    <h4 className="font-open-sans font-semibold text-lg mb-2 transition-colors">
                      Nostra facilisi venenatis cras just
                    </h4>
                    <p className="text-base font-normal font-lato text-gray-600 line-clamp-2">
                      Tristique faucibus facilisis magna aliquam vestibulum.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ad Banner */}
            <AdBanner
              imageUrl="/ads/health-ad.jpg"
              title="Anúncio"
              backgroundColor="bg-transparent"
              className="h-full"
              variant="vertical"
            />
          </div>
        </div>
      </section>

      {/* SOBRE RELACIONAMENTOS Section (Carousel) */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">SOBRE</span> RELACIONAMENTOS</h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {[1, 2, 3].map((item) => (
                <CarouselItem key={item} className="md:basis-1/3">
                  <div className="relative h-96 group">
                    <Image
                      src={placeholderImages.health}
                      alt={`Relationship ${item}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-3xl font-open-sans font-semibold mb-3">LOREM IPUSM DOLOR AMET AT CONSE</h3>
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3">NOVO</Badge>
                      <p className="mb-4 font-lato opacity-90 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.
                      </p>
                      <Button className="bg-white text-gray-900 hover:bg-gray-100 font-lato text-sm">
                        LEN MAIS
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/80 hover:bg-white" />
            <CarouselNext className="right-4 bg-white/80 hover:bg-white" />
          </Carousel>
          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2, 3].map((dot, idx) => (
              <div key={dot} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner - Ad */}
      <AdBanner
        imageUrl="/ads/promotional-banner.jpg"
        title="Anúncio"
        backgroundColor="bg-teal-500"
        variant="horizontal"
      />

      {/* EMPRESAS & NEGÓCIOS Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">EMPRESAS</span> & NEGÓCIOS</h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Articles */}
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4 group">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src={placeholderImages.office}
                      alt={`Business ${item}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">EMPRESAS & NEGÓCIOS</Badge>
                    <h4 className="font-open-sans font-semibold text-lg mb-2 transition-colors">
                      LOREM IPUSM DOLOR SIT AMET AT CONSECTETUR
                    </h4>
                    <p className="text-sm font-lato text-gray-600 line-clamp-2 mb-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit mattis sit phasellus mollis sit aliquam sit nullam.
                    </p>
                    <Button className="bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 font-lato text-xs px-3 py-1 h-auto">
                      LIGA MAIS
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Ad Banner */}
            <AdBanner
              imageUrl="/ads/business-ad.jpg"
              title="Anúncio"
              backgroundColor="bg-transparent"
              className="h-full"
              variant="vertical"
            />
          </div>
        </div>
      </section>

      {/* ESTÉTICA & BELEZA Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">ESTÉTICA</span> & BELEZA</h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="relative h-64 group">
                <Image
                  src={placeholderImages.beauty}
                  alt={`Beauty ${item}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg" />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white text-xs">NOVO</Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-open-sans font-semibold text-sm">
                    {item === 1 && "LIGULA BIBENDUM LAOREET INCEPTOS GRAVIDA"}
                    {item === 2 && "TRISTIQUE TURPIS NAM PEDE NULLA EGESTAS"}
                    {item === 3 && "VELIT COMMODO NONUMMY MALESUADA FACILISI"}
                    {item === 4 && "VEL INTEGER LAOREET PRIMIS LOBORTIS TELLUS ELEMENTUM"}
                    {item === 5 && "SCELERISQUE CURABITUR CLASS TEMPOR ORNARE"}
                    {item === 6 && "UT SUSCIPIT EROS NISL SENECTUS QUISQUE LEO"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RINDO À TOA & QUEBRA CUCA Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* RINDO À TOA */}
            <div>
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-volkhov font-bold text-[#126861]">RINDO À TOA</h2>
                <div className="h-2 flex-1 bg-gray-300 ml-4"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4 group">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={placeholderImages.cartoon}
                        alt={`Fun ${item}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">NOVO</Badge>
                      <h4 className="font-open-sans font-semibold text-lg mb-2 transition-colors">
                        LOREM IPUSM DOLOR YOU SIT AMET
                      </h4>
                      <p className="text-sm font-lato text-gray-600 line-clamp-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit mattis sit phasellus mollis sit aliquam sit nullam.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Banner Middle */}
            <AdBanner
              imageUrl="/ads/middle-ad.jpg"
              title="Anúncio"
              backgroundColor="bg-transparent"
              className="h-full min-h-[400px]"
              variant="vertical"
            />

            {/* QUEBRA CUCA */}
            <div>
              <div className="flex items-center mb-4">
                <div className="h-2 flex-1 bg-gray-300 mr-4"></div>
                <h2 className="text-2xl font-volkhov font-bold text-[#126861]">QUEBRA CUCA</h2>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4 group">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={placeholderImages.cartoon}
                        alt={`Puzzle ${item}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">NOVO</Badge>
                      <h4 className="font-open-sans font-semibold text-lg mb-2 transition-colors">
                        LOREM IPUSM DOLOR YOU SIT AMET
                      </h4>
                      <p className="text-sm font-lato text-gray-600 line-clamp-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit mattis sit phasellus mollis sit aliquam sit nullam.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUILD YOUR BUSINESS Banner - Ad */}
      <AdBanner
        imageUrl="/ads/build-business-banner.jpg"
        title="Anúncio"
        backgroundColor="bg-orange-500"
        variant="horizontal"
      />

      {/* GASTRONOMIA Section (Carousel) */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">GASTRONOMIA</span></h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {[1, 2, 3].map((item) => (
                <CarouselItem key={item} className="md:basis-1/3">
                  <div className="relative h-80 group">
                    <Image
                      src={placeholderImages.food}
                      alt={`Food ${item}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-open-sans font-semibold mb-2">
                        Lorem ipsum dolor sit amet consectetur
                      </p>
                      <p className="text-xs font-lato opacity-90">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/80 hover:bg-white" />
            <CarouselNext className="right-4 bg-white/80 hover:bg-white" />
          </Carousel>
          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2, 3].map((dot, idx) => (
              <div key={dot} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* SUPER DICAS Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="h-3 w-full bg-gray-300"></div>
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">SUPER</span> DICAS</h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
          <p className="text-center font-lato text-xl text-gray-500 mb-8">Place for the subtitle</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Article */}
            <div className="relative h-[500px] group">
              <Image
                src={placeholderImages.car}
                alt="Tip"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3">SPORT</Badge>
                <h3 className="text-3xl font-open-sans font-semibold mb-3">
                  LOREM IPSUM DOLOR SIT YOU SEE CONSETETUR
                </h3>
              </div>
            </div>

            {/* Side Articles */}
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4 group">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src={placeholderImages.couple}
                      alt={`Tip ${item}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">SPORT</Badge>
                    <h4 className="font-open-sans font-semibold text-lg mb-2 transition-colors">
                      LOREM IPSUM DOLOR SIT YOU SEE CONSETETUR
                    </h4>
                    <p className="text-sm font-lato text-gray-600 line-clamp-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit mattis sit.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ad Banner */}
            <AdBanner
              imageUrl="/ads/tips-ad.jpg"
              title="Anúncio"
              backgroundColor="bg-transparent"
              className="h-full"
              variant="vertical"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
