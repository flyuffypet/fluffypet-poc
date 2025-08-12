import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json()
    const resend = new Resend(process.env.RESEND_API_KEY!)
    const { data, error } = await resend.emails.send({
      from: "FluffyPet <noreply@fluffypet.example>",
      to,
      subject,
      html: html || "<p>Hello from FluffyPet!</p>",
    })
    if (error) throw error
    return NextResponse.json({ id: data?.id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
