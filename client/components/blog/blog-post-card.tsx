import Image from "next/image"
import Link from "next/link"

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
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <Link href={`/blog/${slug}`}>
        <div className="relative h-48 w-full">
          <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span>{author}</span>
        </div>
        <Link href={`/blog/${slug}`}>
          <h3 className="font-serif text-xl font-bold text-navy-950 mb-2 hover:text-gold transition-colors">{title}</h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <div className="flex items-center justify-between">
          <Link href={`/blog/${slug}`} className="text-gold font-medium hover:underline">
            Ler mais
          </Link>
          <Link
            href={`/blog?category=${category.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-xs bg-navy-100 text-navy-800 px-2 py-1 rounded-full hover:bg-navy-200 transition-colors"
          >
            {category}
          </Link>
        </div>
      </div>
    </div>
  )
}
