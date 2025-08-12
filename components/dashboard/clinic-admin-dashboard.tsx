"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClinicOverview } from "./clinic-overview"
import { ClinicMasterCalendar } from "./clinic-master-calendar"
import { ClinicBookings } from "./clinic-bookings"
import { ClinicStaffRoles } from "./clinic-staff-roles"
import { ClinicServicesPricing } from "./clinic-services-pricing"
import { ClinicInventory } from "./clinic-inventory"
import { ClinicReviewsNPS } from "./clinic-reviews-nps"
import { ClinicFinance } from "./clinic-finance"
import { ClinicCompliance } from "./clinic-compliance"
import { ClinicMediaBranding } from "./clinic-media-branding"
import { ClinicAuditLogs } from "./clinic-audit-logs"
import { ClinicSettings } from "./clinic-settings"

export function ClinicAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clinic Administration</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ClinicOverview />
        </TabsContent>

        <TabsContent value="calendar">
          <ClinicMasterCalendar />
        </TabsContent>

        <TabsContent value="bookings">
          <ClinicBookings />
        </TabsContent>

        <TabsContent value="staff">
          <ClinicStaffRoles />
        </TabsContent>

        <TabsContent value="services">
          <ClinicServicesPricing />
        </TabsContent>

        <TabsContent value="inventory">
          <ClinicInventory />
        </TabsContent>

        <TabsContent value="reviews">
          <ClinicReviewsNPS />
        </TabsContent>

        <TabsContent value="finance">
          <ClinicFinance />
        </TabsContent>

        <TabsContent value="compliance">
          <ClinicCompliance />
        </TabsContent>

        <TabsContent value="media">
          <ClinicMediaBranding />
        </TabsContent>

        <TabsContent value="audit">
          <ClinicAuditLogs />
        </TabsContent>

        <TabsContent value="settings">
          <ClinicSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
