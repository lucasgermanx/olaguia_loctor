import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface TeamMemberCardProps {
  name: string
  oab: string
  specialty: string
  education?: string
  imageUrl: string
}

export function TeamMemberCard({ name, oab, specialty, education, imageUrl }: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border border-gray-100 group">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm font-medium mb-2">{specialty}</p>
          {education && <p className="text-sm text-gray-300">{education}</p>}
          <Link href="#" className="mt-4 inline-flex items-center text-gold hover:text-gold/80 text-sm font-medium">
            Ver perfil completo <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
      <CardContent className="p-6 text-center">
        <h3 className="font-serif text-xl font-bold text-navy-950">{name}</h3>
        <p className="mt-1 text-sm font-medium text-gold">{oab}</p>
        <div className="mt-4 mx-auto h-[2px] w-12 bg-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </CardContent>
    </Card>
  )
}
