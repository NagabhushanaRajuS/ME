"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Check } from "lucide-react"
import { useEffect, useState } from "react"

interface InputFieldProps {
  id: string
  name: string
  label: string
  type?: string
  value: string
  placeholder?: string
  error?: string
  touched?: boolean
  maxLength?: number
  showCharCount?: boolean
  required?: boolean
  autoComplete?: string
  disabled?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
}

export function InputField({
  id,
  name,
  label,
  type = "text",
  value,
  placeholder = " ",
  error,
  touched,
  maxLength,
  showCharCount,
  required,
  autoComplete,
  disabled,
  onChange,
  onBlur,
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasShaken, setHasShaken] = useState(false)

  const isError = touched && !!error
  const charCount = value.length
  const charPercent = maxLength ? (charCount / maxLength) * 100 : 0

  // Trigger shake animation when error appears
  useEffect(() => {
    if (isError && !hasShaken) {
      setHasShaken(true)
      const timer = setTimeout(() => setHasShaken(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isError, hasShaken])

  const hasValidValue = touched && charCount > 0 && !isError

  return (
    <div className="relative w-full">
      {/* Input wrapper with glow effect */}
      <motion.div
        className={`relative ${
          isError ? "shake" : ""
        }`}
        animate={hasShaken ? { x: [0, -6, 6, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur(e)
          }}
          onFocus={() => setIsFocused(true)}
          className={`floating-input-field w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-transparent outline-none font-body text-base
            ${
              isFocused
                ? "border-accent shadow-[0_0_0_3px_var(--glow)] caret-accent"
                : "border-line hover:border-line/80"
            }
            ${isError ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />

        {/* Floating label */}
        <motion.label
          htmlFor={id}
          className="absolute left-4 top-3.5 text-muted text-base pointer-events-none select-none font-body origin-left"
          animate={{
            y: isFocused || charCount > 0 ? -28 : 0,
            scale: isFocused || charCount > 0 ? 0.75 : 1,
            color: isFocused || isError ? (isError ? "#ef4444" : "var(--accent)") : "var(--muted)",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </motion.label>

        {/* Status icons */}
        <AnimatePresence>
          {hasValidValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-3.5 text-green-400"
            >
              <Check className="h-5 w-5" />
            </motion.div>
          )}

          {isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-3.5 text-red-400"
            >
              <AlertCircle className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Character counter */}
      {showCharCount && maxLength && (
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex-1 h-1 rounded-full bg-line overflow-hidden">
            <motion.div
              className={`h-full transition-all duration-300 ${
                charPercent > 90
                  ? "bg-red-500"
                  : charPercent > 75
                    ? "bg-yellow-500"
                    : "bg-accent"
              }`}
              initial={{ width: "0%" }}
              animate={{ width: `${charPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-muted whitespace-nowrap">
            {charCount}/{maxLength}
          </span>
        </div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center gap-2 text-red-400 text-xs font-medium"
          >
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
