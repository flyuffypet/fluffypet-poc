"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ShoppingCart, TrendingUp, AlertTriangle, Plus, Eye, Edit } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ProductForm } from "./product-form"

interface SellerDashboardProps {
  data: {
    organization: any
    products: any[]
    recentOrders: any[]
    salesData: any[]
    lowStockProducts: any[]
  }
}

export function SellerDashboard({ data }: SellerDashboardProps) {
  const { organization, products, recentOrders, salesData, lowStockProducts } = data
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  // Calculate KPIs
  const totalRevenue = salesData.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  const totalOrders = salesData.length
  const confirmedOrders = salesData.filter((order) => order.status === "confirmed").length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      draft: "bg-yellow-100 text-yellow-800",
      out_of_stock: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-600">{organization.name}</p>
        </div>
        <Button onClick={() => setShowProductForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders (30d)</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue (30d)</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold">{lowStockProducts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex justify-between items-center">
                      <span className="text-red-700">{product.name}</span>
                      <Badge variant="destructive">{product.inventory_count} left</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const primaryImage =
                product.product_images?.find((img: any) => img.display_order === 0) || product.product_images?.[0]

              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.image_url || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                        <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>₹{product.price.toLocaleString()}</span>
                        <span>{product.inventory_count} in stock</span>
                      </div>

                      {product.product_categories && (
                        <Badge variant="outline" className="text-xs">
                          {product.product_categories.name}
                        </Badge>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                          <Link href={`/shop/products/${product.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {products.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                <p className="text-gray-600 mb-4">Start by adding your first product to the catalog</p>
                <Button onClick={() => setShowProductForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No orders yet</div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                          <div className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                        <div className="text-sm">{order.order_items?.length || 0} items</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{order.total_amount.toLocaleString()}</div>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Summary (30 days)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span className="font-semibold">₹{totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Orders:</span>
                  <span className="font-semibold">{totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confirmed Orders:</span>
                  <span className="font-semibold">{confirmedOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Order Value:</span>
                  <span className="font-semibold">₹{averageOrderValue.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Active Products:</span>
                    <span className="font-semibold">{products.filter((p) => p.status === "active").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Draft Products:</span>
                    <span className="font-semibold">{products.filter((p) => p.status === "draft").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out of Stock:</span>
                    <span className="font-semibold">{products.filter((p) => p.inventory_count === 0).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Product Form Modal */}
      {(showProductForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          organizationId={organization.id}
          onSuccess={() => {
            setShowProductForm(false)
            setEditingProduct(null)
            // Refresh page to show new/updated product
            window.location.reload()
          }}
          onCancel={() => {
            setShowProductForm(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}
