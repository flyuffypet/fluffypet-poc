"use client"

import { useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

export function useRealtimePet(petId: string, onChange: () => void) {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    const channel = supabase
      .channel(`pet-${petId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "medical_records", filter: `pet_id=eq.${petId}` },
        () => onChange(),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "pet_media", filter: `pet_id=eq.${petId}` }, () =>
        onChange(),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [petId, onChange])
}
