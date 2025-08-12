"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Download, Calendar } from "lucide-react"

export function ProviderPayouts() {
  const mockPayouts = [
    {
      id: 1,
      period: "Jan 1-7, 2024",
      amount: 485.5,
      status: "paid",
      paidDate: "2024-01-08",
      bookings: 12,
      fees: 24.28,
    },
    {
      id: 2,
      period: "Jan 8-14, 2024",
      amount: 620.75,
      status: "pending",
      paidDate: null,
      bookings: 15,
      fees: 31.04,
    },
    {
      id: 3,
      period: "Dec 25-31, 2023",
      amount: 390.25,
      status: "paid",
      paidDate: "2024-01-01",
      bookings: 9,
      fees: 19.51,
    },
  ]

  const mockInvoices = [
    {
      id: 1,
      client: "Sarah Wilson",
      service: "Dog Walking",
      amount: 125.0,
      date: "2024-01-10",
      status: "paid",
    },
    {
      id: 2,
      client: "Mike Chen",
      service: "Cat Sitting",
      amount: 180.0,
      date: "2024-01-09",
      status: "pending",
    },
    {
      id: 3,
      client: "Emma Davis",
      service: "Dog Training",
      amount: 200.0,
      date: "2024-01-08",
      status: "overdue",
    },
  ]

  const totalEarnings = mockPayouts.reduce((sum, payout) => sum + payout.amount, 0)
  const pendingAmount = mockPayouts
    .filter((p) => p.status === "pending")
    .reduce((sum, payout) => sum + payout.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payouts & Invoices
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">Create Invoice</Button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Next payout: Jan 15</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$620.75</div>
            <p className="text-xs text-muted-foreground">+28% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Per Booking</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$41.38</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payouts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPayouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{payout.period}</p>
                    <p className="text-sm text-muted-foreground">
                      {payout.bookings} bookings • ${payout.fees.toFixed(2)} fees
                    </p>
                    {payout.paidDate && (
                      <p className="text-xs text-muted-foreground">
                        Paid: {new Date(payout.paidDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${payout.amount.toFixed(2)}</p>
                    <Badge variant={payout.status === "paid" ? "default" : "secondary"}>{payout.status}</Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Payouts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{invoice.client}</p>
                    <p className="text-sm text-muted-foreground">{invoice.service}</p>
                    <p className="text-xs text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${invoice.amount.toFixed(2)}</p>
                    <Badge
                      variant={
                        invoice.status === "paid"
                          ? "default"
                          : invoice.status === "overdue"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Invoices
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Payment Method</h4>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Bank Account</p>
                    <p className="text-sm text-muted-foreground">****1234</p>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Change
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Payout Schedule</h4>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly</p>
                    <p className="text-sm text-muted-foreground">Every Monday</p>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
