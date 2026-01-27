import Image from "next/image"
import Link from "next/link"

interface RelatedPostCardProps {
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  slug: string
  imageUrl: string
}

export function RelatedPostCard({ title, excerpt, date, author, category, slug, imageUrl }: RelatedPostCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
      <Link href={`/blog/${slug}`} className="block relative w-full h-48">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105 duration-300"
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/blog/${slug}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#126861] transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
          {excerpt}
        </p>
        <Link
          href={`/blog/${slug}`}
          className="w-full block text-center border border-gray-300 text-gray-700 py-2 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          Ler Mais
        </Link>
      </div>
    </div>
  )
}
