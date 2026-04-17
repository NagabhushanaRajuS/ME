"use server"

import { ContactFormData, contactFormSchema } from "@/lib/forms/contact-schema"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const ipRateLimiter = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 5
const RATE_LIMIT_WINDOW = 60 * 1000

function getClientIP(request?: any): string {
  return "127.0.0.1"
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limiter = ipRateLimiter.get(ip)

  if (!limiter || limiter.resetTime < now) {
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

function getAdminEmailHTML(data: ContactFormData): string {
  const { name, email, subject, message, phone } = data
  const timestamp = new Date().toLocaleString()

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#3af2d4,#35a6ff);color:white;padding:20px;border-radius:8px}.content{background:#f5f5f5;padding:20px;margin-top:20px;border-radius:8px}.field{margin:15px 0}.label{font-weight:bold;color:#3af2d4}.value{margin-top:5px;padding:10px;background:white;border-left:3px solid #3af2d4;border-radius:4px}.footer{margin-top:20px;padding-top:20px;border-top:1px solid #ddd;font-size:12px;color:#666}</style></head><body><div class="container"><div class="header"><h1>New Contact Form Submission</h1><p>Received: ${timestamp}</p></div><div class="content"><div class="field"><div class="label">Name</div><div class="value">${name}</div></div><div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${email}">${email}</a></div></div>${phone ? `<div class="field"><div class="label">Phone</div><div class="value">${phone}</div></div>` : ""}<div class="field"><div class="label">Subject</div><div class="value">${subject}</div></div><div class="field"><div class="label">Message</div><div class="value">${message.replace(/\n/g, "<br>")}</div></div></div><div class="footer"><p>This is an automated message from your contact form.</p></div></div></body></html>`
}

function getUserEmailHTML(): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#3af2d4,#35a6ff);color:white;padding:20px;border-radius:8px}.content{padding:20px}.footer{margin-top:20px;padding-top:20px;border-top:1px solid #ddd;font-size:12px;color:#666}</style></head><body><div class="container"><div class="header"><h1>Thank You for Reaching Out!</h1></div><div class="content"><p>Hi there,</p><p>We received your message and appreciate you taking the time to reach out. I'll review your inquiry and get back to you as soon as possible.</p><p>Best regards,<br>Nagabhushana Raju S</p></div><div class="footer"><p>This is an automated response. Please do not reply to this email.</p></div></div></body></html>`
}

function validateHoneypot(website?: string): boolean {
  return !website || website.trim().length === 0
}

export async function sendContactEmail(formData: unknown): Promise<{ success: boolean; message: string }> {
  try {
    const validationResult = contactFormSchema.safeParse(formData)

    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((e) => `${e.path[0]}: ${e.message}`)
        .join(", ")

      return {
        success: false,
        message: `Validation failed: ${errors}`,
      }
    }

    const data = validationResult.data

    if (!validateHoneypot(data.website)) {
      console.warn("Honeypot field filled - potential spam")
      return {
        success: false,
        message: "Invalid submission",
      }
    }

    const clientIP = getClientIP()
    if (!checkRateLimit(clientIP)) {
      return {
        success: false,
        message: "Too many requests. Please try again in a few minutes.",
      }
    }

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
    }

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@example.com",
        to: data.email,
        subject: "We Received Your Message",
        html: getUserEmailHTML(),
      })
    } catch (error) {
      console.error("Failed to send user email:", error)
    }

    console.log("[FORM SUBMISSION]", {
      subject: data.subject,
      timestamp: new Date().toISOString(),
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
