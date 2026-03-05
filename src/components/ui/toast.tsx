"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const toastVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm shadow-lg transition-all data-[swipe=move]:transition-none data-[swipe=move]:cursor-grab data-[swipe=moved]:cursor-grabbing data-[swipe=recover]:animate-in data-[swipe=cancel]:animate-out data-[swipe=end]:animate-out",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        success: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
        purchase: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

interface ToastProps extends React.ComponentProps<"div">, VariantProps<typeof toastVariants> {
  onClose?: () => void
}

function Toast({ className, variant, onClose, children, ...props }: ToastProps) {
  return (
    <div className={cn(toastVariants({ variant }), className)} {...props}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>
  )
}

interface Toast {
  id: string
  title?: string
  message: string
  variant?: "default" | "success" | "purchase"
  duration?: number
}

interface ToasterContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToasterContext = React.createContext<ToasterContextType | undefined>(undefined)

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])

    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, toast.duration || 5000)
    }
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToasterContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-in slide-in-from-bottom-full fade-in duration-300"
          >
            <Toast
              variant={toast.variant}
              onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            >
              {toast.title && (
                <div className="font-semibold mb-1">{toast.title}</div>
              )}
              <div>{toast.message}</div>
            </Toast>
          </div>
        ))}
      </div>
    </ToasterContext.Provider>
  )
}

export function useToaster() {
  const context = React.useContext(ToasterContext)
  if (!context) {
    throw new Error("useToaster must be used within a ToasterProvider")
  }
  return context
}
