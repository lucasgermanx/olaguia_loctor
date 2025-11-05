import { BarChart, Briefcase, Heart, Home, Scale, Users, Shield, FileText, type LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface PracticeAreaCardProps {
  title: string
  description: string
  icon: "Scale" | "Briefcase" | "Users" | "BarChart" | "Heart" | "Home" | "Shield" | "FileText"
}

export function PracticeAreaCard({ title, description, icon }: PracticeAreaCardProps) {
  const IconMap: Record<string, LucideIcon> = {
    Scale,
    Briefcase,
    Users,
    BarChart,
    Heart,
    Home,
    Shield,
    FileText,
  }

  const Icon = IconMap[icon]

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border border-gray-100 group h-full cursor-pointer">
      <CardContent className="p-8">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-navy-100 group-hover:bg-gold/20 transition-colors">
          <Icon className="h-8 w-8 text-navy-950" />
        </div>
        <h3 className="font-serif text-xl font-bold text-navy-950">{title}</h3>
        <div className="mt-2 h-[2px] w-12 bg-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <p className="mt-4 text-gray-700 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
