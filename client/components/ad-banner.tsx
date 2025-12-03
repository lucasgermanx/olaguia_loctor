"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

/**
 * DIMENSÕES RECOMENDADAS PARA BANNERS:
 * 
 * HORIZONTAIS (Full Width - Sangrados):
 * - BUSINESS_BANNER_1: 1920x200px (proporção 9.6:1) ou 1920x300px (proporção 6.4:1)
 * - PROMOTIONAL_BANNER_1: 1920x200px (proporção 9.6:1) ou 1920x300px (proporção 6.4:1)
 * - BUILD_BUSINESS_BANNER: 1920x200px (proporção 9.6:1) ou 1920x300px (proporção 6.4:1)
 * 
 * VERTICAIS (Sidebar):
 * - NOSSA_SAUDE_RIGHT: 300x600px (proporção 1:2) - formato Half Page
 * - EMPRESAS_NEGOCIOS_RIGHT: 300x250px (proporção 1.2:1) - formato Medium Rectangle
 * - RINDO_A_TOA_MIDDLE: 300x400px (proporção 1:1.33) ou 300x600px
 * 
 * DICA: Use sempre PNG ou JPG otimizados. Para banners horizontais full width,
 * recomenda-se usar imagens de 1920px de largura para boa qualidade em telas grandes.
 */

interface AdBannerProps {
  imageUrl?: string
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  backgroundColor?: string
  className?: string
  imageClassName?: string
  variant?: "horizontal" | "vertical"
  fullWidth?: boolean
  /** Altura específica para banners horizontais (ex: "h-[200px]" ou "h-auto") */
  height?: string
}

export function AdBanner({
  imageUrl,
  title,
  description,
  buttonText,
  buttonLink = "#",
  backgroundColor = "bg-gray-100",
  className = "",
  imageClassName = "",
  variant = "horizontal",
  fullWidth = true,
  height,
}: AdBannerProps) {
  const [imageError, setImageError] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  const isVertical = variant === "vertical" || className.includes("h-full")

  // Determina a altura baseada no tipo
  const getHeight = () => {
    if (height) return height
    if (isVertical) return "h-full w-full"
    // Para horizontais, usa altura automática baseada na proporção da imagem
    return aspectRatio ? "" : "h-auto min-h-[100px] md:min-h-[150px]"
  }

  return (
    <div className={`${backgroundColor} ${className} ${isVertical ? "flex items-center justify-center" : "py-2"} ${fullWidth && !isVertical ? "w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" : ""}`}>
      <Link href={buttonLink} className="block group w-full h-full">
        <div
          className={`relative w-full ${getHeight()} overflow-hidden`}
          style={aspectRatio && !isVertical ? { aspectRatio: `${aspectRatio}` } : undefined}
        >
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={title || "Banner de anúncio"}
              fill={isVertical || !aspectRatio}
              width={!isVertical && aspectRatio ? 1920 : undefined}
              height={!isVertical && aspectRatio ? Math.round(1920 / aspectRatio) : undefined}
              className={`${isVertical ? 'object-contain' : 'object-contain w-full h-auto'} transition-transform duration-300 ${imageClassName}`}
              onError={() => setImageError(true)}
              onLoad={(e) => {
                const img = e.currentTarget
                if (img.naturalWidth && img.naturalHeight) {
                  setAspectRatio(img.naturalWidth / img.naturalHeight)
                }
              }}
            />
          ) : (
            <div className="w-full h-full min-h-[100px] bg-gradient-to-br from-[#126861] to-[#0f5650] flex items-center justify-center">
              <div className="text-center text-white p-4">
                <p className="text-sm font-semibold">ESPAÇO PARA ANÚNCIO</p>
                {title && <p className="text-xs mt-2 opacity-90">{title}</p>}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

