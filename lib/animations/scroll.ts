"use client"

import { useEffect, useRef, useState } from "react"
import { useMotionValue, useTransform, useScroll } from "framer-motion"
import { prefersReducedMotion } from "@/lib/motion"

export function useScrollReveal(options?: { offset?: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { offset = 200, delay = 0 } = options || {}

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.unobserve(entry.target)
        }
      },
      {
        rootMargin: `0px 0px -${offset}px 0px`,
        threshold: 0.1
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [offset, delay])

  return { ref, isVisible }
}

export function useScrollTrigger(options?: { triggerOffset?: number; endOffset?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const [triggerBounds, setTriggerBounds] = useState({ top: 0, height: 0 })

  useEffect(() => {
    const updateBounds = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        setTriggerBounds({
          top: rect.top + scrollTop,
          height: rect.height
        })
      }
    }

    updateBounds()
    window.addEventListener("resize", updateBounds)
    return () => window.removeEventListener("resize", updateBounds)
  }, [])

  const progress = useTransform(scrollY, [triggerBounds.top - window.innerHeight, triggerBounds.top], [0, 1], {
    clamp: true
  })

  return { ref, progress }
}

export function useParallax(speed: number = 0.5, options?: { maxOffset?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const { maxOffset = 100 } = options || {}

  const y = useTransform(scrollY, (value) => {
    if (prefersReducedMotion()) return 0
    const offset = value * speed
    return Math.min(offset, maxOffset)
  })

  return { ref, y }
}

export function useScrollProgress(options?: { start?: number; end?: number }) {
  const { scrollY } = useScroll()
  const { start = 0, end = typeof window !== "undefined" ? window.innerHeight * 3 : 1000 } = options || {}

  const progress = useTransform(scrollY, [start, end], [0, 1], { clamp: true })

  return progress
}

export function useInViewTrigger(
  callback?: (inView: boolean) => void,
  options?: { threshold?: number; rootMargin?: string }
) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const { threshold = 0.2, rootMargin = "0px 0px -100px 0px" } = options || {}

  useEffect(() => {
    if (prefersReducedMotion()) {
      setInView(true)
      callback?.(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        callback?.(entry.isIntersecting)
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin, callback])

  return { ref, inView }
}

export function useScrollVelocity() {
  const { scrollY } = useScroll()
  const [velocity, setVelocity] = useState(0)
  const prevYRef = useRef(0)
  const prevTimeRef = useRef(Date.now())

  useEffect(() => {
    const unsubscribe = scrollY.onChange((y) => {
      const now = Date.now()
      const deltaTime = Math.max(now - prevTimeRef.current, 1)
      const deltaY = y - prevYRef.current

      const currentVelocity = deltaY / deltaTime

      setVelocity(currentVelocity)
      prevYRef.current = y
      prevTimeRef.current = now
    })

    return unsubscribe
  }, [scrollY])

  return velocity
}
