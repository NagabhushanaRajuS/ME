"use client"

import { motion, AnimatePresence } from "framer-motion"
import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react"
import { Check, AlertCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "info"

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: ToastType, duration?: number) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let toastId = 0
const createToastId = () => `toast-${++toastId}`

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-400" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      case "info":
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  const getStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-950 border-green-700 text-green-200"
      case "error":
        return "bg-red-950 border-red-700 text-red-200"
      case "info":
        return "bg-blue-950 border-blue-700 text-blue-200"
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className={`pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 backdrop-blur-md ${getStyles(
              toast.type
            )}`}
          >
            <div className="mt-0.5 flex-shrink-0">{getIcon(toast.type)}</div>

            <p className="flex-1 text-sm leading-relaxed">{toast.message}</p>

            <button
              onClick={() => onRemove(toast.id)}
              className="ml-2 flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))

    // Clear timeout if exists
    const timeout = timeoutsRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType, duration = 4000): string => {
      const id = createToastId()

      setToasts((prev) => [...prev, { id, message, type, duration }])

      // Auto-dismiss after duration
      const timeout = setTimeout(() => {
        removeToast(id)
      }, duration)

      timeoutsRef.current.set(id, timeout)

      return id
    },
    [removeToast]
  )

  const clearAll = useCallback(() => {
    toasts.forEach((toast) => removeToast(toast.id))
  }, [toasts, removeToast])

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAll,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

