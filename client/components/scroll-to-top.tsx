"use client"

import { useState, useEffect } from "react"
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
                "fixed bottom-0 right-6 z-50",
                "transition-all duration-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            )}
        >
            <button
                onClick={scrollToTop}
                className={cn(
                    "p-2 transition-all duration-200",
                    "flex items-center justify-center",
                    "w-8 h-9"
                )}
                style={{ backgroundColor: 'rgba(26, 143, 133, 0.5)' }}
                aria-label="Voltar ao topo"
            >
                <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M5 15L12 8L19 15"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    )
}
