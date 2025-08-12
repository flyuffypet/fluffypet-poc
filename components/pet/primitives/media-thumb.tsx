"use client"

import Image from "next/image"

export default function MediaThumb({
  url,
  alt,
  width = 120,
  height = 90,
}: {
  url?: string
  alt?: string
  width?: number
  height?: number
}) {
  return (
    <div className="overflow-hidden rounded-md border bg-muted">
      <Image
        src={url || "/placeholder.svg?height=180&width=240&query=media+thumb"}
        alt={alt || "Media"}
        width={width}
        height={height}
        className="h-[90px] w-full object-cover"
      />
    </div>
  )
}
