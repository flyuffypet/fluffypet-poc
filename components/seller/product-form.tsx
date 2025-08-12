"use client"

import type { React } from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner"

interface ProductFormProps {
  product?: any
  organizationId: string
  onSuccess: () => void
  onCancel: () => void
}

export function ProductForm({ product, organizationId, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    currency: product?.currency || "INR",
    inventory_count: product?.inventory_count || "",
    sku: product?.sku || "",
    category_id: product?.category_id || "",
    status: product?.status || "draft",
    weight_kg: product?.weight_kg || "",
    tags: product?.tags || [],
  })

  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState(product?.product_images || [])
  const [variants, setVariants] = useState(product?.product_variants || [])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load categories on mount
  import("react").useEffect(() => {
    const loadCategories = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("product_categories").select("*").order("name")
      setCategories(data || [])
    }
    loadCategories()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (imageId: string) => {
    setExistingImages((prev: any[]) => prev.filter((img) => img.id !== imageId))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: `temp-${Date.now()}`,
        name: "",
        value: "",
        variant_type: "",
        price_adjustment: 0,
        inventory_count: 0,
        sku: "",
      },
    ])
  }

  const updateVariant = (index: number, field: string, value: any) => {
    setVariants((prev) => prev.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)))
  }

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (productId: string) => {
    const supabase = createClient()
    const uploadedImages = []

    for (let i = 0; i < images.length; i++) {
      const file = images[i]
      const fileExt = file.name.split(".").pop()
      const fileName = `${productId}/${Date.now()}-${i}.${fileExt}`

      try {
        // Upload to Vercel Blob
        const formData = new FormData()
        formData.append("file", file)

        const uploadResponse = await fetch("/api/blob/generate-upload-url", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) throw new Error("Failed to upload image")

        const { url } = await uploadResponse.json()

        // Save image record to database
        const { data: imageRecord, error } = await supabase
          .from("product_images")
          .insert({
            product_id: productId,
            image_url: url,
            alt_text: formData.name,
            display_order: existingImages.length + i,
          })
          .select()
          .single()

        if (error) throw error
        uploadedImages.push(imageRecord)
      } catch (error) {
        console.error("Image upload error:", error)
        toast.error(`Failed to upload image: ${file.name}`)
      }
    }

    return uploadedImages
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price) {
      toast.error("Please fill in required fields")
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price as string),
        inventory_count: Number.parseInt(formData.inventory_count as string) || 0,
        weight_kg: formData.weight_kg ? Number.parseFloat(formData.weight_kg as string) : null,
        organization_id: organizationId,
      }

      let productId: string

      if (product) {
        // Update existing product
        const { error } = await supabase.from("products").update(productData).eq("id", product.id)
        if (error) throw error
        productId = product.id
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase.from("products").insert(productData).select().single()
        if (error) throw error
        productId = newProduct.id
      }

      // Upload new images
      if (images.length > 0) {
        await uploadImages(productId)
      }

      // Handle variants
      if (variants.length > 0) {
        const validVariants = variants.filter((v) => v.name && v.value && v.variant_type)

        for (const variant of validVariants) {
          if (variant.id.startsWith("temp-")) {
            // Create new variant
            const { error } = await supabase.from("product_variants").insert({
              product_id: productId,
              name: variant.name,
              value: variant.value,
              variant_type: variant.variant_type,
              price_adjustment: Number.parseFloat(variant.price_adjustment) || 0,
              inventory_count: Number.parseInt(variant.inventory_count) || 0,
              sku: variant.sku,
            })
            if (error) throw error
          } else {
            // Update existing variant
            const { error } = await supabase
              .from("product_variants")
              .update({
                name: variant.name,
                value: variant.value,
                variant_type: variant.variant_type,
                price_adjustment: Number.parseFloat(variant.price_adjustment) || 0,
                inventory_count: Number.parseInt(variant.inventory_count) || 0,
                sku: variant.sku,
              })
              .eq("id", variant.id)
            if (error) throw error
          }
        }
      }

      toast.success(product ? "Product updated successfully!" : "Product created successfully!")
      onSuccess()
    } catch (error) {
      console.error("Product save error:", error)
      toast.error("Failed to save product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="inventory_count">Stock Quantity</Label>
                  <Input
                    id="inventory_count"
                    type="number"
                    value={formData.inventory_count}
                    onChange={(e) => setFormData({ ...formData, inventory_count: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="weight_kg">Weight (kg)</Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    step="0.01"
                    value={formData.weight_kg}
                    onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <Label>Current Images</Label>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    {existingImages.map((image: any, index: number) => (
                      <div key={image.id} className="relative">
                        <Image
                          src={image.image_url || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0"
                          onClick={() => removeExistingImage(image.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {images.length > 0 && (
                <div>
                  <Label>New Images</Label>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`New image ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-4 h-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
