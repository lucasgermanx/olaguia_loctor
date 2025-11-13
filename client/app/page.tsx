"use client"

import Image from "next/image"
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
    <div className="flex flex-col bg-white pt-20">
      {/* Hero Carousel */}
      <section className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px]">
        <Carousel className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-[350px]">
            {[1, 2, 3].map((item) => (
              <CarouselItem key={item} className="h-full">
                <div className="relative w-full h-full">
                  <div>
                    <Image
                      src={placeholderImages.hero}
                      alt="Hero"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex max-w-7xl mx-auto w-full">
                    <div className="absolute top-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] md:w-[calc(100%-8rem)] lg:w-auto lg:max-w-xl">
                      <div className="bg-white p-4 sm:p-4 md:p-5 shadow-xl border-t-[4px] sm:border-t-[6px] border-black">
                        <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3 sm:mb-4 text-xs sm:text-sm">GASTRONOMIA</Badge>
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-open-sans font-semibold mb-3 sm:mb-4 text-gray-900 text-left leading-tight">
                          LOREM IPSUM DOLOR SIT AMET SEE YOU
                        </h1>
                        <p className="text-sm sm:text-base mb-4 sm:mb-6 text-gray-600 text-left line-clamp-3 sm:line-clamp-none">
                          Diam dis. Id taciti sagittis ligula eget vel mi dictum nunc cras donec mi
                          placerat magnis molestie imperdiet natoque fames faucibus faucibus ipsum
                          parturient auctor ...
                        </p>
                        <div className="text-left">
                          <Button className="bg-white border-2 border-[#888888] text-[#666666] hover:bg-white font-lato text-xs sm:text-sm italic px-4 sm:px-6 py-2">
                            LEIA MAIS
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:left-4 md:left-10 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white hidden sm:flex" />
          <CarouselNext className="right-2 sm:right-4 md:right-10 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white hidden sm:flex" />
        </Carousel>
        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {[1, 2, 3].map((dot, idx) => (
            <div key={dot} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
          ))}
        </div>
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
          <div className="relative h-[400px] 2xl:h-[500px] group">
            <Image
              src={placeholderImages.car}
              alt="Featured"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3">EMPRESAS & NEGÓCIOS</Badge>
              <h3 className="text-2xl 2xl:text-3xl font-open-sans font-semibold mb-3">
                LOREM IPSUM DOLOR SIT YOU SEE CONSETETUR
              </h3>
            </div>
          </div>

          {/* Side Articles */}
          <div className="grid grid-rows-3 h-[400px] 2xl:h-[500px]">
            {[1, 2, 3].map((item, index) => (
              <div key={item} className={`flex gap-10 group ${index === 1 || index === 2 ? "border-t border-[#EEEEEE] py-2 2xl:py-5" : ""}`}>
                <div className="flex-1">
                  <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-1 2xl:mb-2 text-xs">SPORT</Badge>
                  <h4 className="font-open-sans font-semibold text-lg max-w-56 transition-colors">
                    LOREM IPSUM DOLOR SIT YOU SEE CONSETETUR
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    Lorem ipsum dolor sit amet consectetur adipiscing mattis sit ate met you.
                  </p>
                </div>
                <div className="relative w-40 h-28 2xl:h-32 flex-shrink-0">
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
      </section>

      {/* Business Banner - Ad */}
      {/* O tamanho desse banner depende dos estilos internos do componente AdBanner e do layout, 
          mas, normalmente, banners horizontais como este costumam ter dimensões como: 
          Largura: 1140px; Altura: 120px (desktop padrão).
          Confirme no componente AdBanner para os valores exatos ou defina 'className' aqui se necessário. */}
      <AdBanner
        imageUrl="https://www.shutterstock.com/image-photo/sky-blue-clear-no-clouds-600w-2629823399.jpg"
        title="Anúncio"
        backgroundColor="bg-white"
        variant="horizontal"
      // Exemplo para definir tamanho explícito (ajuste ou remova conforme seu design):
      // className="w-[1140px] h-[120px]"
      />

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
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <CarouselItem key={item} className="md:basis-1/3">
                <div className="relative h-[600px] group">
                  <Image
                    src={placeholderImages.reflection}
                    alt={`Reflection ${item}`}
                    fill
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
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
          <div className="relative bg-white group border-b-8 border-[#B4B9C9]">
            <div className="relative w-full h-72">
              <Image
                src={placeholderImages.business}
                alt="Health"
                fill
                className="object-cover"
              />
            </div>
            <div className="px-4 bg-white absolute top-[40%] left-0 right-10">
              <h3 className="text-2xl font-open-sans font-semibold mb-3 mt-5 text-gray-900">
                ODIO CONSEQUAT LIBERO LAOREET SIT
              </h3>
              <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-7 text-xs">TECH</Badge>
              <p className="text-base font-lato text-gray-600 mb-5 max-w-72">
                Tristique faucibus facilisis magna sit
                aliquam vestibulum. Etiam aliquam magnis
                eros. Eros euismod curabitur. At aliquam
                dignissim condimentum vestibulum ad.
                Odio consequat ...
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

          {/* Ad Banner - Tamanho: 300x600px */}
          <AdBanner
            imageUrl="https://images.pexels.com/photos/34551186/pexels-photo-34551186.jpeg"
            title="Anúncio"
            backgroundColor="bg-transparent"
            className="h-[600px]"
            variant="vertical"
          />
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
            {[1, 2, 3, 4].map((item) => (
              <CarouselItem key={item} className="md:basis-1/3">
                <div className="relative bg-white group pb-32">
                  <div className="relative w-full h-72">
                    <Image
                      src={placeholderImages.business}
                      alt="Health"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="px-4 py-4 bg-white absolute top-[40%] left-0 right-10 shadow-lg">
                    <h3 className="text-2xl font-open-sans font-semibold mb-2 text-gray-900">
                      ODIO CONSEQUAT LIBERO LAOREET SIT
                    </h3>
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-3 text-xs">TECH</Badge>
                    <p className="text-base font-lato text-gray-600 mb-2">
                      {"Tristique faucibus facilisis magna sit aliquam vestibulum. Etiam aliquam magnis eros. Eros euismod curabitur. At aliquam dignissim condimentum vestibulum ad. Odio consequat ...".slice(0, 100)}...
                    </p>
                    <Button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-lato text-sm uppercase rounded-sm">
                      LEIA MAIS
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 top-1/3 bg-white/80 hover:bg-white" />
          <CarouselNext className="right-2 top-1/3 bg-white/80 hover:bg-white" />
        </Carousel>
        <div className="flex justify-center mt-4 space-x-2">
          {[1, 2, 3].map((dot, idx) => (
            <div key={dot} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#6D758F]' : 'bg-gray-300'}`} />
          ))}
        </div>
      </section>

      {/* Promotional Banner - Ad */}
      <AdBanner
        imageUrl="https://images.pexels.com/photos/19311997/pexels-photo-19311997.jpeg"
        title="Anúncio"
        backgroundColor="bg-transparent"
        variant="horizontal"
      />

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
            {[1, 2, 3].map((item) => (
              <div key={item} className={`flex gap-4 group bg-white pb-4 ${item === 1 || item === 2 ? 'border-b-2' : ''}`}>
                <div className="relative w-72 h-44 flex-shrink-0">
                  <Image
                    src={placeholderImages.office}
                    alt={`Business ${item}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-open-sans font-semibold text-lg mb-2 text-gray-900 uppercase">
                    LOREM IPUSM DOLOR SIT AMET AT CONSECTETUR
                  </h4>
                  <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">EMPRESAS & NEGÓCIOS</Badge>
                  <p className="text-sm font-lato text-gray-600 line-clamp-2 mb-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit mattis sit phasellus mollis sit aliquam sit nullam.
                  </p>
                  <Button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-lato text-xs px-3 py-1 h-auto uppercase">
                    LEIA MAIS
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Ad Banner and Smaller Articles */}
          <div className="space-y-2 border border-[#B6B6B6] p-4">
            {/* Ad Banner */}
            <AdBanner
              imageUrl="/ads/business-ad.jpg"
              title="Anúncio"
              backgroundColor="bg-transparent"
              className="h-56 border-none"
              variant="vertical"
            />

            {/* Smaller Articles */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-4 group">
                <div className="relative w-40 h-28 flex-shrink-0">
                  <Image
                    src={placeholderImages.office}
                    alt={`Business Small ${item}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-open-sans font-semibold text-sm mb-1 text-gray-900 uppercase">
                    LOREM IPSUM SIT AMET CONSECT
                  </h4>
                  <p className="text-xs font-lato text-gray-600 line-clamp-2 mb-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit mattis sit phasellus mollis sit aliquam sit nullam.
                  </p>
                  <Button className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-lato text-xs px-2 py-1 h-auto uppercase">
                    LEIA MAIS
                  </Button>
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
            <h2 className="text-5xl font-volkhov text-nowrap mx-12 font-bold text-[#126861]"><span className="text-[#928575]">ESTÉTICA</span> & BELEZA</h2>
            <div className="h-3 w-full bg-gray-300"></div>
          </div>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
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
              {[1, 2, 3].map((item) => (
                <div key={item} className="grid grid-cols-2 gap-4 group">
                  <div className="flex-1 text-end">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">RINDO À TOA</Badge>
                    <h4 className="font-open-sans font-semibold text-lg mb-2 transition-colors">
                      LOREM IPUSM DOLOR YOU SIT AMET
                    </h4>
                    <p className="text-sm font-lato text-gray-600 line-clamp-2">
                      Lorem ipsum dolor sit amet consectetur mattis sit pha
                    </p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <Image
                      src={placeholderImages.cartoon}
                      alt={`Fun ${item}`}
                      fill
                      className="object-cover"
                    />
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
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="grid grid-cols-2 gap-4 group">
                  <div className="relative flex-shrink-0">
                    <Image
                      src={placeholderImages.cartoon}
                      alt={`Puzzle ${item}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="">
                    <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">QUEBRA CUCA</Badge>
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
      </section>

      {/* BUILD YOUR BUSINESS Banner - Ad */}
      <AdBanner
        imageUrl="/ads/build-business-banner.jpg"
        title="Anúncio"
        backgroundColor="bg-transparent"
        variant="horizontal"
      />

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
            {[1, 2, 3].map((item) => (
              <CarouselItem key={item} className="md:basis-1/3">
                <div className="relative h-[500px] group">
                  <Image
                    src={placeholderImages.food}
                    alt={`Food ${item}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
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
          <div className="relative w-[774.77px] group">
            <Image
              src={placeholderImages.car}
              alt="Tip"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
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
                <div className="flex-1">
                  <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white mb-2 text-xs">SPORT</Badge>
                  <h4 className="font-open-sans font-semibold text-xl mb-2 transition-colors">
                    LOREM IPSUM DOLOR SIT YOU SEE CONSETETUR
                  </h4>
                  <p className="text-sm font-lato text-gray-600 line-clamp-2">
                    Lorem ipsum dolor sit amet consectetur adipiscing mattis sit ate met you.
                  </p>
                </div>
                <div className="relative w-48 h-32 flex-shrink-0">
                  <Image
                    src={placeholderImages.couple}
                    alt={`Tip ${item}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
