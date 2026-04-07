"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useThemeMode } from "@/components/providers/theme-provider"
import type { ThemeMode } from "@/lib/themes"

type HologramFaceProps = {
  photoUrls: string[]
  className?: string
}

type MaskPoint = {
  x: number
  y: number
  z: number
  edge: number
}

type ProjectedPoint = {
  x: number
  y: number
  depth: number
  alpha: number
}

const TARGET_POINTS = 760
const SOURCE_SIZE = 200

type HologramPalette = {
  bgTop: string
  bgBottom: string
  triangle: string
  mesh: string
  point: string
  square: string
  hex: string
  wave: string
  scan: string
  frame: string
  beamCore: string
  beamEdge: string
  beamGlow: string
}

const HOLOGRAM_PALETTES: Record<ThemeMode, HologramPalette> = {
  light: {
    bgTop: "rgba(236, 244, 255, 0.96)",
    bgBottom: "rgba(223, 237, 255, 0.92)",
    triangle: "74, 140, 255",
    mesh: "49, 160, 255",
    point: "84, 170, 255",
    square: "58, 144, 255",
    hex: "55, 126, 250",
    wave: "74, 140, 255",
    scan: "58, 144, 255",
    frame: "58, 144, 255",
    beamCore: "rgba(92, 165, 255, 0.3)",
    beamEdge: "rgba(58, 140, 255, 0.1)",
    beamGlow: "rgba(58, 140, 255, 0.18)"
  },
  medium: {
    bgTop: "rgba(35, 20, 14, 0.94)",
    bgBottom: "rgba(25, 14, 10, 0.9)",
    triangle: "255, 140, 94",
    mesh: "255, 176, 56",
    point: "255, 188, 98",
    square: "255, 130, 90",
    hex: "255, 174, 73",
    wave: "255, 145, 95",
    scan: "255, 165, 99",
    frame: "255, 145, 95",
    beamCore: "rgba(255, 170, 99, 0.32)",
    beamEdge: "rgba(255, 110, 70, 0.12)",
    beamGlow: "rgba(255, 130, 82, 0.2)"
  },
  dark: {
    bgTop: "rgba(2, 10, 7, 0.96)",
    bgBottom: "rgba(2, 8, 6, 0.94)",
    triangle: "94, 255, 186",
    mesh: "70, 255, 170",
    point: "165, 255, 220",
    square: "52, 255, 151",
    hex: "95, 240, 255",
    wave: "64, 235, 156",
    scan: "64, 235, 156",
    frame: "70, 255, 170",
    beamCore: "rgba(56, 248, 155, 0.34)",
    beamEdge: "rgba(56, 248, 155, 0.1)",
    beamGlow: "rgba(56, 248, 155, 0.18)"
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function easeInOut(value: number) {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2
}

function sanitizePhotoUrls(input: string[]) {
  return input
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 5)
    .map((item) => {
      if (/^https?:\/\//i.test(item)) {
        return `/api/hologram/photo?url=${encodeURIComponent(item)}`
      }
      return item
    })
}

function seededRandom(seedText: string) {
  let seed = 2166136261
  for (let i = 0; i < seedText.length; i += 1) {
    seed ^= seedText.charCodeAt(i)
    seed += (seed << 1) + (seed << 4) + (seed << 7) + (seed << 8) + (seed << 24)
  }

  return () => {
    seed += 0x6d2b79f5
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function normalizePoints(points: MaskPoint[], count: number, randomizer?: () => number) {
  if (!points.length) {
    return fallbackMask(String(Math.random()))
  }

  const random = randomizer ?? Math.random
  const out: MaskPoint[] = []

  for (let i = 0; i < count; i += 1) {
    const p = points[i % points.length]
    const jitter = (random() - 0.5) * 0.015
    out.push({
      x: clamp(p.x + jitter, -0.82, 0.82),
      y: clamp(p.y + jitter, -0.9, 0.9),
      z: clamp(p.z + jitter * 1.7, -0.22, 0.72),
      edge: clamp(p.edge + jitter * 6, 0.18, 1)
    })
  }

  return out
}

function fallbackMask(seedText: string): MaskPoint[] {
  const random = seededRandom(seedText)
  const points: MaskPoint[] = []

  for (let i = 0; i < TARGET_POINTS; i += 1) {
    const angle = random() * Math.PI * 2
    const radial = Math.sqrt(random() * 0.95 + 0.05)
    const x = Math.cos(angle) * radial * 0.7
    const y = Math.sin(angle) * radial * 0.85

    const insideHead = (x * x) / 0.36 + (y * y) / 0.58 <= 1
    if (!insideHead) continue

    const jaw = y > 0 ? 1 : 1 - Math.abs(y) * 0.14
    const nose = Math.exp(-((x * x) * 14 + (y + 0.04) * (y + 0.04) * 62)) * 0.15
    const z = (1 - radial) * 0.24 * jaw + nose
    const ring = Math.abs(radial - 0.78)
    const edge = clamp(1 - ring * 4.2, 0.2, 1)

    points.push({
      x,
      y,
      z,
      edge
    })
  }

  return normalizePoints(points, TARGET_POINTS, random)
}

function extractMaskFromImage(image: HTMLImageElement, sourceLabel: string): MaskPoint[] {
  const canvas = document.createElement("canvas")
  canvas.width = SOURCE_SIZE
  canvas.height = SOURCE_SIZE

  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) return fallbackMask(sourceLabel)

  const side = Math.min(image.naturalWidth || SOURCE_SIZE, image.naturalHeight || SOURCE_SIZE)
  const sx = Math.max(0, ((image.naturalWidth || SOURCE_SIZE) - side) / 2)
  const sy = Math.max(0, ((image.naturalHeight || SOURCE_SIZE) - side) / 2)

  context.clearRect(0, 0, SOURCE_SIZE, SOURCE_SIZE)
  context.drawImage(image, sx, sy, side, side, 0, 0, SOURCE_SIZE, SOURCE_SIZE)

  let data: Uint8ClampedArray
  try {
    data = context.getImageData(0, 0, SOURCE_SIZE, SOURCE_SIZE).data
  } catch {
    return fallbackMask(sourceLabel)
  }

  const luminance = new Float32Array(SOURCE_SIZE * SOURCE_SIZE)
  for (let y = 0; y < SOURCE_SIZE; y += 1) {
    for (let x = 0; x < SOURCE_SIZE; x += 1) {
      const i = (y * SOURCE_SIZE + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      luminance[y * SOURCE_SIZE + x] = 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
  }

  const points: MaskPoint[] = []
  const step = 3

  for (let y = 1; y < SOURCE_SIZE - 1; y += step) {
    for (let x = 1; x < SOURCE_SIZE - 1; x += step) {
      const index = (y * SOURCE_SIZE + x) * 4
      const alpha = data[index + 3] / 255
      if (alpha < 0.18) continue

      const left = luminance[y * SOURCE_SIZE + (x - 1)]
      const right = luminance[y * SOURCE_SIZE + (x + 1)]
      const top = luminance[(y - 1) * SOURCE_SIZE + x]
      const bottom = luminance[(y + 1) * SOURCE_SIZE + x]

      const gradX = Math.abs(right - left)
      const gradY = Math.abs(bottom - top)
      const edge = clamp((gradX + gradY) / 95, 0, 1)
      if (edge < 0.18) continue

      const lum = luminance[y * SOURCE_SIZE + x] / 255

      const nx = (x / SOURCE_SIZE - 0.5) * 1.3
      const ny = (y / SOURCE_SIZE - 0.52) * 1.45
      const centerDist = Math.hypot(nx * 0.9, ny * 0.86)
      const nz = (0.38 - lum) * 0.44 + edge * 0.48 + (1 - centerDist) * 0.08

      points.push({
        x: nx,
        y: ny,
        z: clamp(nz, -0.25, 0.7),
        edge: clamp(edge * 1.22, 0.22, 1)
      })
    }
  }

  const random = seededRandom(sourceLabel)
  return normalizePoints(points, TARGET_POINTS, random)
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.referrerPolicy = "no-referrer"
    image.decoding = "async"

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Image load failed"))
    image.src = url
  })
}

export function HologramFace({ photoUrls, className = "" }: HologramFaceProps) {
  const { theme } = useThemeMode()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [ready, setReady] = useState(false)

  const photos = useMemo(() => sanitizePhotoUrls(photoUrls), [photoUrls])
  const palette = useMemo(() => HOLOGRAM_PALETTES[theme], [theme])

  useEffect(() => {
    let cancelled = false
    let rafId = 0

    const run = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const sources = photos.length ? photos : ["fallback://face"]
      const pointSets: MaskPoint[][] = []

      for (const source of sources) {
        try {
          const image = await loadImage(source)
          if (cancelled) return
          pointSets.push(extractMaskFromImage(image, source))
        } catch {
          pointSets.push(fallbackMask(source))
        }
      }

      if (!pointSets.length) {
        pointSets.push(fallbackMask("fallback"))
      }

      const context = canvas.getContext("2d")
      if (!context) return

      const resize = () => {
        const ratio = window.devicePixelRatio || 1
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        canvas.width = Math.max(1, Math.floor(width * ratio))
        canvas.height = Math.max(1, Math.floor(height * ratio))
        context.setTransform(ratio, 0, 0, ratio, 0, 0)
      }

      resize()
      setReady(true)

      const cycleMs = 6000
      const morphMs = 1900
      const holdMs = cycleMs - morphMs
      const perspective = 2.05

      const drawHexagon = (x: number, y: number, radius: number) => {
        context.beginPath()
        for (let i = 0; i < 6; i += 1) {
          const a = (Math.PI / 3) * i + Math.PI / 6
          const px = x + Math.cos(a) * radius
          const py = y + Math.sin(a) * radius
          if (i === 0) context.moveTo(px, py)
          else context.lineTo(px, py)
        }
        context.closePath()
      }

      const draw = (time: number) => {
        if (cancelled) return

        const width = canvas.clientWidth
        const height = canvas.clientHeight
        const centerX = width / 2
        const centerY = height / 2
        const baseScale = Math.min(width, height) * 0.5

        context.clearRect(0, 0, width, height)
        const bg = context.createLinearGradient(0, 0, width, height)
        bg.addColorStop(0, palette.bgTop)
        bg.addColorStop(1, palette.bgBottom)
        context.fillStyle = bg
        context.fillRect(0, 0, width, height)

        const cycleIndex = Math.floor(time / cycleMs)
        const phase = time % cycleMs
        const currentIndex = cycleIndex % pointSets.length
        const nextIndex = (currentIndex + 1) % pointSets.length

        const progress = phase <= holdMs ? 0 : easeInOut((phase - holdMs) / morphMs)
        const current = pointSets[currentIndex]
        const next = pointSets[nextIndex]

        const rotationY = Math.sin(time * 0.00034) * 0.48
        const rotationX = Math.cos(time * 0.0002) * 0.08

        const projected: ProjectedPoint[] = []

        for (let i = 0; i < TARGET_POINTS; i += 1) {
          const a = current[i]
          const b = next[i]
          const wave = Math.sin(time * 0.002 + a.x * 10.5 + a.y * 8.2) * 0.042

          const px = a.x + (b.x - a.x) * progress + wave * 0.25
          const py = a.y + (b.y - a.y) * progress + Math.cos(time * 0.0016 + i * 0.09) * 0.01
          const pz = a.z + (b.z - a.z) * progress + wave * 0.65
          const pe = a.edge + (b.edge - a.edge) * progress

          const sinY = Math.sin(rotationY)
          const cosY = Math.cos(rotationY)
          const sinX = Math.sin(rotationX)
          const cosX = Math.cos(rotationX)

          const xr = px * cosY - pz * sinY
          const zr = px * sinY + pz * cosY
          const yr = py * cosX - zr * sinX
          const zf = py * sinX + zr * cosX

          const depth = perspective / (perspective + zf + 1)
          const sx = centerX + xr * baseScale * depth
          const sy = centerY + yr * baseScale * depth

          projected.push({
            x: sx,
            y: sy,
            depth,
            alpha: clamp(pe * (0.34 + depth * 0.68), 0.15, 1)
          })
        }

        context.lineWidth = 1
        for (let i = 0; i < projected.length - 2; i += 10) {
          const p1 = projected[i]
          const p2 = projected[i + 1]
          const p3 = projected[i + 2]

          const d12 = Math.hypot(p1.x - p2.x, p1.y - p2.y)
          const d23 = Math.hypot(p2.x - p3.x, p2.y - p3.y)
          if (d12 > 30 || d23 > 30) continue

          const alpha = (p1.alpha + p2.alpha + p3.alpha) / 3
          context.strokeStyle = `rgba(${palette.triangle}, ${0.2 * alpha})`

          context.beginPath()
          context.moveTo(p1.x, p1.y)
          context.lineTo(p2.x, p2.y)
          context.lineTo(p3.x, p3.y)
          context.closePath()
          context.stroke()
        }

        for (let i = 0; i < projected.length - 4; i += 4) {
          const p = projected[i]
          const q = projected[i + 4]
          const dist = Math.hypot(p.x - q.x, p.y - q.y)
          if (dist > 26) continue

          context.strokeStyle = `rgba(${palette.mesh}, ${0.16 * ((p.alpha + q.alpha) / 2)})`
          context.beginPath()
          context.moveTo(p.x, p.y)
          context.lineTo(q.x, q.y)
          context.stroke()
        }

        for (let i = 0; i < projected.length; i += 1) {
          const point = projected[i]
          const radius = 0.9 + point.depth * 1.4
          context.fillStyle = `rgba(${palette.point}, ${0.17 + point.alpha * 0.62})`
          context.beginPath()
          context.arc(point.x, point.y, radius, 0, Math.PI * 2)
          context.fill()

          if (i % 38 === 0) {
            const square = 3 + point.depth * 2.2
            const rot = time * 0.0007 + i * 0.03
            context.save()
            context.translate(point.x, point.y)
            context.rotate(rot)
            context.strokeStyle = `rgba(${palette.square}, ${0.25 * point.alpha})`
            context.strokeRect(-square, -square, square * 2, square * 2)
            context.restore()
          }

          if (i % 54 === 0) {
            context.strokeStyle = `rgba(${palette.hex}, ${0.24 * point.alpha})`
            drawHexagon(point.x, point.y, 2.4 + point.depth * 1.9)
            context.stroke()
          }
        }

        const chinBand = projected
          .slice()
          .sort((a, b) => b.y - a.y)
          .slice(0, 22)

        if (chinBand.length) {
          const chinX = chinBand.reduce((sum, p) => sum + p.x, 0) / chinBand.length
          const chinY = chinBand.reduce((sum, p) => sum + p.y, 0) / chinBand.length
          const beamTop = chinY + 4
          const beamBottom = Math.min(height - 14, chinY + height * 0.42)
          const beamHalfTop = Math.min(width * 0.1, 58)
          const beamHalfBottom = Math.min(width * 0.23, 150)

          const beamGradient = context.createLinearGradient(chinX, beamTop, chinX, beamBottom)
          beamGradient.addColorStop(0, palette.beamCore)
          beamGradient.addColorStop(0.55, palette.beamEdge)
          beamGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

          context.fillStyle = beamGradient
          context.beginPath()
          context.moveTo(chinX - beamHalfTop, beamTop)
          context.lineTo(chinX + beamHalfTop, beamTop)
          context.lineTo(chinX + beamHalfBottom, beamBottom)
          context.lineTo(chinX - beamHalfBottom, beamBottom)
          context.closePath()
          context.fill()

          context.strokeStyle = palette.beamGlow
          context.lineWidth = 1
          context.beginPath()
          context.moveTo(chinX - beamHalfTop, beamTop)
          context.lineTo(chinX - beamHalfBottom, beamBottom)
          context.moveTo(chinX + beamHalfTop, beamTop)
          context.lineTo(chinX + beamHalfBottom, beamBottom)
          context.stroke()
        }

        for (let band = 0; band < 4; band += 1) {
          const yBase = (band + 1) * (height / 5)
          context.beginPath()
          for (let x = 0; x <= width; x += 7) {
            const waveY = yBase + Math.sin(x * 0.04 + time * 0.003 + band * 1.2) * 5
            if (x === 0) context.moveTo(x, waveY)
            else context.lineTo(x, waveY)
          }
          context.strokeStyle = `rgba(${palette.wave}, ${0.09 + band * 0.02})`
          context.stroke()
        }

        const scanY = (time * 0.075) % height
        const scanGradient = context.createLinearGradient(0, scanY - 20, 0, scanY + 20)
        scanGradient.addColorStop(0, `rgba(${palette.scan}, 0)`)
        scanGradient.addColorStop(0.5, `rgba(${palette.scan}, 0.17)`)
        scanGradient.addColorStop(1, `rgba(${palette.scan}, 0)`)
        context.fillStyle = scanGradient
        context.fillRect(0, scanY - 20, width, 40)

        context.strokeStyle = `rgba(${palette.frame}, 0.26)`
        context.lineWidth = 1
        context.strokeRect(8, 8, width - 16, height - 16)

        rafId = window.requestAnimationFrame(draw)
      }

      rafId = window.requestAnimationFrame(draw)
      window.addEventListener("resize", resize)

      return () => {
        window.removeEventListener("resize", resize)
      }
    }

    let dispose: (() => void) | undefined
    void run().then((cleanup) => {
      dispose = cleanup
    })

    return () => {
      cancelled = true
      if (rafId) window.cancelAnimationFrame(rafId)
      dispose?.()
    }
  }, [photos, palette])

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line bg-bg/45 shadow-card ${className}`}>
      <canvas ref={canvasRef} className="h-[420px] w-full sm:h-[520px] lg:h-[620px]" aria-label="3D geometric face mask" />
      {!ready ? (
        <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.12em] text-muted">
          Building mask...
        </div>
      ) : null}
    </div>
  )
}
