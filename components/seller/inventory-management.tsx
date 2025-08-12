"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Package, Plus, Minus, History } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner"

interface InventoryManagementProps {
  data: {
    products: any[]
    transactions: any[]
    organizationId: string
  }
}

export function InventoryManagement({ data }: InventoryManagementProps) {
  const { products, transactions, organizationId } = data
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showAdjustment, setShowAdjustment] = useState(false)
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease">("increase")
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("")
  const [adjustmentNotes, setAdjustmentNotes] = useState("")
  const [stockFilter, setStockFilter] = useState("all")

  // Filter products based on stock levels
  const filteredProducts = products.filter((product) => {
    switch (stockFilter) {
      case "low":
        return product.inventory_count <= 10
      case "out":
        return product.inventory_count === 0
      case "in_stock":
        return product.inventory_count > 0
      default:
        return true
    }
  })

  // Calculate inventory stats
  const inventoryStats = {
    total: products.length,
    lowStock: products.filter((p) => p.inventory_count <= 10 && p.inventory_count > 0).length,
    outOfStock: products.filter((p) => p.inventory_count === 0).length,
    inStock: products.filter((p) => p.inventory_count > 0).length,
  }

  const getStockStatus = (count: number) => {
    if (count === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (count <= 10) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    return { label: "In Stock", color: "bg-green-100 text-green-800" }
  }

  const handleStockAdjustment = async () => {
    if (!selectedProduct || !adjustmentQuantity) {
      toast.error("Please fill in all required fields")
      return
    }

    const supabase = createClient()
    const quantity = Number.parseInt(adjustmentQuantity)
    const newStock =
      adjustmentType === "increase"
        ? selectedProduct.inventory_count + quantity
        : Math.max(0, selectedProduct.inventory_count - quantity)

    try {
      // Update product inventory
      const { error: productError } = await supabase
        .from("products")
        .update({ inventory_count: newStock })
        .eq("id", selectedProduct.id)

      if (productError) throw productError

      // Record inventory transaction
      const { error: transactionError } = await supabase.from("inventory_transactions").insert({
        inventory_id: selectedProduct.id,
        organization_id: organizationId,
        transaction_type: adjustmentType === "increase" ? "stock_in" : "stock_out",
        quantity: adjustmentType === "increase" ? quantity : -quantity,
        notes: adjustmentNotes || `Manual ${adjustmentType} adjustment`,
        date: new Date().toISOString().split("T")[0],
      })

      if (transactionError) throw transactionError

      toast.success("Inventory updated successfully!")
      setShowAdjustment(false)
      setSelectedProduct(null)
      setAdjustmentQuantity("")
      setAdjustmentNotes("")
      // Refresh page to show updated inventory
      window.location.reload()
    } catch (error) {
      console.error("Inventory adjustment error:", error)
      toast.error("Failed to update inventory")
    }
  }

  return (
    <div className="space-y-6">
      {/* Inventory Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md" onClick={() => setStockFilter("all")}>
          <CardContent className="p-4 text-center">
            <Package className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{inventoryStats.total}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md" onClick={() => setStockFilter("in_stock")}>
          <CardContent className="p-4 text-center">
            <div className="w-6 h-6 mx-auto mb-2 bg-green-500 rounded-full"></div>
            <div className="text-2xl font-bold">{inventoryStats.inStock}</div>
            <div className="text-sm text-gray-600">In Stock</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md" onClick={() => setStockFilter("low")}>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">{inventoryStats.lowStock}</div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md" onClick={() => setStockFilter("out")}>
          <CardContent className="p-4 text-center">
            <div className="w-6 h-6 mx-auto mb-2 bg-red-500 rounded-full"></div>
            <div className="text-2xl font-bold">{inventoryStats.outOfStock}</div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Product Inventory</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-4">
            <Label>Filter by stock:</Label>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const primaryImage =
                product.product_images?.find((img: any) => img.display_order === 0) || product.product_images?.[0]
              const stockStatus = getStockStatus(product.inventory_count)

              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.image_url || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <h3 className="font-semibold line-clamp-2">{product.name}</h3>

                      <div className="flex items-center justify-between">
                        <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
                        <span className="font-semibold">{product.inventory_count} units</span>
                      </div>

                      {product.product_categories && (
                        <Badge variant="outline" className="text-xs">
                          {product.product_categories.name}
                        </Badge>
                      )}

                      {/* Variants Stock */}
                      {product.product_variants && product.product_variants.length > 0 && (
                        <div className="space-y-1">
                          <Label className="text-xs">Variants:</Label>
                          {product.product_variants.map((variant: any) => (
                            <div key={variant.id} className="flex justify-between text-xs">
                              <span>
                                {variant.name}: {variant.value}
                              </span>
                              <span>{variant.inventory_count} units</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            setSelectedProduct(product)
                            setAdjustmentType("increase")
                            setShowAdjustment(true)
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Stock
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            setSelectedProduct(product)
                            setAdjustmentType("decrease")
                            setShowAdjustment(true)
                          }}
                          disabled={product.inventory_count === 0}
                        >
                          <Minus className="w-4 h-4 mr-1" />
                          Remove Stock
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-gray-600">
                  {stockFilter === "all" ? "No products in inventory." : `No products with ${stockFilter} status.`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Inventory Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No transactions yet</div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            transaction.transaction_type === "stock_in" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{transaction.inventory?.name || "Unknown Product"}</div>
                          <div className="text-sm text-gray-600">{transaction.notes}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-semibold ${transaction.quantity > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.quantity > 0 ? "+" : ""}
                          {transaction.quantity}
                        </div>
                        <div className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Adjustment Modal */}
      {showAdjustment && selectedProduct && (
        <Dialog open onOpenChange={() => setShowAdjustment(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {adjustmentType === "increase" ? "Add Stock" : "Remove Stock"} - {selectedProduct.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Current Stock: {selectedProduct.inventory_count} units</Label>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity to {adjustmentType}</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={adjustmentType === "decrease" ? selectedProduct.inventory_count : undefined}
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={adjustmentNotes}
                  onChange={(e) => setAdjustmentNotes(e.target.value)}
                  placeholder="Reason for adjustment..."
                  rows={3}
                />
              </div>

              {adjustmentQuantity && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    New stock level:{" "}
                    <span className="font-semibold">
                      {adjustmentType === "increase"
                        ? selectedProduct.inventory_count + Number.parseInt(adjustmentQuantity)
                        : Math.max(0, selectedProduct.inventory_count - Number.parseInt(adjustmentQuantity))}{" "}
                      units
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAdjustment(false)} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleStockAdjustment}
                  disabled={!adjustmentQuantity}
                  className="flex-1"
                  variant={adjustmentType === "decrease" ? "destructive" : "default"}
                >
                  {adjustmentType === "increase" ? "Add Stock" : "Remove Stock"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
