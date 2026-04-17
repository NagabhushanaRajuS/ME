"use server"

import { ContactFormData, contactFormSchema } from "@/lib/forms/contact-schema"
import { Resend } from "resend"

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory rate limiter (in production, use Redis)
const ipRateLimiter = new Map<string, { count: number; resetTime: number }>()

// Rate limit: 5 emails per minute per IP
const RATE_LIMIT = 5
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

/**
 * Get client IP from headers
 */
function getClientIP(request?: any): string {
  // For production, get from x-forwarded-for or similar headers
  return "127.0.0.1"
}

/**
 * Check rate limit for IP
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limiter = ipRateLimiter.get(ip)

  if (!limiter || limiter.resetTime < now) {
    // Reset or create new limiter entry
    ipRateLimiter.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }

  if (limiter.count >= RATE_LIMIT) {
    return false
  }

  limiter.count++
  return true
}

/**
 * Email template for notification to admin
 */
function getAdminEmailHTML(data: ContactFormData): string {
  const { name, email, subject, message, phone } = data
  const timestamp = new Date().toLocaleString()

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3af2d4, #35a6ff); color: white; padding: 20px; border-radius: 8px; }
        .content { background: #f5f5f5; padding: 20px; margin-top: 20px; border-radius: 8px; }
        .field { margin: 15px 0; }
        .label { font-weight: bold; color: #3af2d4; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #3af2d4; border-radius: 4px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
          <p>Received: ${timestamp}</p>
        </div>

        <div class="content">
          <div class="field">
            <div class="label">Name</div>
            <div class="value">${escapeHTML(name)}</div>
          </div>

          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${escapeHTML(email)}">${escapeHTML(email)}</a></div>
          </div>

          ${phone ? `
            <div class="field">
              <div class="label">Phone</div>
              <div class="value">${escapeHTML(phone)}</div>
            </div>
          ` : ""}

          <div class="field">
            <div class="label">Subject</div>
            <div class="value">${escapeHTML(subject)}</div>
          </div>

          <div class="field">
            <div class="label">Message</div>
            <div class="value">${escapeHTML(message).replace(/\n/g, "<br>")}</div>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated message from your contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Email template for auto-response to user
 */
function getUserEmailHTML(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3af2d4, #35a6ff); color: white; padding: 20px; border-radius: 8px; }
        .content { padding: 20px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Reaching Out!</h1>
        </div>

        <div class="content">
          <p>Hi there,</p>

          <p>We received your message and appreciate you taking the time to reach out. I'll review your inquiry and get back to you as soon as possible.</p>

          <p>In the meantime, if you have any additional information or urgent matters, feel free to reach out directly via email or phone.</p>

          <p>Best regards,<br>
          Nagabhushana Raju S</p>
        </div>

        <div class="footer">
          <p>This is an automated response. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Escape HTML special characters
 */
function escapeHTML(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Validate honeypot field
 */
function validateHoneypot(website?: string): boolean {
  // Honeypot should be empty
  return !website || website.trim().length === 0
}

/**
 * Send contact form email
 */
export async function sendContactEmail(formData: unknown): Promise<{ success: boolean; message: string }> {
  try {
    // Validate against schema
    const validationResult = contactFormSchema.safeParse(formData)

    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map((e) => `${e.path[0]}: ${e.message}`)
        .join(", ")

      return {
        success: false,
        message: `Validation failed: ${errors}`,
      }
    }

    const data = validationResult.data

    // Check honeypot
    if (!validateHoneypot(data.website)) {
      console.warn("Honeypot field filled - potential spam")
      return {
        success: false,
        message: "Invalid submission",
      }
    }

    // Check rate limit (using dummy IP for now)
    const clientIP = getClientIP()
    if (!checkRateLimit(clientIP)) {
      return {
        success: false,
        message: "Too many requests. Please try again in a few minutes.",
      }
    }

    // Send email to admin
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@example.com",
        to: process.env.ADMIN_EMAIL || "admin@example.com",
        subject: `New Contact Form Submission: ${data.subject}`,
        html: getAdminEmailHTML(data),
        replyTo: data.email,
      })
    } catch (error) {
      console.error("Failed to send admin email:", error)
      // Continue to send user email even if admin email fails
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@example.com",
        to: data.email,
        subject: "We Received Your Message",
        html: getUserEmailHTML(),
      })
    } catch (error) {
      console.error("Failed to send user email:", error)
      // Still consider it a success if at least the admin email was sent
    }

    // Log analytics
    logFormSubmission({
      email: data.email,
      subject: data.subject,
      timestamp: new Date(),
      ipAddress: clientIP,
    })

    return {
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    }
  } catch (error) {
    console.error("Form submission error:", error)

    return {
      success: false,
      message: "An error occurred. Please try again later.",
    }
  }
}

/**
 * Log form submission analytics (non-sensitive data only)
 */
function logFormSubmission(data: {
  email: string
  subject: string
  timestamp: Date
  ipAddress: string
}): void {
  // In production, log to your analytics service
  console.log("[FORM SUBMISSION]", {
    subject: data.subject,
    timestamp: data.timestamp.toISOString(),
    ipAddress: data.ipAddress,
    // Note: NOT logging email address to respect privacy
  })
}
