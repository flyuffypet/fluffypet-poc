"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"

export function useDashboardData() {
  const [user, setUser] = useState<any>(null)
  const [pets, setPets] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [reminders, setReminders] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notificationCount, setNotificationCount] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          setLoading(false)
          return
        }

        // Fetch user profile
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

        setUser(profile)

        // Fetch pets
        const { data: petsData } = await supabase
          .from("pets")
          .select("*")
          .eq("owner_id", authUser.id)
          .eq("status", "active")

        setPets(petsData || [])

        // Fetch insights
        const { data: insightsData } = await supabase
          .from("ai_insights")
          .select("*")
          .eq("user_id", authUser.id)
          .eq("is_acknowledged", false)
          .limit(5)

        setInsights(insightsData || [])

        // Fetch reminders
        const { data: remindersData } = await supabase
          .from("reminders")
          .select("*")
          .eq("user_id", authUser.id)
          .eq("status", "pending")
          .limit(5)

        setReminders(remindersData || [])

        // Fetch appointments
        const { data: appointmentsData } = await supabase
          .from("bookings")
          .select("*")
          .eq("client_id", authUser.id)
          .gte("scheduled_at", new Date().toISOString())
          .limit(5)

        setAppointments(appointmentsData || [])

        // Calculate notification count
        const totalNotifications = (insightsData?.length || 0) + (remindersData?.length || 0)
        setNotificationCount(totalNotifications)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Set up real-time subscriptions
    const subscription = supabase
      .channel("dashboard-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "ai_insights" }, () => {
        fetchDashboardData()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "reminders" }, () => {
        fetchDashboardData()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        fetchDashboardData()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return {
    user,
    pets,
    insights,
    reminders,
    appointments,
    loading,
    notificationCount,
  }
}

export function useDashboardUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchUser() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        if (!authUser) {
          setUser(null)
          return
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select(`
            *,
            organization_users!inner(
              organization_id,
              role,
              organizations(*)
            )
          `)
          .eq("id", authUser.id)
          .single()

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            first_name: profile.first_name,
            last_name: profile.last_name,
            role: profile.role,
            platform_role: profile.platform_role,
            avatar_url: profile.avatar_url,
            organizations: profile.organization_users?.map((ou: any) => ou.organizations) || [],
            active_org_id: profile.organization_users?.[0]?.organization_id,
          })
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [supabase])

  return { user, loading }
}
