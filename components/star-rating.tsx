"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type StarRatingProps = {
  value: number
  onChange?: (value: number) => void
  size?: number
  readOnly?: boolean
  className?: string
}

export function StarRating({
  value,
  onChange,
  size = 20,
  readOnly = false,
  className,
}: StarRatingProps) {
  const [hover, setHover] = React.useState<number | null>(null)
  const active = hover ?? value

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={readOnly ? `Calificación: ${value} de 5` : "Selecciona una calificación"}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= active
        const Icon = (
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors",
              filled ? "fill-primary text-primary" : "fill-transparent text-muted-foreground/40",
            )}
          />
        )
        if (readOnly) {
          return <span key={star}>{Icon}</span>
        }
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
            aria-pressed={star <= value}
            className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(star)}
            onBlur={() => setHover(null)}
            onClick={() => onChange?.(star)}
          >
            {Icon}
          </button>
        )
      })}
    </div>
  )
}
