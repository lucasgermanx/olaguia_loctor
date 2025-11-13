"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface AdBannerProps {
  imageUrl?: string
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  backgroundColor?: string
  className?: string
  variant?: "horizontal" | "vertical"
}

export function AdBanner({
  imageUrl,
  title,
  description,
  buttonText,
  buttonLink = "#",
  backgroundColor = "bg-gray-100",
  className = "",
  variant = "horizontal",
}: AdBannerProps) {
  const [imageError, setImageError] = useState(false)
  const isVertical = variant === "vertical" || className.includes("h-full")

  return (
    <div className={`${backgroundColor} ${className} ${isVertical ? "flex items-center justify-center" : "py-6"}`}>
      <Link href={buttonLink} className="block group w-full h-full">
        <div className={`relative ${isVertical ? "h-full w-full" : "h-48 md:h-64"} rounded-lg overflow-hidden border-2 border-gray-200`}>
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={title || "Banner de anúncio"}
              fill
              className="object-cover transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
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

