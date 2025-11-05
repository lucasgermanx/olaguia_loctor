import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface BlogSidebarProps {
  categories: Category[]
  tags: Tag[]
}

export function BlogSidebar({ categories, tags }: BlogSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Categories Section */}
      <div>
        <h3 className="font-serif text-xl font-bold text-navy-950 mb-4">Categorias</h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/blog?category=${category.slug}`}
                  className="text-gray-700 hover:text-gold transition-colors flex items-center"
                >
                  <span className="w-1 h-1 bg-gold rounded-full mr-2"></span>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <h3 className="font-serif text-xl font-bold text-navy-950 mb-4">Tags</h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                className="inline-block bg-navy-50 text-navy-800 px-3 py-1 rounded-full text-sm hover:bg-navy-100 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
