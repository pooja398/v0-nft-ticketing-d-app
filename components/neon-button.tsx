"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface NeonButtonProps {
  children: ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  disabled?: boolean
}

export function NeonButton({ children, className, size = "md", onClick, disabled = false }: NeonButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className="relative"
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        size={size}
        className={cn(
          "relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold",
          "hover:from-cyan-400 hover:to-purple-400 transition-all duration-300",
          "shadow-lg hover:shadow-cyan-500/25 hover:shadow-2xl",
          "border-0 disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
      >
        <span className="relative z-10">{children}</span>

        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0"
          whileHover={{ opacity: disabled ? 0 : 0.3 }}
          transition={{ duration: 0.3 }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      </Button>

      {/* Outer glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-md blur-md opacity-20 -z-10" />
    </motion.div>
  )
}
