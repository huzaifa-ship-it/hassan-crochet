"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ToasterProvider } from "@/components/ui/toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToasterProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ToasterProvider>
  )
}
