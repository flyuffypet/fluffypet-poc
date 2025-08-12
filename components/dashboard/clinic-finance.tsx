"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, FileText, Download } from "lucide-react"

export function ClinicFinance() {
  const [activeTab, setActiveTab] = useState("payouts")

  const mockPayouts = [
    {
      id: 1,
      date: "2024-01-15",
      amount: 2450.0,
      status: "completed",
      method: "bank_transfer",
      reference: "PAY-001",
    },
    {
      id: 2,
      date: "2024-01-08",
      amount: 1875.5,
      status: "pending",
      method: "bank_transfer",
      reference: "PAY-002",
    },
    {
      id: 3,
      date: "2024-01-01",
      amount: 3200.75,
      status: "completed",
      method: "bank_transfer",
      reference: "PAY-003",
    },
  ]

  const mockInvoices = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      customerName: "Sarah Wilson",
      petName: "Buddy",
      amount: 85.0,
      status: "paid",
      dueDate: "2024-01-15",
      services: ["Routine Checkup"],
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      customerName: "Mike Chen",
      petName: "Luna",
      amount: 350.0,
      status: "overdue",
      dueDate: "2024-01-10",
      services: ["Dental Cleaning"],
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      customerName: "Emma Davis",
      petName: "Max",
      amount: 45.0,
      status: "pending",
      dueDate: "2024-01-20",
      services: ["Vaccination"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "overdue":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Finance & Billing
        </h2>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-green-600">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {mockPayouts
                .filter((p) => p.status === "pending")
                .reduce((sum, p) => sum + p.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting transfer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockInvoices.filter((i) => i.status !== "paid").length}</div>
            <p className="text-xs text-muted-foreground">Need collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
            <FileText className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              $
              {mockInvoices
                .filter((i) => i.status === "overdue")
                .reduce((sum, i) => sum + i.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Past due</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="tax">Tax Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPayouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{payout.reference}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payout.date).toLocaleDateString()} • {payout.method.replace("_", " ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold">${payout.amount.toFixed(2)}</p>
                        <Badge variant={getStatusColor(payout.status)}>{payout.status}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {payout.status === "completed" && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                      <p className="text-sm text-muted-foreground">
                        {invoice.customerName} - {invoice.petName}
                      </p>
                      <p className="text-xs text-muted-foreground">Services: {invoice.services.join(", ")}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold">${invoice.amount.toFixed(2)}</p>
                        <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        {invoice.status === "overdue" && (
                          <Button size="sm" variant="destructive">
                            Send Reminder
                          </Button>
                        )}
                        {invoice.status === "pending" && <Button size="sm">Mark Paid</Button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quarterly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$37,350</div>
                    <p className="text-xs text-muted-foreground">Q1 2024</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tax Collected</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2,990</div>
                    <p className="text-xs text-muted-foreground">8% sales tax</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Net Income</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$34,360</div>
                    <p className="text-xs text-muted-foreground">After taxes</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download Tax Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
