import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  width?: number
  height?: number
  variant?: "default" | "white" | "dark"
}

export function Logo({ className, width = 120, height = 40, variant = "default" }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/fluffypet-logo.svg"
        alt="FluffyPet"
        width={width}
        height={height}
        className={cn(
          "h-auto w-auto",
          variant === "white" && "brightness-0 invert",
          variant === "dark" && "brightness-0",
        )}
        priority
      />
    </div>
  )
}
