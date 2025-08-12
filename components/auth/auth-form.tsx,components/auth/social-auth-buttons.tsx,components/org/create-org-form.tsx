"use client"

// components/auth/auth-form.tsx
import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/utils/supabaseClient"
import { track } from "@vercel/analytics"

const AuthForm = ({ mode }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const next = "/dashboard"

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      })
      if (error) throw error

      // Track successful sign-up initiation (email confirmation sent)
      track("sign_up", { method: "email_password", next })

      setMessage("Check your email for a confirmation link.")
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.replace(next)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">{mode === "signup" ? "Sign Up" : "Sign In"}</button>
      {message && <p>{message}</p>}
    </form>
  )
}

export default AuthForm

// components/auth/social-auth-buttons.tsx
import { supabase } from "@/utils/supabaseClient"
import { track } from "@vercel/analytics"

const SocialAuthButtons = ({ next }) => {
  async function signInWithGoogle() {
    track("oauth_sign_in_start", { provider: "google", next })
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { prompt: "select_account" },
      },
    })
  }

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}

export default SocialAuthButtons;
// components/org/create-org-form.tsx
;("use server")
import { supabase } from "@/utils/supabaseClient"
import { track } from "@vercel/analytics/server"

export async function createOrg(formData) {
  const name = formData.get("name")
  const region = formData.get("region")
  const orgType = formData.get("orgType")
  const user = { id: "user_id" } // Assume user is available

  // Insert org
  const { data: org, error: orgErr } = await supabase
    .from("organizations")
    .insert({ name, region, org_type: orgType, created_by: user.id, verified_status: "pending" })
    .select("id")
    .single()
  if (orgErr) throw orgErr

  // Track org creation (server-side)
  await track("org_created", {
    org_id: org.id,
    org_type: orgType,
    region,
  })

  // Add membership as admin
  await supabase
    .from("organization_users")
    .insert({ org_id: org.id, user_id: user.id, role: "admin", status: "active" })

  // Set default org on profile
  await supabase.from("profiles").update({ default_org_id: org.id }).eq("id", user.id)
}
