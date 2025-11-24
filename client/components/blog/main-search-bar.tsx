"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

export function MainSearchBar() {
  const router = useRouter()
  const [cidade, setCidade] = useState("")
  const [profissional, setProfissional] = useState("")
  const [especialidade, setEspecialidade] = useState("")
  const [tema, setTema] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de busca
    router.push("/blog")
  }

  return (
    <section className="bg-[#f5f5f0] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex my-auto gap-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#353E5C] mb-2">Pesquisar</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 uppercase">
            <div className="flex-1 relative">
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg uppercase appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#126861] focus:border-transparent text-sm"
              >
                <option value="" className="uppercase">Cidade</option>
                <option value="rio" className="uppercase" >Rio de Janeiro</option>
                <option value="sp" className="uppercase">São Paulo</option>
                <option value="bh" className="uppercase">Belo Horizonte</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            <div className="flex-1 relative">
              <select
                value={profissional}
                onChange={(e) => setProfissional(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg uppercase appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#126861] focus:border-transparent text-sm"
              >
                <option value="">Profissional / Empresa</option>
                <option value="advogado">Advogado</option>
                <option value="medico">Médico</option>
                <option value="empresa">Empresa</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            <div className="flex-1 relative">
              <select
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg uppercase appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#126861] focus:border-transparent text-sm"
              >
                <option value="">Especialidade</option>
                <option value="direito">Direito</option>
                <option value="medicina">Medicina</option>
                <option value="tecnologia">Tecnologia</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            <div className="flex-1 relative">
              <select
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg uppercase appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#126861] focus:border-transparent text-sm"
              >
                <option value="">Tema</option>
                <option value="saude">Saúde</option>
                <option value="negocios">Negócios</option>
                <option value="gastronomia">Gastronomia</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            <button
              type="submit"
              className="bg-[#126861] hover:bg-[#0f5650] text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

