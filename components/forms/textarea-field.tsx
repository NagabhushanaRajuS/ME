"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface TextAreaFieldProps {
  id: string
  name: string
  label: string
  value: string
  placeholder?: string
  error?: string
  touched?: boolean
  maxLength?: number
  minLength?: number
  minRows?: number
  maxRows?: number
  required?: boolean
  disabled?: boolean
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void
}

export function TextAreaField({
  id,
  name,
  label,
  value,
  placeholder = " ",
  error,
  touched,
  maxLength = 5000,
  minLength = 20,
  minRows = 4,
  maxRows = 12,
  required,
  disabled,
  onChange,
  onBlur,
}: TextAreaFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasShaken, setHasShaken] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isError = touched && !!error
  const charCount = value.length
  const charPercent = maxLength ? (charCount / maxLength) * 100 : 0

  // Auto-expand textarea height as user types
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto"

    // Calculate new height
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight)
    const minHeight = lineHeight * minRows
    const maxHeight = lineHeight * maxRows
    const scrollHeight = Math.max(textarea.scrollHeight, minHeight)
    const newHeight = Math.min(scrollHeight, maxHeight)

    textarea.style.height = `${newHeight}px`
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden"
  }, [value, minRows, maxRows])

  // Trigger shake animation when error appears
  useEffect(() => {
    if (isError && !hasShaken) {
      setHasShaken(true)
      const timer = setTimeout(() => setHasShaken(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isError, hasShaken])

  const hasValidValue = touched && charCount >= minLength && !isError

  return (
    <div className="relative w-full">
      {/* Textarea wrapper with shake animation */}
      <motion.div
        animate={hasShaken ? { x: [0, -6, 6, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <textarea
          ref={textareaRef}
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          required={required}
          disabled={disabled}
          onChange={(e) => {
            onChange(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur(e)
          }}
          onFocus={() => setIsFocused(true)}
          className={`floating-textarea-field w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-transparent outline-none font-body text-base resize-none
            ${
              isFocused
                ? "border-accent shadow-[0_0_0_3px_var(--glow)] caret-accent"
                : "border-line hover:border-line/80"
            }
            ${isError ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          style={{
            minHeight: `${parseInt(window.getComputedStyle(textareaRef.current || document.body).lineHeight) * minRows}px`,
          }}
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

      {/* Character counter and progress bar */}
      <div className="mt-3 flex items-center justify-between gap-3">
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
        <span className={`text-xs whitespace-nowrap font-medium ${
          charCount < minLength && touched && value.length > 0
            ? "text-yellow-400"
            : charPercent > 90
              ? "text-red-400"
              : "text-muted"
        }`}>
          {charCount}/{maxLength}
        </span>
      </div>

      {/* Help text showing minimum requirements */}
      {touched && charCount > 0 && charCount < minLength && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="mt-2 text-xs text-yellow-400"
        >
          Minimum {minLength} characters ({minLength - charCount} more needed)
        </motion.p>
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
