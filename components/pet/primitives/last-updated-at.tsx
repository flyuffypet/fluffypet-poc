"use client"

export default function LastUpdatedAt({ updatedAt }: { updatedAt?: string | null }) {
  if (!updatedAt) return null
  const d = new Date(updatedAt)
  const rel = timeAgo(d)
  return <span className="text-xs text-muted-foreground">Updated {rel}</span>
}

function timeAgo(date: Date) {
  const ago = Math.floor((Date.now() - date.getTime()) / 1000)
  if (ago < 60) return "just now"
  const mins = Math.floor(ago / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}
