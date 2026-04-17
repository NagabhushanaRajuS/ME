"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Reveal } from "@/components/ui/reveal"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { useThemeMode } from "@/components/providers/theme-provider"
import { personalInfo, socialLinks } from "@/lib/data"
import { staggerContainer, staggerItem } from "@/lib/motion"
import { InputField } from "@/components/forms/input-field"
import { TextAreaField } from "@/components/forms/textarea-field"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useFormHandler } from "@/lib/forms/use-form-handler"
import { contactFormSchema, ContactFormData } from "@/lib/forms/contact-schema"
import { sendContactEmail } from "@/lib/actions/send-contact-email"
import { useToast } from "@/components/ui/toast-system"

const initialFormValues: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
  phone: "",
  website: "",
}

export function ContactSection() {
  const { theme } = useThemeMode()
  const { addToast } = useToast()
  const [mounted, setMounted] = useState(false)

  const {
    values,
    errors,
    touched,
    loading,
    success,
    successMessage,
    errorMessage,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    getFieldError,
  } = useFormHandler({
    schema: contactFormSchema,
    initialValues: initialFormValues,
    onSubmit: async (data) => {
      try {
        const result = await sendContactEmail(data)
        if (result.success) {
          addToast(result.message, "success", 5000)
        } else {
          addToast(result.message, "error", 5000)
        }
        return result
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to send message"
        addToast(message, "error", 5000)
        return { success: false, message }
      }
    },
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section id="contact" className="relative mx-auto w-full max-w-7xl px-5 py-28 md:px-8 lg:px-12">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Contact</p>
          <div className="glow-line flex-1" />
        </div>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-5 lg:gap-14">
        <motion.div
          className="lg:col-span-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
        >
          <motion.h2
            className="font-heading text-3xl font-bold leading-tight text-text md:text-5xl"
            variants={staggerItem}
          >
            Let&apos;s craft your next <span className="gradient-text">category-defining</span> interface.
          </motion.h2>
          <motion.p
            className="mt-4 text-base leading-relaxed text-muted"
            variants={staggerItem}
          >
            Ready to push the boundaries of your product? I&apos;d love to hear about your vision and explore how we can bring it to life.
          </motion.p>

          <motion.div className="mt-8 flex flex-wrap gap-3" variants={staggerItem}>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                  theme === "dark"
                    ? "border-line/60 text-muted hover:border-accent hover:text-accent hover:shadow-aura"
                    : "border-line text-muted hover:border-accent hover:text-accent"
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </motion.div>

          <motion.p className="mt-8 text-sm text-muted" variants={staggerItem}>
            Or reach me directly at{" "}
            <a href={`mailto:${personalInfo.email}`} className="font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent2">
              {personalInfo.email}
            </a>
          </motion.p>
        </motion.div>

        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-card p-7 md:p-9">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center gap-4 py-12 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center"
                  >
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-text mb-2">Message Sent!</h3>
                    <p className="text-muted text-sm">{successMessage}</p>
                  </div>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={resetForm}
                    className="mt-4 px-6 py-2 text-sm font-semibold rounded-lg border border-accent text-accent hover:bg-accent/10 transition-colors"
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3"
                      >
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        {errorMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid gap-6 md:grid-cols-2">
                    <InputField
                      id="contact-name"
                      name="name"
                      label="Your Name"
                      type="text"
                      value={values.name}
                      error={getFieldError("name")}
                      touched={touched.name}
                      required
                      autoComplete="name"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <InputField
                      id="contact-email"
                      name="email"
                      label="Email Address"
                      type="email"
                      value={values.email}
                      error={getFieldError("email")}
                      touched={touched.email}
                      required
                      autoComplete="email"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  <InputField
                    id="contact-subject"
                    name="subject"
                    label="Subject"
                    type="text"
                    value={values.subject}
                    error={getFieldError("subject")}
                    touched={touched.subject}
                    required
                    disabled={loading}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <TextAreaField
                    id="contact-message"
                    name="message"
                    label="Tell me about your project"
                    value={values.message}
                    error={getFieldError("message")}
                    touched={touched.message}
                    maxLength={5000}
                    minLength={20}
                    minRows={4}
                    maxRows={10}
                    required
                    disabled={loading}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <InputField
                    id="contact-phone"
                    name="phone"
                    label="Phone (Optional)"
                    type="tel"
                    value={values.phone || ""}
                    error={getFieldError("phone")}
                    touched={touched.phone}
                    disabled={loading}
                    autoComplete="tel"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <input
                    type="text"
                    name="website"
                    value={values.website || ""}
                    onChange={handleChange}
                    style={{ display: "none" }}
                    autoComplete="off"
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="pt-4"
                  >
                    <MagneticButton
                      disabled={loading || success}
                      className={`group relative overflow-hidden rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] shadow-aura transition-all ${
                        loading || success
                          ? "opacity-50 cursor-not-allowed bg-accent/60"
                          : "bg-accent hover:shadow-aura-lg hover:bg-accent"
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading && <LoadingSpinner size="sm" />}
                        {loading ? "Sending..." : "Send Message"}
                      </span>
                      <span className="absolute inset-0 -z-0 bg-accent2 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </MagneticButton>
                  </motion.div>

                  <p className="text-xs text-muted text-center">
                    We respect your privacy. Your data will never be shared with third parties.
                  </p>
                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      className={`h-5 w-5 ${props.className || ""}`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="12" cy="12" r="10" opacity="0.3" />
      <path d="M12 8v4m0 4v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
