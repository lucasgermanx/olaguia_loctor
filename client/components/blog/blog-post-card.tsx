import Image from "next/image"
import Link from "next/link"
import { Badge } from "../ui/badge"

interface BlogPostCardProps {
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  slug: string
  imageUrl: string
}

export function BlogPostCard({ title, excerpt, date, author, category, slug, imageUrl }: BlogPostCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow-sm">
      <Link href={`/blog/${slug}`}>
        <div className="relative w-full h-36 aspect-square">
          <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
      </Link>
      <div className="px-4 pb-4 border border-t-0 pt-4 border-gray-200">
        <Badge className="bg-[#C68C0E] hover:bg-[#C68C0E] rounded-sm text-white text-[10px] border-none uppercase">
          {category || "CATEGORIA"}
        </Badge>
        <Link className="" href={`/blog/${slug}`}>
          <h3 className="text-base font-semibold font-open-sans text-gray-900 mb-2 transition-colors uppercase leading-tight pt-2 line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{excerpt}</p>
        <Link
          href={`/blog/${slug}`}
          className="inline-block text-gray-600 font-regular italic text-xs border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 transition-colors uppercase"
        >
          LEIA MAIS
        </Link>
      </div>
    </div>
  )
}
