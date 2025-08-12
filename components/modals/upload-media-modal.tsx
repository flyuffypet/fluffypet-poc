"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import MediaUploader from "@/components/media/media-uploader"

export default function UploadMediaModal({ petId, onUploaded }: { petId: string; onUploaded?: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          Upload Media
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload media</DialogTitle>
        </DialogHeader>
        <MediaUploader
          petId={petId}
          onUploaded={() => {
            onUploaded?.()
            setOpen(false)
          }}
        />
        <DialogFooter>
          <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
