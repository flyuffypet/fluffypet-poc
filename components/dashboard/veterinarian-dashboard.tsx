"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "./dashboard-header"
import { VetToday } from "./vet-today"
import { VetVisitWorkspace } from "./vet-visit-workspace"
import { VetOrdersLabs } from "./vet-orders-labs"
import { VetVaccinesDue } from "./vet-vaccines-due"
import { VetPatients } from "./vet-patients"
import { VetTasks } from "./vet-tasks"
import { VetTemplates } from "./vet-templates"

interface VeterinarianDashboardProps {
  initialData: any
}

export function VeterinarianDashboard({ initialData }: VeterinarianDashboardProps) {
  const [activeTab, setActiveTab] = useState("today")

  return (
    <div className="space-y-6">
      <DashboardHeader title="Veterinarian Dashboard" subtitle="Clinical workflow management" showSearch={false} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="workspace">Visit</TabsTrigger>
          <TabsTrigger value="orders">Orders & Labs</TabsTrigger>
          <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <VetToday data={initialData} />
        </TabsContent>

        <TabsContent value="workspace" className="space-y-4">
          <VetVisitWorkspace />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <VetOrdersLabs />
        </TabsContent>

        <TabsContent value="vaccines" className="space-y-4">
          <VetVaccinesDue />
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <VetPatients />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <VetTasks />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <VetTemplates />
        </TabsContent>
      </Tabs>
    </div>
  )
}
