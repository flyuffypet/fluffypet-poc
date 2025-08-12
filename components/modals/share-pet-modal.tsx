"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import LinkSharePanel from "@/components/sharing/link-share-panel"
import CollaboratorTable from "@/components/sharing/collaborator-table"

export default function SharePetModal({ petId }: { petId: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          Share Access
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share pet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <LinkSharePanel petId={petId} />
          <CollaboratorTable petId={petId} />
        </div>
        <DialogFooter>
          <Button variant="outline" className="bg-transparent" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
