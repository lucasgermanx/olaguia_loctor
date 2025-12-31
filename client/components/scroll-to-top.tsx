"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            // Mostra o botão quando o usuário rola mais de 300px
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener("scroll", toggleVisibility)

        return () => {
            window.removeEventListener("scroll", toggleVisibility)
        }
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <div
            className={cn(
                "fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50",
                "flex flex-col items-center gap-2 group",
                "transition-all duration-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            )}
        >
            <span
                className={cn(
                    "text-sm font-medium text-neutral-600 whitespace-nowrap",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    "mb-1"
                )}
                style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed'
                }}
            >
                Voltar ao topo
            </span>
            <button
                onClick={scrollToTop}
                className={cn(
                    "bg-[#928575] hover:bg-[#928575]/80 text-white",
                    "rounded-full p-3 shadow-lg transition-all duration-200",
                    "flex items-center justify-center",
                    "flex-shrink-0"
                )}
                aria-label="Voltar ao topo"
            >
                <ChevronUp className="w-5 h-5" />
            </button>
        </div>
    )
}

