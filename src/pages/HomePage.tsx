import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { NavBar } from '@/components/layout/NavBar'

/* ─── Particle canvas ─────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let W = 0, H = 0

    interface Dot { x: number; y: number; vx: number; vy: number; r: number; alpha: number }
    let dots: Dot[] = []

    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      dots = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.35 + 0.1,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0) d.x = W
        if (d.x > W) d.x = 0
        if (d.y < 0) d.y = H
        if (d.y > H) d.y = 0
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(22,163,74,${d.alpha})`
        ctx.fill()
      }
      // draw connecting lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.strokeStyle = `rgba(22,163,74,${0.08 * (1 - dist / 100)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    draw()
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

/* ─── Animated money counter ──────────────────────────────────── */
function AnimatedRupees() {
  const [value, setValue] = useState(0)
  const target = 50000

  useEffect(() => {
    let start: number | null = null
    const duration = 2200
    const ease = (t: number) => 1 - Math.pow(1 - t, 4)
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.round(ease(progress) * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const timer = setTimeout(() => requestAnimationFrame(step), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <span className="text-brand-500 inline-block tabular-nums">
      ₹{value.toLocaleString('en-IN')}
    </span>
  )
}

/* ─── Morphing orb background ─────────────────────────────────── */
function MorphOrb({ className }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
      animate={{
        scale: [1, 1.15, 0.95, 1.1, 1],
        borderRadius: ['50%', '42% 58% 60% 40%', '60% 40% 42% 58%', '50%'],
      }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/* ─── Typewriter for subheadline ──────────────────────────────── */
const PHRASES = [
  'daily commute adding up silently?',
  'food deliveries draining your wallet?',
  'electricity bill quietly climbing?',
  'impulse buys compounding yearly?',
]

function TypeWriter() {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const phrase = PHRASES[phraseIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && displayed.length < phrase.length) {
      timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 45)
    } else if (!deleting && displayed.length === phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length - 1)), 22)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setPhraseIdx((i) => (i + 1) % PHRASES.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, phraseIdx])

  return (
    <span className="text-gray-900 font-semibold">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-0.5 h-5 bg-brand-500 ml-0.5 align-middle"
        aria-hidden="true"
      />
    </span>
  )
}

/* ─── Stats ticker ────────────────────────────────────────────── */
const STATS = [
  { value: '₹4.2L', label: 'avg household waste / year' },
  { value: '38%', label: 'on avoidable food costs' },
  { value: '2 min', label: 'to get your full report' },
  { value: '0 data', label: 'ever leaves your device' },
]

function StatsTicker() {
  return (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -900] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {[...STATS, ...STATS, ...STATS].map((s, i) => (
          <div key={i} className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xl font-extrabold text-brand-600 tabular-nums">{s.value}</span>
            <span className="text-sm text-gray-400">{s.label}</span>
            <span className="text-gray-200 ml-2">·</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Journey steps ───────────────────────────────────────────── */
const JOURNEY = [
  { icon: '💸', step: '01', title: 'Money lost', desc: 'See the exact rupees leaking out of your daily habits.' },
  { icon: '☕', step: '02', title: 'What it could buy', desc: 'Coffees, vacations, gadgets — made real and tangible.' },
  { icon: '👨‍👩‍👧', step: '03', title: 'Family opportunities', desc: 'Education funds, medical buffers, dream trips.' },
  { icon: '📈', step: '04', title: 'Future wealth', desc: 'Watch small savings compound into crores over time.' },
  { icon: '🌿', step: '05', title: 'Planet impact', desc: 'CO₂ reduction as a happy side effect. Last — not first.' },
]

/* ─── Social proof ticker ─────────────────────────────────────── */
const PROOF = [
  { avatar: 'SK', name: 'Suresh K.', text: 'Found ₹8,400 in monthly waste I never knew existed.' },
  { avatar: 'PM', name: 'Priya M.', text: 'The family letter section hit different. Starting SIP this month.' },
  { avatar: 'AR', name: 'Arjun R.', text: 'Switched to metro on weekdays. Already saving ₹3,200/mo.' },
  { avatar: 'NJ', name: 'Neha J.', text: 'Projected ₹18L in 10 years from habits I can actually change.' },
]

/* ─── Floating badge ──────────────────────────────────────────── */
function FloatingBadge({ children, delay, x, y }: { children: React.ReactNode; delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute hidden lg:flex items-center gap-2 bg-white border border-gray-100 shadow-lg rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5 },
        y: { delay: delay + 0.5, duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Main component ──────────────────────────────────────────── */
interface Props { onStart: () => void; onExample: () => void }

export function HomePage({ onStart, onExample }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -40])
  const smoothY = useSpring(heroY, { stiffness: 80, damping: 20 })

  return (
    <div ref={containerRef} className="min-h-screen bg-white overflow-x-hidden">
      <NavBar page="home" />

      <main>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-10 pb-20">
        {/* Background orbs */}
        <MorphOrb className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand-400" />
        <MorphOrb className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-emerald-300" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(34,197,94,0.07),transparent)]" />

        {/* Particle layer */}
        <ParticleField />

        {/* Floating context badges */}
        <FloatingBadge delay={1.2} x="-2%" y="22%">
          <span className="text-xl">💸</span>
          <div>
            <p className="text-xs text-gray-400 leading-none mb-0.5">You lost today</p>
            <p className="font-bold text-gray-900">₹342</p>
          </div>
        </FloatingBadge>
        <FloatingBadge delay={1.5} x="82%" y="18%">
          <span className="text-xl">🌿</span>
          <div>
            <p className="text-xs text-gray-400 leading-none mb-0.5">CO₂ saved</p>
            <p className="font-bold text-brand-700">4.2 kg</p>
          </div>
        </FloatingBadge>
        <FloatingBadge delay={1.8} x="78%" y="68%">
          <span className="text-xl">📈</span>
          <div>
            <p className="text-xs text-gray-400 leading-none mb-0.5">10yr projection</p>
            <p className="font-bold text-gray-900">₹12.4L</p>
          </div>
        </FloatingBadge>
        <FloatingBadge delay={1.4} x="-3%" y="65%">
          <span className="text-xl">👨‍👩‍👧</span>
          <div>
            <p className="text-xs text-gray-400 leading-none mb-0.5">Education fund</p>
            <p className="font-bold text-gray-900">₹3.6L</p>
          </div>
        </FloatingBadge>

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity, y: smoothY }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-7"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block"
            />
            Lifestyle Intelligence Analysis
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-6"
          >
            What if your habits<br />
            cost you{' '}
            <AnimatedRupees />
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-500">
              every single year?
            </span>
          </motion.h1>

          {/* Typewriter sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-3 leading-relaxed"
          >
            Is your{' '}<TypeWriter />
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-gray-400 max-w-xl mx-auto mb-10"
          >
            Discover hidden expenses, future family opportunities, and environmental impact
            through a 2-minute lifestyle snapshot.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-7"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <button
                type="button"
                onClick={onStart}
                aria-label="Analyze my lifestyle and start the questionnaire"
                className="relative group inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base px-8 py-4 rounded-full transition-colors shadow-xl shadow-gray-900/20 overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-brand-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="relative">Analyze my lifestyle</span>
                <motion.span
                  className="relative"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </button>
            </motion.div>

            <motion.button
              type="button"
              onClick={onExample}
              aria-label="Load a sample report with example data"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 text-gray-600 font-medium text-base px-6 py-4 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              See example report
            </motion.button>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-6 text-xs text-gray-400 flex-wrap"
          >
            {['🔒 No sign-up', '⚡ 2 min analysis', '🛡️ 100% private', '🌐 Works offline'].map((t) => (
              <span key={t} className="flex items-center gap-1">{t}</span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <span className="text-xs text-gray-400">Scroll to explore</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent"
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </motion.div>
      </section>

      {/* ── STATS TICKER ─────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-4 overflow-hidden">
        <StatsTicker />
      </section>

      {/* ── JOURNEY FLOW ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">
            The psychological journey
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            We show you money first.<br />
            <span className="text-gray-400 font-normal">Planet last.</span>
          </h2>
          <p className="text-base text-gray-400 mt-3 max-w-lg mx-auto">
            Traditional carbon apps guilt you into change. We motivate you with what you actually care about.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-brand-200 via-brand-400 to-emerald-200 hidden sm:block" />

          <div className="space-y-4">
            {JOURNEY.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                className="relative flex items-start gap-5 bg-white border border-gray-100 rounded-2xl p-5 sm:ml-16 cursor-default group hover:border-brand-200 hover:shadow-md transition-all"
              >
                {/* Step bubble on the line */}
                <div className="hidden sm:flex absolute -left-[52px] top-5 w-8 h-8 rounded-full bg-white border-2 border-brand-400 items-center justify-center text-xs font-bold text-brand-600">
                  {item.step}
                </div>
                <div className="text-3xl flex-shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <p className="font-bold text-gray-900 text-base mb-0.5 group-hover:text-brand-700 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <motion.div
                  className="ml-auto text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity text-lg"
                >
                  →
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE GRID ─────────────────────────────────────── */}
      <section className="bg-gray-50 border-t border-gray-100 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">What you get</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              A complete financial mirror
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: '💸', title: 'Hidden loss finder', desc: 'Down-to-the-rupee breakdown of every avoidable cost category.' },
              { emoji: '📈', title: 'Wealth projection', desc: 'Compound interest charts from 1 to 20 years with realistic returns.' },
              { emoji: '👨‍👩‍👧', title: 'Family planner', desc: 'Education, healthcare, vacations — all funded by recovered waste.' },
              { emoji: '🌿', title: 'Planet bonus', desc: 'CO₂ and tree impact shown as a positive side effect, never a burden.' },
              { emoji: '🏆', title: 'Weekly challenges', desc: 'Personalized micro-habits that build toward your savings goal.' },
              { emoji: '✉️', title: 'Future family letter', desc: 'An emotionally resonant letter generated from your real numbers.' },
              { emoji: '🔒', title: '100% private', desc: 'Zero servers, zero accounts, zero data transmitted. Ever.' },
              { emoji: '⚡', title: '2-minute analysis', desc: '10 quick inputs. Instant personalized report. No waiting.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
                className="bg-white border border-gray-100 rounded-2xl p-5 cursor-default transition-shadow"
              >
                <div className="text-2xl mb-3">{f.emoji}</div>
                <p className="font-bold text-gray-900 text-sm mb-1">{f.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────── */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">People are discovering</p>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Real insights. Real change.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROOF.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 flex-shrink-0">
                {p.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{p.name}</p>
                <p className="text-sm text-gray-500 leading-relaxed">"{p.text}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" />
        <MorphOrb className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500 opacity-10" />
        <MorphOrb className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-400 opacity-10" />
        <ParticleField />

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-5"
          >
            Ready to find out?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5"
          >
            Your financial mirror
            <br />
            is 2 minutes away.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base text-gray-400 mb-10"
          >
            "Save money. Secure your family's future. Help the planet accidentally."
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <button
              type="button"
              onClick={onStart}
              aria-label="Analyze my lifestyle and start the questionnaire"
              className="relative group inline-flex items-center gap-3 bg-brand-500 hover:bg-brand-400 text-white font-bold text-lg px-10 py-5 rounded-full transition-colors shadow-2xl shadow-brand-900/40"
            >
              <span>Analyze my lifestyle</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-xs text-gray-600 mt-5"
          >
            No sign-up · No data sent · Works offline · Instant results
          </motion.p>
        </div>
      </section>
      </main>
    </div>
  )
}
