"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, AlertTriangle, Plus, TrendingDown } from "lucide-react"

export function ClinicInventory() {
  const [activeTab, setActiveTab] = useState("vaccines")

  const mockVaccines = [
    {
      id: 1,
      name: "DHPP Vaccine",
      manufacturer: "Zoetis",
      lotNumber: "ABC123",
      expiryDate: "2024-12-31",
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      unitCost: 12.5,
      status: "low_stock",
    },
    {
      id: 2,
      name: "Rabies Vaccine",
      manufacturer: "Merck",
      lotNumber: "XYZ789",
      expiryDate: "2024-08-15",
      currentStock: 25,
      minStock: 15,
      maxStock: 60,
      unitCost: 15.75,
      status: "in_stock",
    },
    {
      id: 3,
      name: "FVRCP Vaccine",
      manufacturer: "Boehringer",
      lotNumber: "DEF456",
      expiryDate: "2024-06-30",
      currentStock: 2,
      minStock: 8,
      maxStock: 40,
      unitCost: 11.25,
      status: "critical",
    },
  ]

  const mockConsumables = [
    {
      id: 1,
      name: "Surgical Gloves (Box)",
      category: "PPE",
      currentStock: 15,
      minStock: 20,
      unitCost: 8.5,
      status: "low_stock",
    },
    {
      id: 2,
      name: "Syringes 3ml",
      category: "Medical Supplies",
      currentStock: 200,
      minStock: 100,
      unitCost: 0.25,
      status: "in_stock",
    },
    {
      id: 3,
      name: "Bandages",
      category: "Medical Supplies",
      currentStock: 5,
      minStock: 25,
      unitCost: 3.75,
      status: "critical",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "default"
      case "low_stock":
        return "secondary"
      case "critical":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStockLevel = (current: number, min: number, max?: number) => {
    if (current <= min * 0.5) return "critical"
    if (current <= min) return "low_stock"
    return "in_stock"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventory Management
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockVaccines.length + mockConsumables.length}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {[...mockVaccines, ...mockConsumables].filter((item) => item.status === "low_stock").length}
            </div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {[...mockVaccines, ...mockConsumables].filter((item) => item.status === "critical").length}
            </div>
            <p className="text-xs text-muted-foreground">Urgent attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {Math.round(
                [...mockVaccines, ...mockConsumables].reduce((sum, item) => sum + item.currentStock * item.unitCost, 0),
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total value</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="vaccines">Vaccine Stock</TabsTrigger>
          <TabsTrigger value="consumables">Consumables</TabsTrigger>
          <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="vaccines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vaccine Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVaccines.map((vaccine) => (
                  <div key={vaccine.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{vaccine.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {vaccine.manufacturer} • Lot: {vaccine.lotNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expires: {new Date(vaccine.expiryDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getStatusColor(vaccine.status)}>{vaccine.status.replace("_", " ")}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Min: {vaccine.minStock} | Max: {vaccine.maxStock}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold">{vaccine.currentStock}</p>
                        <p className="text-sm text-muted-foreground">${vaccine.unitCost} each</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Adjust
                        </Button>
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumable Supplies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockConsumables.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getStatusColor(item.status)}>{item.status.replace("_", " ")}</Badge>
                        <span className="text-xs text-muted-foreground">Min: {item.minStock}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold">{item.currentStock}</p>
                        <p className="text-sm text-muted-foreground">${item.unitCost} each</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Adjust
                        </Button>
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...mockVaccines, ...mockConsumables]
                  .filter((item) => item.status !== "in_stock")
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current: {item.currentStock} | Minimum: {item.minStock}
                        </p>
                        <Badge variant={getStatusColor(item.status)} className="mt-2">
                          {item.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">Reorder Now</Button>
                        <Button variant="outline" size="sm">
                          Snooze Alert
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
