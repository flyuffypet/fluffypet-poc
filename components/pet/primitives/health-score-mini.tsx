"use client"

export default function HealthScoreMini({ score }: { score?: number | null }) {
  if (score === undefined || score === null) return null
  const s = Math.max(0, Math.min(100, Math.round(score)))
  const color = s >= 80 ? "text-green-600" : s >= 50 ? "text-yellow-600" : "text-red-600"
  return (
    <div className="text-xs">
      <span className="text-muted-foreground">Health Score:</span> <span className={`font-semibold ${color}`}>{s}</span>
    </div>
  )
}
