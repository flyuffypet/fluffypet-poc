"use client"

import Image from "next/image"
import { PawPrint } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PetAvatar({
  src,
  alt,
  species,
  size = 56,
  className,
}: {
  src?: string | null
  alt?: string
  species?: string | null
  size?: number
  className?: string
}) {
  if (src) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-full ring-2 ring-ring/40", className)}
        style={{ width: size, height: size }}
      >
        <Image
          src={src || "/placeholder.svg?height=128&width=128&query=pet+avatar"}
          alt={alt || "Pet avatar"}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      </div>
    )
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-muted text-muted-foreground ring-2 ring-ring/40",
        className,
      )}
      style={{ width: size, height: size }}
      aria-label={(species || "Pet") + " avatar"}
    >
      <PawPrint className="h-1/2 w-1/2" />
    </div>
  )
}
