"use client"

import { Button } from "@/components/ui/button"

export default function SaveBar({
  onSave,
  onCancel,
  saving,
  canSave,
}: {
  onSave: () => void
  onCancel?: () => void
  saving?: boolean
  canSave?: boolean
}) {
  return (
    <div className="fixed inset-x-0 bottom-20 z-40 md:bottom-4">
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="flex items-center gap-2 rounded-lg border bg-background p-2 shadow-sm">
          <Button variant="outline" onClick={onCancel} className="bg-transparent">
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving || !canSave}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}
