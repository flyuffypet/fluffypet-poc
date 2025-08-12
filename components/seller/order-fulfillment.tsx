"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner"

interface OrderFulfillmentProps {
  data: {
    orders: any[]
    organizationId: string
  }
}

export function OrderFulfillment({ data }: OrderFulfillmentProps) {
  const { orders, organizationId } = data
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [refundReason, setRefundReason] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-green-100 text-green-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      processing: <Package className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      refunded: <XCircle className="w-4 h-4" />,
    }
    return icons[status] || <Clock className="w-4 h-4" />
  }

  const updateOrderStatus = async (orderId: string, newStatus: string, notes?: string) => {
    const supabase = createClient()

    try {
      // Update order status
      const { error: orderError } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

      if (orderError) throw orderError

      // Add status history entry
      const { error: historyError } = await supabase.from("order_status_history").insert({
        order_id: orderId,
        status: newStatus,
        notes: notes || `Order status updated to ${newStatus}`,
      })

      if (historyError) throw historyError

      toast.success("Order status updated successfully!")
      // Refresh page to show updated status
      window.location.reload()
    } catch (error) {
      console.error("Status update error:", error)
      toast.error("Failed to update order status")
    }
  }

  const addTrackingNumber = async (orderId: string, tracking: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          tracking_number: tracking,
          status: "shipped",
        })
        .eq("id", orderId)

      if (error) throw error

      // Add status history
      await supabase.from("order_status_history").insert({
        order_id: orderId,
        status: "shipped",
        notes: `Order shipped with tracking number: ${tracking}`,
      })

      toast.success("Tracking number added and order marked as shipped!")
      setTrackingNumber("")
      setSelectedOrder(null)
      window.location.reload()
    } catch (error) {
      console.error("Tracking update error:", error)
      toast.error("Failed to add tracking number")
    }
  }

  const processRefund = async (orderId: string, reason: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "refunded",
        })
        .eq("id", orderId)

      if (error) throw error

      // Add status history
      await supabase.from("order_status_history").insert({
        order_id: orderId,
        status: "refunded",
        notes: `Refund processed. Reason: ${reason}`,
      })

      toast.success("Refund processed successfully!")
      setRefundReason("")
      setSelectedOrder(null)
      window.location.reload()
    } catch (error) {
      console.error("Refund error:", error)
      toast.error("Failed to process refund")
    }
  }

  // Filter orders based on status
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true
    return order.status === statusFilter
  })

  // Group orders by status for dashboard
  const ordersByStatus = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  return (
    <div className="space-y-6">
      {/* Order Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(ordersByStatus).map(([status, count]) => (
          <Card key={status} className="cursor-pointer hover:shadow-md" onClick={() => setStatusFilter(status)}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">{getStatusIcon(status)}</div>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders Management */}
      <Tabs defaultValue="fulfillment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fulfillment">Order Fulfillment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping Management</TabsTrigger>
          <TabsTrigger value="returns">Returns & Refunds</TabsTrigger>
        </TabsList>

        <TabsContent value="fulfillment" className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-4">
            <Label>Filter by status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                  <p className="text-gray-600">
                    {statusFilter === "all" ? "You haven't received any orders yet." : `No ${statusFilter} orders.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Placed: {new Date(order.created_at).toLocaleDateString()}</div>
                          <div>Total: ₹{order.total_amount.toLocaleString()}</div>
                          {order.tracking_number && <div>Tracking: {order.tracking_number}</div>}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderDetails(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>

                        {order.status === "confirmed" && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, "processing")}>
                            Start Processing
                          </Button>
                        )}

                        {order.status === "processing" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order)
                              setTrackingNumber("")
                            }}
                          >
                            Ship Order
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.order_items?.map((item: any) => {
                        const product = item.products
                        const primaryImage =
                          product.product_images?.find((img: any) => img.display_order === 0) ||
                          product.product_images?.[0]

                        return (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {primaryImage ? (
                                <Image
                                  src={primaryImage.image_url || "/placeholder.svg"}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Package className="w-6 h-6" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-600">
                                Qty: {item.quantity} × ₹{item.price_at_purchase.toLocaleString()}
                              </div>
                            </div>

                            <div className="font-semibold">
                              ₹{(item.quantity * item.price_at_purchase).toLocaleString()}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter((o) => o.status === "shipped" || o.tracking_number)
                  .map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                        <div className="text-sm text-gray-600">
                          Tracking: {order.tracking_number || "No tracking number"}
                        </div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                  ))}

                {orders.filter((o) => o.status === "shipped" || o.tracking_number).length === 0 && (
                  <div className="text-center py-8 text-gray-500">No shipped orders</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Returns & Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter((o) => o.status === "cancelled" || o.status === "refunded")
                  .map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                        <div className="text-sm text-gray-600">₹{order.total_amount.toLocaleString()}</div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                  ))}

                {orders.filter((o) => o.status === "cancelled" || o.status === "refunded").length === 0 && (
                  <div className="text-center py-8 text-gray-500">No returns or refunds</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <Dialog open onOpenChange={() => setShowOrderDetails(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order #{selectedOrder.id.slice(0, 8)} Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <div className="mt-1 font-semibold">₹{selectedOrder.total_amount.toLocaleString()}</div>
                </div>
                <div>
                  <Label>Order Date</Label>
                  <div className="mt-1">{new Date(selectedOrder.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <Label>Tracking Number</Label>
                  <div className="mt-1">{selectedOrder.tracking_number || "Not assigned"}</div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div>
                  <Label>Shipping Address</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{selectedOrder.shipping_address.name}</div>
                    <div>{selectedOrder.shipping_address.street_address}</div>
                    <div>
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}{" "}
                      {selectedOrder.shipping_address.postal_code}
                    </div>
                    {selectedOrder.shipping_address.phone && <div>{selectedOrder.shipping_address.phone}</div>}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <Label>Order Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.products.name}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-semibold">₹{(item.quantity * item.price_at_purchase).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.order_status_history && selectedOrder.order_status_history.length > 0 && (
                <div>
                  <Label>Status History</Label>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.order_status_history.map((history: any) => (
                      <div key={history.id} className="flex items-center justify-between p-2 text-sm">
                        <div>
                          <Badge variant="outline" className="mr-2">
                            {history.status}
                          </Badge>
                          {history.notes}
                        </div>
                        <div className="text-gray-500">{new Date(history.created_at).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedOrder.status === "confirmed" && (
                  <Button onClick={() => updateOrderStatus(selectedOrder.id, "processing")}>Start Processing</Button>
                )}

                {selectedOrder.status === "processing" && (
                  <Button onClick={() => updateOrderStatus(selectedOrder.id, "shipped")}>Mark as Shipped</Button>
                )}

                {selectedOrder.status === "shipped" && (
                  <Button onClick={() => updateOrderStatus(selectedOrder.id, "delivered")}>Mark as Delivered</Button>
                )}

                {["confirmed", "processing"].includes(selectedOrder.status) && (
                  <Button
                    variant="destructive"
                    onClick={() => updateOrderStatus(selectedOrder.id, "cancelled", "Cancelled by seller")}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Tracking Number Modal */}
      {selectedOrder && trackingNumber !== undefined && !showOrderDetails && (
        <Dialog open onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tracking Number</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="tracking">Tracking Number</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedOrder(null)} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={() => addTrackingNumber(selectedOrder.id, trackingNumber)}
                  disabled={!trackingNumber.trim()}
                  className="flex-1"
                >
                  Ship Order
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Refund Modal */}
      {selectedOrder && refundReason !== undefined && (
        <Dialog open onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process Refund</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="refund-reason">Refund Reason</Label>
                <Textarea
                  id="refund-reason"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter reason for refund"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedOrder(null)} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={() => processRefund(selectedOrder.id, refundReason)}
                  disabled={!refundReason.trim()}
                  className="flex-1"
                >
                  Process Refund
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
