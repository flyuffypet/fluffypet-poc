"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface CategoryGridProps {
  categories: Array<{
    id: string
    name: string
    description?: string
  }>
}

const categoryIcons: Record<string, string> = {
  "Food & Treats": "🍖",
  "Toys & Entertainment": "🎾",
  "Health & Wellness": "💊",
  "Grooming & Care": "🧴",
  "Beds & Furniture": "🛏️",
  "Collars & Leashes": "🦮",
  "Travel & Carriers": "🎒",
  "Training & Behavior": "🎯",
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/shop/categories/${category.id}`}>
          <Card className="group hover:shadow-md transition-shadow duration-200 h-full">
            <CardContent className="p-4 text-center space-y-3">
              {/* Category Icon */}
              <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                {categoryIcons[category.name] || "🐾"}
              </div>

              {/* Category Name */}
              <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors">{category.name}</h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
