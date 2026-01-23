"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export function BlogSectionScroller() {
  const searchParams = useSearchParams()
  const section = searchParams.get("section")

  useEffect(() => {
    if (!section) return

    const elementId = `${section}-section`
    const el = document.getElementById(elementId)

    if (el) {
      // pequeno delay para garantir que o layout já foi renderizado
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 150)
    }
  }, [section])

  return null
}
