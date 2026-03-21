import { useEffect, useRef, useState } from "react"
import createGlobe, { COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"
import { useTheme } from "@/components/ThemeProvider" // ✅ Import your theme hook
import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

export function Globe({
  className,
  config,
}: {
  className?: string
  config?: COBEOptions
}) {
  const { theme } = useTheme()
  const [isDark, setIsDark] = useState(true)

  // Safely resolve "system" theme to actual dark/light boolean
  useEffect(() => {
    if (theme === "system") {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    } else {
      setIsDark(theme === "dark")
    }
  }, [theme])

  // Dynamically generate the config based on the current theme
  const mergedConfig: COBEOptions = {
    width: 800,
    height: 800,
    onRender: () => {},
    devicePixelRatio: 1, 
    phi: 0,
    theta: 0.3,
    mapSamples: 8000, 
    mapBrightness: 1.5, 
    markers: [
      { location: [14.5995, 120.9842], size: 0.03 },
      { location: [19.076, 72.8777], size: 0.1 },
      { location: [23.8103, 90.4125], size: 0.05 },
      { location: [30.0444, 31.2357], size: 0.07 },
      { location: [39.9042, 116.4074], size: 0.08 },
      { location: [-23.5505, -46.6333], size: 0.1 },
      { location: [19.4326, -99.1332], size: 0.1 },
      { location: [40.7128, -74.006], size: 0.1 },
      { location: [34.6937, 135.5022], size: 0.05 },
      { location: [41.0082, 28.9784], size: 0.06 },
    ],
    ...config,
    
    // 👇 THEME-DEPENDENT COLORS 👇
    dark: isDark ? 1 : 0, // 1 = Black globe, 0 = White globe
    diffuse: isDark ? 1.2 : 2.5, 
    baseColor: isDark ? [1, 0.84, 0] : [0.7, 0.7, 0.7], // Gold vs Silver dots
    markerColor: isDark ? [1, 0.84, 0] : [0.98, 0.75, 0.14], // Gold vs Amber-500 markers
    glowColor: isDark ? [0.6, 0.45, 0.1] : [0.9, 0.8, 0.5], // Deep warm glow vs Soft amber glow
  }

  let phi = 0
  let currentWidth = 0
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  // Effect to re-render the entire globe when `isDark` changes
  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        currentWidth = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      ...mergedConfig,
      width: currentWidth, 
      height: currentWidth, 
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.005
        state.phi = phi + rs.get()
        
        if (state.width !== currentWidth) {
          state.width = currentWidth
          state.height = currentWidth
        }
      },
    })

    setTimeout(() => (canvasRef.current!.style.opacity = "0.9"), 0)
    
    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, isDark]) // ✅ Added isDark as a dependency

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]", 
        className
      )}
    >
      {/* Dark Mode Halo */}
      <div className="absolute inset-4 rounded-full bg-[#fbbf24]/5 blur-[60px] shadow-[0_0_80px_20px_rgba(251,191,36,0.15)] pointer-events-none dark:block hidden" />
      
      {/* Light Mode Halo */}
      <div className="absolute inset-4 rounded-full bg-[#fbbf24]/20 blur-[60px] shadow-[0_0_80px_20px_rgba(251,191,36,0.3)] pointer-events-none dark:hidden block" />

      <canvas
        className={cn(
          "relative size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}