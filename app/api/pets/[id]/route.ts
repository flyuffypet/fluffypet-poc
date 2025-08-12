import { NextResponse } from "next/server"
import { fetchPetByIdFromSupabase } from "@/lib/pets"

// GET /api/pets/:id -> returns Pet JSON (RLS enforced by Supabase)
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const pet = await fetchPetByIdFromSupabase(params.id)
    if (!pet) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(pet)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
