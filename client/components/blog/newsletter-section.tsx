import { Button } from "@/components/ui/button"
import { FaInstagram } from "react-icons/fa"

export function NewsletterSection() {
  return (
    <section className="bg-[#F6F4ED] border-t border-gray-200 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Gostaria de receber as novidades e notícias sobre o OLÁ GUIA?<br />
              Inscreva-se nos canais de Instagram para estar informado
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 shadow-md transition-all">
              <FaInstagram className="w-5 h-5" />
              Canal - Leitor
            </Button>
            <Button className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 shadow-md transition-all">
              <FaInstagram className="w-5 h-5" />
              Canal - Potencial Anunciante
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

