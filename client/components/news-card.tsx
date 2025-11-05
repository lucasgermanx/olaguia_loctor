import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface NewsCardProps {
  title: string
  date: string
  author: string
  category: string
  excerpt: string
  imageUrl: string
}

export function NewsCard({ title, date, author, category, excerpt, imageUrl }: NewsCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border border-gray-100 group h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500">{date}</span>
          <span className="inline-block rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-medium text-navy-950">
            {category}
          </span>
        </div>
        <h3 className="font-serif text-xl font-bold text-navy-950 group-hover:text-navy-800 transition-colors">
          {title}
        </h3>
        <p className="mt-3 text-gray-700 flex-grow">{excerpt}</p>
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600">{author}</span>
          <Link
            href="#"
            className="inline-flex items-center text-navy-950 hover:text-gold text-sm font-medium group/link"
          >
            Ler artigo <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
