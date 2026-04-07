import nodemailer from "nodemailer"

type VisitorMailInput = {
  to: string
  viewerName: string
  companyName: string
}

type MailResult = {
  sent: boolean
  skipped: boolean
  error?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim()
  const portRaw = process.env.SMTP_PORT?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()
  const from = process.env.SMTP_FROM?.trim()

  if (!host || !portRaw || !user || !pass || !from) {
    return null
  }

  const port = Number(portRaw)
  if (!Number.isFinite(port)) {
    return null
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    secure: port === 465
  }
}

export async function sendVisitorThanksMail(input: VisitorMailInput): Promise<MailResult> {
  const config = getSmtpConfig()
  if (!config) {
    return { sent: false, skipped: true }
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    }
  })

  const firstName = input.viewerName.trim().split(/\s+/)[0] || "there"
  const safeFirstName = escapeHtml(firstName)
  const safeCompanyName = escapeHtml(input.companyName)
  const subject = "Thanks for visiting my portfolio"

  const text = [
    `Hi ${firstName},`,
    "",
    "Thank you for spending time on my portfolio.",
    "I am a fresher and still learning every day, so your visit means a lot.",
    "",
    `Company: ${input.companyName}`,
    "",
    "Have a great day,",
    "Nagabhushana Raju"
  ].join("\n")

  const html = `
    <div style="font-family:Segoe UI, Arial, sans-serif; line-height:1.6; color:#18324f;">
      <p>Hi ${safeFirstName},</p>
      <p>Thank you for spending time on my portfolio.</p>
      <p>I am a fresher and still learning every day, so your visit means a lot.</p>
      <p><strong>Company:</strong> ${safeCompanyName}</p>
      <p>Have a great day,<br/>Nagabhushana Raju</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: config.from,
      to: input.to,
      subject,
      text,
      html
    })

    return { sent: true, skipped: false }
  } catch (error) {
    return {
      sent: false,
      skipped: false,
      error: "SMTP send failed"
    }
  }
}
