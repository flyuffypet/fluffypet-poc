"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CreatePetButton() {
  return (
    <Button asChild>
      <Link href="/pets/new" className="gap-2">
        <Plus className="h-4 w-4" />
        Add Pet
      </Link>
    </Button>
  )
}
