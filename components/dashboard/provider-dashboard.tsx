"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "./dashboard-header"
import { ProviderOverview } from "./provider-overview"
import { ProviderCalendar } from "./provider-calendar"
import { ProviderRequests } from "./provider-requests"
import { ProviderClients } from "./provider-clients"
import { ProviderTasks } from "./provider-tasks"
import { ProviderReviews } from "./provider-reviews"
import { ProviderPayouts } from "./provider-payouts"
import { ProviderMedia } from "./provider-media"
import { ProviderSettings } from "./provider-settings"

interface ProviderDashboardProps {
  initialData: any
}

export function ProviderDashboard({ initialData }: ProviderDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <DashboardHeader title="Provider Dashboard" subtitle="Manage your services and bookings" showSearch={false} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
          <TabsTrigger value="overview">Today</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="media">Portfolio</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <ProviderOverview data={initialData} />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <ProviderCalendar />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <ProviderRequests />
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <ProviderClients />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <ProviderTasks />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <ProviderReviews />
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <ProviderPayouts />
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <ProviderMedia />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <ProviderSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
