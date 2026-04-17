import { z } from "zod"

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),

  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters")
    .regex(/^[a-zA-Z0-9\s.,!?'-]+$/, "Subject contains invalid characters"),

  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message must be less than 5000 characters")
    .regex(/^[a-zA-Z0-9\s.,!?'\-()&@:;/\n]+$/, "Message contains invalid characters"),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-()+.]+$/.test(val),
      "Please enter a valid phone number"
    )
    .refine(
      (val) => !val || val.replace(/\D/g, "").length >= 10,
      "Phone number must have at least 10 digits"
    ),

  // Honeypot field - should be empty
  website: z.string().max(0, "Invalid submission").optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Validation errors mapping for better UX
export const validationErrorMessages: Record<string, string> = {
  name: "Please enter a valid name",
  email: "Please enter a valid email address",
  subject: "Please enter a valid subject",
  message: "Please enter a valid message",
  phone: "Please enter a valid phone number (optional)",
}
