import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import './App.css'

/* ── SVG heart shape for the floating petals ── */
function HeartSVG({ color = '#ff3c6f', opacity = 0.5, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      opacity={opacity}
      style={{ display: 'block' }}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

/* ── Floating hearts that drift and sway organically ── */
function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const hue = 340 + Math.random() * 30 // rose-pink range
        const sat = 60 + Math.random() * 40
        const light = 50 + Math.random() * 25
        return {
          id: i,
          color: `hsl(${hue}, ${sat}%, ${light}%)`,
          left: 3 + Math.random() * 94,
          delay: Math.random() * 12,
          duration: 10 + Math.random() * 10,
          swayDuration: 3 + Math.random() * 4,
          size: 10 + Math.random() * 18,
          opacity: 0.12 + Math.random() * 0.25,
          drift: -30 + Math.random() * 60,
        }
      }),
    [],
  )

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="heart-wrapper"
          style={{
            left: `${h.left}%`,
            '--rise-duration': `${h.duration}s`,
            '--rise-delay': `${h.delay}s`,
            '--sway-duration': `${h.swayDuration}s`,
            '--drift': `${h.drift}px`,
          }}
        >
          <div className="heart-sway">
            <HeartSVG color={h.color} opacity={h.opacity} size={h.size} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Celebration shower of hearts ── */
function CelebrationShower() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => {
        const hue = 335 + Math.random() * 40
        const sat = 70 + Math.random() * 30
        const light = 55 + Math.random() * 25
        return {
          id: i,
          color: `hsl(${hue}, ${sat}%, ${light}%)`,
          left: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 2.5 + Math.random() * 3.5,
          size: 12 + Math.random() * 24,
          opacity: 0.3 + Math.random() * 0.5,
          rotate: Math.random() * 360,
          xDrift: -60 + Math.random() * 120,
        }
      }),
    [],
  )

  return (
    <div className="celebration-shower" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="shower-heart"
          style={{
            left: `${h.left}%`,
            '--fall-duration': `${h.duration}s`,
            '--fall-delay': `${h.delay}s`,
            '--rotate-start': `${h.rotate}deg`,
            '--x-drift': `${h.xDrift}px`,
          }}
        >
          <HeartSVG color={h.color} opacity={h.opacity} size={h.size} />
        </div>
      ))}
    </div>
  )
}

/* ── Ambient glow that follows mouse subtly ── */
function AmbientGlow() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      el.style.setProperty('--glow-x', `${x}%`)
      el.style.setProperty('--glow-y', `${y}%`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return <div ref={ref} className="ambient-glow" />
}

/* ── Main App ── */
function App() {
  const [answered, setAnswered] = useState(false)
  const [entering, setEntering] = useState(true)
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 })
  const [attempts, setAttempts] = useState(0)
  const noRef = useRef(null)

  const noTexts = [
    'No',
    'Are you sure?',
    'Really sure?',
    'Think again!',
    'Pretty please?',
    'Last chance...',
    "You're breaking my heart",
    'I might cry',
    "There's only one answer",
  ]

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 100)
    return () => clearTimeout(t)
  }, [])

  const dodgeNo = useCallback(() => {
    // Calculate bounds so button stays visible
    const vw = window.innerWidth
    const vh = window.innerHeight
    const maxX = Math.min(vw * 0.35, 200)
    const maxY = Math.min(vh * 0.35, 180)
    const x = (Math.random() - 0.5) * 2 * maxX
    const y = (Math.random() - 0.5) * 2 * maxY
    setNoOffset({ x, y })
    setAttempts((c) => (c + 1) % noTexts.length)
  }, [noTexts.length])

  const handleYes = useCallback(() => {
    setAnswered(true)
  }, [])

  // Yes button grows subtly with each failed No attempt
  const yesScale = 1 + attempts * 0.06

  if (answered) {
    return (
      <div className="scene celebration-scene">
        <AmbientGlow />
        <CelebrationShower />
        <div className="content celebration-content">
          <div className="celebration-heart">
            <HeartSVG color="var(--rose-hot)" opacity={1} size={72} />
          </div>
          <h1 className="celebration-title">
            <span className="reveal reveal-1">Yayyy!!</span>
          </h1>
          <p className="celebration-sub reveal reveal-2">
            I knew you&rsquo;d say yes, Marmoura
          </p>
          <div className="divider reveal reveal-3" />
          <p className="celebration-msg reveal reveal-4">
            Happy Valentine&rsquo;s Day, my love
          </p>
          <p className="celebration-sig reveal reveal-5">
            &mdash; yours forever, Nadeem
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`scene ask-scene ${entering ? 'entering' : 'entered'}`}>
      <AmbientGlow />
      <FloatingHearts />

      {/* Decorative rose-gold ring */}
      <div className="deco-ring" aria-hidden="true" />

      <div className="content ask-content">
        <div className="envelope-icon">
          <span>&#x1F48C;</span>
        </div>
        <h1 className="ask-title">
          Miral, will you be my <em>Valentine?</em>
        </h1>
        <div className="btn-area">
          <button
            className="btn-yes"
            onClick={handleYes}
            style={{ transform: `scale(${yesScale})` }}
          >
            Yes
          </button>
          <button
            ref={noRef}
            className="btn-no"
            style={{
              transform: `translate(${noOffset.x}px, ${noOffset.y}px)`,
            }}
            onMouseEnter={dodgeNo}
            onTouchStart={(e) => {
              e.preventDefault()
              dodgeNo()
            }}
          >
            {noTexts[attempts]}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
