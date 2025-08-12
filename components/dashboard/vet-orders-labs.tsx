"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlaskConical, FileText, Search, Plus } from "lucide-react"

export function VetOrdersLabs() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const mockLabOrders = [
    {
      id: 1,
      patient: "Buddy",
      owner: "Sarah Wilson",
      orderDate: "2024-01-10",
      tests: ["Complete Blood Count", "Chemistry Panel"],
      status: "pending",
      priority: "routine",
      expectedResults: "2024-01-12",
    },
    {
      id: 2,
      patient: "Luna",
      owner: "Mike Chen",
      orderDate: "2024-01-09",
      tests: ["Urinalysis", "Thyroid Panel"],
      status: "in_progress",
      priority: "urgent",
      expectedResults: "2024-01-11",
    },
    {
      id: 3,
      patient: "Max",
      owner: "Emma Davis",
      orderDate: "2024-01-08",
      tests: ["Heartworm Test", "Fecal Exam"],
      status: "completed",
      priority: "routine",
      expectedResults: "2024-01-10",
      results: {
        heartworm: "Negative",
        fecal: "No parasites detected",
      },
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in_progress":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "stat":
        return "destructive"
      case "routine":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          Orders & Lab Results
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="w-[200px] pl-8" />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Lab Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lab Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Lab Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLabOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOrder?.id === order.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">
                        {order.patient} - {order.owner}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Ordered: {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(order.priority)}>{order.priority}</Badge>
                      <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Tests:</p>
                      <div className="flex flex-wrap gap-1">
                        {order.tests.map((test, index) => (
                          <Badge key={index} variant="outline">
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Expected: {new Date(order.expectedResults).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Details / New Order */}
        <div className="space-y-6">
          {selectedOrder ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Patient:</span>
                        <p className="font-medium">{selectedOrder.patient}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Owner:</span>
                        <p className="font-medium">{selectedOrder.owner}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Order Date:</span>
                        <p className="font-medium">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Priority:</span>
                        <Badge variant={getPriorityColor(selectedOrder.priority)}>{selectedOrder.priority}</Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Tests Ordered:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedOrder.tests.map((test: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="bg-transparent">
                        Edit Order
                      </Button>
                      <Button variant="outline" className="bg-transparent">
                        Cancel Order
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="results" className="space-y-4">
                    {selectedOrder.status === "completed" && selectedOrder.results ? (
                      <div className="space-y-3">
                        {Object.entries(selectedOrder.results).map(([test, result]) => (
                          <div key={test} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium capitalize">{test.replace("_", " ")}:</span>
                              <span className="text-green-600 font-medium">{result as string}</span>
                            </div>
                          </div>
                        ))}
                        <Button className="w-full">Download Full Report</Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {selectedOrder.status === "pending"
                            ? "Results pending"
                            : selectedOrder.status === "in_progress"
                              ? "Tests in progress"
                              : "No results available"}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Create New Lab Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="patient-search">Patient</Label>
                    <Input id="patient-search" placeholder="Search for patient..." />
                  </div>
                  <div>
                    <Label htmlFor="tests">Tests to Order</Label>
                    <Textarea id="tests" placeholder="Select tests from catalog or enter custom tests..." rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="routine">Routine</option>
                        <option value="urgent">Urgent</option>
                        <option value="stat">STAT</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="expected-date">Expected Results</Label>
                      <Input id="expected-date" type="date" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="clinical-notes">Clinical Notes</Label>
                    <Textarea id="clinical-notes" placeholder="Additional clinical information..." rows={2} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Submit Order</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
