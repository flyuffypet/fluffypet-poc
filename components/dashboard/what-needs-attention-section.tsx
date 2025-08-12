"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InsightAlertList } from "./insight-alert-list"
import { VaccinationDuePanel } from "./vaccination-due-panel"
import { ReminderPillList } from "./reminder-pill-list"
import { UpcomingAppointmentsList } from "./upcoming-appointments-list"

interface WhatNeedsAttentionSectionProps {
  userId?: string
}

export function WhatNeedsAttentionSection({ userId }: WhatNeedsAttentionSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">What Needs Attention</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <InsightAlertList userId={userId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vaccinations Due</CardTitle>
          </CardHeader>
          <CardContent>
            <VaccinationDuePanel userId={userId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <ReminderPillList userId={userId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingAppointmentsList userId={userId} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
