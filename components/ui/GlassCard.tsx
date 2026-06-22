import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border border-gray-200 bg-white/50 dark:border-glass-border dark:bg-glass-dark p-6 backdrop-blur-xl shadow-glass transition-all duration-300",
          glow && "hover:shadow-glow hover:border-neon-purple/50 dark:hover:border-neon-purple/50",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-glass opacity-50 pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)
GlassCard.displayName = "GlassCard"
