import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface BonsaiSpecimen {
  id: string
  name: string
  species: string
  age: number
  health: "excellent" | "good" | "fair" | "needs-attention"
  imageUrl: string
  owner: string
  ownerId: string
}

interface BonsaiSpecimenCardProps {
  specimen: BonsaiSpecimen
  className?: string
}

const healthConfig = {
  excellent: { label: "Excellent", className: "bg-primary/20 text-primary border-primary/30" },
  good: { label: "Good", className: "bg-accent/20 text-accent border-accent/30" },
  fair: { label: "Fair", className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  "needs-attention": { label: "Needs Care", className: "bg-destructive/20 text-destructive border-destructive/30" },
}

export function BonsaiSpecimenCard({ specimen, className }: BonsaiSpecimenCardProps) {
  const healthInfo = healthConfig[specimen.health]

  return (
    <Link href={`/specimen/${specimen.id}`}>
      <Card
        className={cn(
          "group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
          className,
        )}
      >
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={specimen.imageUrl || "/placeholder.svg"}
              alt={specimen.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold leading-tight text-balance truncate">{specimen.name}</h3>
                <p className="text-sm text-muted-foreground">{specimen.species}</p>
              </div>
              <Badge variant="outline" className={cn("shrink-0", healthInfo.className)}>
                {healthInfo.label}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{specimen.age} years old</span>
              <span>by {specimen.owner}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
