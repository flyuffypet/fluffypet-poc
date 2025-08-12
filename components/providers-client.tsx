"use client"

import type React from "react"
import { APIProvider } from "@vis.gl/react-google-maps"

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export default function ProvidersClient({ children }: { children: React.ReactNode }) {
  if (!apiKey) return <>{children}</>
  return (
    <APIProvider apiKey={apiKey} libraries={["marker"]} version="weekly">
      {children}
    </APIProvider>
  )
}
