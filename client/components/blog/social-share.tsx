import { IoIosArrowRoundForward } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa6";
import { FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";

export function SocialShare({ className = "" }: { className?: string }) {
  const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: AiFillInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
    { icon: IoLogoWhatsapp, href: "#", label: "WhatsApp" },
  ]

  return (
    <div className={`mt-8 pt-8 border-t border-gray-200 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button className="bg-[#126861] hover:bg-[#0f5650] text-base text-white px-4 py-2 rounded-3xl font-semibold flex items-center gap-1 transition-colors">
          COMPARTILHE
          <IoIosArrowRoundForward className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {socialLinks.map((social, index) => {
            const Icon = social.icon
            return (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 bg-[#126861] text-white rounded-lg flex items-center justify-center hover:bg-[#0f5650] transition-colors"
              >
                <Icon className="h-5 w-5" />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

