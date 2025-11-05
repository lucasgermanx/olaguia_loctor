import { Award, Scale, Shield, Users, type LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface ValueCardProps {
  title: string
  description: string
  icon: "Scale" | "Award" | "Shield" | "Users"
}

export function ValueCard({ title, description, icon }: ValueCardProps) {
  const IconMap: Record<string, LucideIcon> = {
    Scale,
    Award,
    Shield,
    Users,
  }

  const Icon = IconMap[icon]

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border border-gray-100 group h-full">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy-100 group-hover:bg-gold/20 transition-colors">
          <Icon className="h-7 w-7 text-navy-950" />
        </div>
        <h3 className="font-serif text-xl font-bold text-navy-950">{title}</h3>
        <div className="mt-2 h-[2px] w-10 bg-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <p className="mt-4 text-gray-700">{description}</p>
      </CardContent>
    </Card>
  )
}
