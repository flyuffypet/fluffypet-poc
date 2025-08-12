"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export function QuantitySelector({ value, onChange, min = 1, max = 99, disabled = false }: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value) || min
    if (newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className="w-8 h-8 p-0 bg-transparent"
      >
        <Minus className="w-4 h-4" />
      </Button>

      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className="w-16 text-center"
      />

      <Button
        variant="outline"
        size="sm"
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className="w-8 h-8 p-0"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}
