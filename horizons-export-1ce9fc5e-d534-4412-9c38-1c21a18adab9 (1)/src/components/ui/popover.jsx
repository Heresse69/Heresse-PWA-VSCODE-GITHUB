import * as React from "react"
import { cn } from "@/lib/utils"

// Version simplifiée sans Radix UI en attendant l'installation
const Popover = ({ children, open, onOpenChange }) => {
  return (
    <div className="relative">
      {children}
    </div>
  )
}

const PopoverTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props}>
    {children}
  </div>
))

const PopoverContent = React.forwardRef(({ className, children, align = "center", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute z-50 w-72 rounded-md border bg-slate-800 p-4 text-white shadow-md",
      align === "end" ? "right-0" : "left-0",
      className
    )}
    {...props}
  >
    {children}
  </div>
))

PopoverTrigger.displayName = "PopoverTrigger"
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
