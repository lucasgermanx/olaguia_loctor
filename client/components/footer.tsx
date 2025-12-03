import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BsFillMegaphoneFill } from "react-icons/bs";
import { placeholderImages } from "@/lib/placeholder-images";

export function Footer() {
  return (
    <footer className="bg-[#126861] text-white pt-10">
      {/* Top Band */}
      <div className="max-w-7xl mx-auto px-4 pb-14">
        {/* TOP Side - Logo and Privacy */}
        <div className="flex flex-col lg:flex-row gap-x-40 pb-14">
          <div className="flex items-center space-x-3 mb-4">
            <Image src="/logo.png" alt="Logo" width={256} height={100} />
          </div>
          <p className="text-lg text-gray-200">
            Concordo em receber novas notícias através do nosso grupo. <br /> Para mais informações consulte nossa:{" "}
            <Link href="/privacidade" className="text-xl underline hover:text-white font-semibold">
              Política de Privacidade
            </Link>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-r border-white/20">
            {/* Links Column */}
            <div>
              <h3 className="font-open-sans font-semibold mb-4 text-sm">Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacidade" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/termos" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Termos e Condições
                  </Link>
                </li>
                <li>
                  <Link href="/trabalhe-conosco" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Trabalhe com a gente
                  </Link>
                </li>
                <li>
                  <Link href="/franquia" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Franquia
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Navegação Column */}
            <div>
              <h3 className="font-open-sans font-semibold mb-4 text-sm">Navegação</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/sobre" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link href="/biblioteca" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Biblioteca
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="text-gray-200 hover:text-white transition-colors text-sm">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Middle Section - Article Cards */}
          <div className="space-y-4 border-r border-white/20 pr-10">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={placeholderImages.office}
                    alt={`Post ${item}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-open-sans font-semibold text-sm mb-1 uppercase">
                    LOREM IPSUM SIT AMET CONSECT
                  </h4>
                  <p className="text-xs text-gray-200 mb-2 line-clamp-2">
                    Lorem ipsum dolor sit amet consectetur adipiscing amet se you.
                  </p>
                  <Button className="bg-transparent hover:bg-transparent border border-white text-white text-xs px-3 font-normal py-1 h-auto uppercase">
                    LEIA MAIS
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - COMO ANUNCIAR and Social */}
          <div className="space-y-6">
            {/* COMO ANUNCIAR */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-white rounded-xl p-4">
                  <BsFillMegaphoneFill className="h-8 w-8 text-[#126861]" />
                </div>
                <div>
                  <h3 className="font-open-sans font-semibold text-lg uppercase">COMO ANUNCIAR</h3>
                  <p className="text-sm text-gray-200">
                    Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy and Social */}
            <div className="space-y-3">
              <p className="text-sm text-gray-200">
                Concordo em receber novas notícias através do nosso grupo. Para mais informações consulte nossa:{" "}
                <Link href="/privacidade" className="underline hover:text-white font-semibold">
                  Política de Privacidade
                </Link>
              </p>
              <p className="text-sm text-gray-200 font-semibold">
                Entre no nosso canal do instagram
              </p>
              <Button className="bg-white hover:bg-white text-[#353E5C] px-4 py-1 uppercase rounded-full">
                ENTRAR NO GRUPO
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Band - Copyright */}
      <div className="border-t border-white/20 py-4 max-w-4xl mx-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-400 text-center">
            Copyright © 2025 OLÁ Guia | Todos os direitos reservados |{" "}
            <Link href="/termos" className="underline hover:text-gray-200">
              Termos e Condições
            </Link>{" "}
            |{" "}
            <Link href="/privacidade" className="underline hover:text-gray-200">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
