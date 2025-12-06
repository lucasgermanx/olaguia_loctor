"use client"

import { IoIosArrowRoundForward } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa6";
import { FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";

interface SocialShareProps {
  className?: string
  title?: string
  url?: string
}

export function SocialShare({ className = "", title = "", url = "" }: SocialShareProps) {
  // Usar URL atual se não for fornecida
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || "Confira este conteúdo"

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(shareTitle)

    let shareLink = ""

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
        break
      case "email":
        shareLink = `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`
        window.location.href = shareLink
        return
      case "instagram":
        // Instagram não tem API de compartilhamento direto
        // Copiar link para clipboard
        if (typeof window !== 'undefined') {
          navigator.clipboard.writeText(shareUrl)
          alert("Link copiado! Cole no Instagram.")
        }
        return
      default:
        return
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400,noopener,noreferrer')
    }
  }

  const socialLinks = [
    { icon: FaFacebookF, platform: "facebook", label: "Facebook" },
    { icon: AiFillInstagram, platform: "instagram", label: "Instagram" },
    { icon: IoLogoWhatsapp, platform: "whatsapp", label: "WhatsApp" },
    { icon: MdEmail, platform: "email", label: "E-mail" },
  ]

  return (
    <div className={`mt-8 pt-8 border-t border-gray-200 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button className="text-base text-[#928575] px-4 py-2 rounded-3xl font-semibold flex items-center gap-1 transition-colors">
          COMPARTILHE
          <IoIosArrowRoundForward className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {socialLinks.map((social, index) => {
            const Icon = social.icon
            return (
              <button
                key={index}
                onClick={() => handleShare(social.platform)}
                aria-label={`Compartilhar no ${social.label}`}
                className="w-10 h-10 bg-[#928575]/90 text-white rounded-lg flex items-center justify-center hover:bg-[#7a6b5a] transition-colors"
              >
                <Icon className="h-5 w-5" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

