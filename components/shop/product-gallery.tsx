"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: Array<{
    image_url: string
    alt_text?: string
    display_order: number
  }>
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  const sortedImages = images.sort((a, b) => a.display_order - b.display_order)

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <div className="text-4xl mb-2">📦</div>
          <div>No image available</div>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % sortedImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={sortedImages[selectedImage]?.image_url || "/placeholder.svg"}
          alt={sortedImages[selectedImage]?.alt_text || productName}
          fill
          className="object-cover"
        />

        {/* Navigation Arrows */}
        {sortedImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {sortedImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {selectedImage + 1} / {sortedImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {sortedImages.map((image, index) => (
            <button
              key={index}
              className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index ? "border-blue-500" : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image.image_url || "/placeholder.svg"}
                alt={image.alt_text || `${productName} ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
