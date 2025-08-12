"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarPlus, FilePlus2, UploadCloud, Share2 } from "lucide-react"

export default function ActionBar({ petId }: { petId: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" className="bg-transparent" asChild>
        <Link href={`/book?pet_id=${petId}`} className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          Book
        </Link>
      </Button>
      <Button variant="outline" className="bg-transparent" asChild>
        <Link href={`/pets/${petId}/health?new=record`} className="gap-2">
          <FilePlus2 className="h-4 w-4" />
          Add Record
        </Link>
      </Button>
      <Button variant="outline" className="bg-transparent" asChild>
        <Link href={`/pets/${petId}/media`} className="gap-2">
          <UploadCloud className="h-4 w-4" />
          Upload Media
        </Link>
      </Button>
      <Button variant="outline" className="bg-transparent" asChild>
        <Link href={`/pets/${petId}/sharing`} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Link>
      </Button>
    </div>
  )
}
