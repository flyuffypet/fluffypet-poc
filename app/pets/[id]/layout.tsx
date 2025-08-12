import type React from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PetLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const base = `/pets/${params.id}`
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-2">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" asChild>
              <Link href={base}>Overview</Link>
            </TabsTrigger>
            <TabsTrigger value="health" asChild>
              <Link href={`${base}/health`}>Health</Link>
            </TabsTrigger>
            <TabsTrigger value="media" asChild>
              <Link href={`${base}/media`}>Media</Link>
            </TabsTrigger>
            <TabsTrigger value="sharing" asChild>
              <Link href={`${base}/sharing`}>Sharing</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {children}
    </div>
  )
}
