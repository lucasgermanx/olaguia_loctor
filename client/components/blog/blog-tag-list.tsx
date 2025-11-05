import Link from "next/link"

interface Tag {
  id: string
  name: string
  slug: string
}

interface BlogTagListProps {
  tags: Tag[]
}

export function BlogTagList({ tags }: BlogTagListProps) {
  return (
    <div>
      <h4 className="font-medium text-navy-950 mb-3">Tags:</h4>
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
  )
}
