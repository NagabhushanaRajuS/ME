"use client"

import { useState, useCallback, useRef } from "react"
import { z } from "zod"

export interface FormState<T extends Record<string, any>> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  loading: boolean
  success: boolean
  successMessage: string
  errorMessage: string
}

export interface UseFormHandlerOptions<T extends Record<string, any>> {
  schema: z.ZodSchema
  onSubmit: (data: T) => Promise<{ success: boolean; message?: string }>
  initialValues: T
}

export function useFormHandler<T extends Record<string, any>>({
  schema,
  onSubmit,
  initialValues,
}: UseFormHandlerOptions<T>) {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    loading: false,
    success: false,
    successMessage: "Message sent successfully!",
    errorMessage: "",
  })

  const submitTimeoutRef = useRef<NodeJS.Timeout>()

  /**
   * Handle field changes
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target

      setFormState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [name]: value,
        },
        // Clear error when user starts typing
        errors: {
          ...prev.errors,
          [name]: "",
        },
      }))
    },
    []
  )

  /**
   * Handle field blur - validate single field
   */
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target
      const value = formState.values[name as keyof T]

      setFormState((prev) => ({
        ...prev,
        touched: {
          ...prev.touched,
          [name]: true,
        },
      }))

      // Validate single field
      if (schema instanceof z.ZodObject) {
        const fieldSchema = (schema as z.ZodObject<any>).shape[name]
        if (fieldSchema) {
          const result = fieldSchema.safeParse(value)
          if (!result.success) {
            const errorMessage = result.error.errors[0]?.message || "Invalid field"
            setFormState((prev) => ({
              ...prev,
              errors: {
                ...prev.errors,
                [name]: errorMessage,
              },
            }))
          }
        }
      }
    },
    [formState.values, schema]
  )

  /**
   * Validate entire form
   */
  const validateForm = useCallback((): boolean => {
    const result = schema.safeParse(formState.values)

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.errors.forEach((error) => {
        const path = error.path[0] as string
        newErrors[path] = error.message
      })

      setFormState((prev) => ({
        ...prev,
        errors: newErrors,
      }))

      return false
    }

    return true
  }, [formState.values, schema])

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      // Mark all fields as touched
      const allTouched = Object.keys(formState.values).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {}
      )

      setFormState((prev) => ({
        ...prev,
        touched: allTouched,
      }))

      // Validate form
      if (!validateForm()) {
        return
      }

      // Set loading state
      setFormState((prev) => ({
        ...prev,
        loading: true,
        errorMessage: "",
      }))

      try {
        // Submit form
        const result = await onSubmit(formState.values as T)

        if (result.success) {
          setFormState((prev) => ({
            ...prev,
            success: true,
            successMessage: result.message || "Message sent successfully!",
            loading: false,
            errors: {},
            values: initialValues,
            touched: {},
          }))

          // Clear success message after 5 seconds
          submitTimeoutRef.current = setTimeout(() => {
            setFormState((prev) => ({
              ...prev,
              success: false,
            }))
          }, 5000)
        } else {
          setFormState((prev) => ({
            ...prev,
            loading: false,
            errorMessage: result.message || "Failed to send message. Please try again.",
          }))
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "An error occurred. Please try again."

        setFormState((prev) => ({
          ...prev,
          loading: false,
          errorMessage: errorMsg,
        }))
      }
    },
    [formState.values, validateForm, onSubmit, initialValues]
  )

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current)
    }

    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      loading: false,
      success: false,
      successMessage: "Message sent successfully!",
      errorMessage: "",
    })
  }, [initialValues])

  /**
   * Get field error if touched
   */
  const getFieldError = useCallback(
    (fieldName: string): string => {
      if (formState.touched[fieldName]) {
        return formState.errors[fieldName] || ""
      }
      return ""
    },
    [formState.errors, formState.touched]
  )

  /**
   * Check if field has error and is touched
   */
  const hasError = useCallback(
    (fieldName: string): boolean => {
      return formState.touched[fieldName] && !!formState.errors[fieldName]
    },
    [formState.errors, formState.touched]
  )

  return {
    ...formState,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    getFieldError,
    hasError,
  }
}
