import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TestimonialCardProps {
  quote: string
  author: string
  company: string
  rating?: number
  dark?: boolean
}

export function TestimonialCard({ quote, author, company, rating = 0, dark = false }: TestimonialCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-lg group h-full",
        dark ? "bg-navy-900/50 border-navy-800 hover:bg-navy-900" : "bg-white border-gray-100 hover:border-gold/30",
      )}
    >
      <CardContent className="p-8">
        <div className={cn("mb-6 text-5xl", dark ? "text-gold" : "text-gold")}>"</div>
        <p className={cn("leading-relaxed", dark ? "text-gray-300" : "text-gray-700")}>{quote}</p>

        {rating > 0 && (
          <div className="flex mt-4 space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={cn("h-5 w-5", i < rating ? "text-gold" : "text-gray-300")}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}

        <div className="mt-8">
          <div className="h-[1px] w-12 bg-gold mb-6"></div>
          <p className={cn("font-medium", dark ? "text-white" : "text-navy-950")}>{author}</p>
          <p className={cn("text-sm", dark ? "text-gray-400" : "text-gray-600")}>{company}</p>
        </div>
      </CardContent>
    </Card>
  )
}
