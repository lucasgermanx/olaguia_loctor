import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NewsletterSection() {
  return (
    <section className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-gray-700 text-sm md:text-base">
              Concordo em receber novas notícias através do nosso grupo. Para mais informações consulte nossa:{" "}
              <Link href="/privacidade" className="text-[#126861] underline hover:text-[#0f5650] font-semibold">
                Política de Privacidade
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold">Entre no nosso grupo</span>
            <Button className="bg-[#126861] hover:bg-[#0f5650] text-white px-6 py-2 rounded-full uppercase font-semibold">
              ENTRAR NO GRUPO
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

