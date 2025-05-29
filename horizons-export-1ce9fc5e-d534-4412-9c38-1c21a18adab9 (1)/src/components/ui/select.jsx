import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          value, 
          onValueChange, 
          isOpen, 
          setIsOpen 
        })
      )}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, value, isOpen, setIsOpen, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    onClick={() => setIsOpen(!isOpen)}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
))

const SelectContent = ({ className, children, isOpen, ...props }) => {
  if (!isOpen) return null
  
  return (
    <div
      className={cn(
        "absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "top-full mt-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const SelectItem = ({ className, children, value, onValueChange, setIsOpen, ...props }) => (
  <div
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    onClick={() => {
      onValueChange(value)
      setIsOpen(false)
    }}
    {...props}
  >
    {children}
  </div>
)

const SelectValue = ({ placeholder, value }) => {
  return <span>{value || placeholder}</span>
}

SelectTrigger.displayName = "SelectTrigger"
SelectContent.displayName = "SelectContent"
SelectItem.displayName = "SelectItem"
SelectValue.displayName = "SelectValue"

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }
