import Image from "next/image"

interface BlogAuthorCardProps {
  name: string
  role: string
  bio: string
  imageUrl?: string
}

export function BlogAuthorCard({ name, role, bio, imageUrl }: BlogAuthorCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-navy-50 rounded-lg p-6">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-navy-200 flex-shrink-0">
        {imageUrl ? (
          <Image src={imageUrl || "/placeholder.svg"} alt={name} width={80} height={80} className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-navy-200 text-navy-800 text-xl font-bold">
            {name.charAt(0)}
          </div>
        )}
      </div>

      <div className="text-center sm:text-left">
        <h4 className="font-serif text-xl font-bold text-navy-950">{name}</h4>
        <p className="text-gold font-medium mb-2">{role}</p>
        <p className="text-gray-700">{bio}</p>
      </div>
    </div>
  )
}
