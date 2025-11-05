import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
}

interface BlogCategoryFilterProps {
  categories: Category[]
  activeCategory?: string
}

export function BlogCategoryFilter({ categories, activeCategory }: BlogCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        href="/blog"
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          !activeCategory ? "bg-navy-950 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        Todos
      </Link>

      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/blog?category=${category.slug}`}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeCategory === category.slug ? "bg-navy-950 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}
