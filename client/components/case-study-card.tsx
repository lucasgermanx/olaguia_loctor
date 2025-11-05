import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface CaseStudyCardProps {
  title: string
  category: string
  description: string
  imageUrl: string
}

export function CaseStudyCard({ title, category, description, imageUrl }: CaseStudyCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border border-navy-800 group bg-navy-900/50 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-gold">
            {category}
          </span>
        </div>
      </div>
      <CardContent className="p-6 flex flex-col flex-grow">
        <h3 className="font-serif text-xl font-bold text-white group-hover:text-gold transition-colors">{title}</h3>
        <p className="mt-3 text-gray-300 flex-grow">{description}</p>
        <Link
          href="#"
          className="mt-6 inline-flex items-center text-gold hover:text-gold/80 text-sm font-medium group/link"
        >
          Saiba mais <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  )
}
