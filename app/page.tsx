'use client'

import { motion, useInView, useMotionValue, useSpring, animate, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Mail, ChevronDown, Download, X, ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import PAPER_CONTENT_RAW from './paperContent.json'
const PAPER_CONTENT = PAPER_CONTENT_RAW as Record<string, string[]>

// ─── Typewriter ───────────────────────────────────────────────────────────────
function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(t)
  }, [delay])
  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) return
    const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 38)
    return () => clearTimeout(t)
  }, [started, displayed, text])
  return <span>{displayed}<span className="animate-pulse">|</span></span>
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface LightboxProps {
  images: { src: string; alt: string }[]
  index: number
  onClose: () => void
}
function Lightbox({ images, index: initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length])
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, prev, next])
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"><X className="h-7 w-7" /></button>
      {images.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); prev() }} className="absolute left-4 text-white/60 hover:text-white transition-colors"><ChevronLeft className="h-9 w-9" /></button>
          <button onClick={e => { e.stopPropagation(); next() }} className="absolute right-4 text-white/60 hover:text-white transition-colors"><ChevronRight className="h-9 w-9" /></button>
        </>
      )}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="max-w-5xl max-h-[85vh] mx-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <img src={images[index].src} alt={images[index].alt} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
        <p className="text-center text-white/40 text-sm mt-3">{images[index].alt}</p>
      </motion.div>
    </motion.div>
  )
}

// ─── Paper reader modal ──────────────────────────────────────────────────────
interface PaperReaderProps {
  title: string
  type: string
  paragraphs: string[]
  file: string
  onClose: () => void
}
function PaperReader({ title, type, paragraphs, file, onClose }: PaperReaderProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 md:p-8 border-b border-black/[0.07] shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] font-medium block mb-1">{type}</span>
            <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground leading-snug">{title}</h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a href={file} download className="inline-flex items-center gap-1.5 text-xs text-muted border border-black/[0.1] rounded-full px-4 py-2 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
              <Download className="h-3.5 w-3.5" /> Download
            </a>
            <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="overflow-y-auto p-6 md:p-8 md:px-12">
          <div className="prose prose-sm max-w-none space-y-4">
            {paragraphs.map((para, i) => (
              <p key={i} className={`leading-relaxed text-foreground/75 ${i === 0 ? 'font-heading text-lg font-medium text-foreground' : 'text-[15px]'}`}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Tilt card ────────────────────────────────────────────────────────────────
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isTouch, setIsTouch] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 30 })
  useEffect(() => { setIsTouch(window.matchMedia('(hover: none)').matches) }, [])
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return
    const rect = ref.current!.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onMouseLeave = () => { x.set(0); y.set(0) }
  return (
    <motion.div ref={ref} style={isTouch ? {} : { rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Animated counter ────────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const count = useMotionValue(0)
  const spring = useSpring(count, { duration: 1800, bounce: 0 })

  useEffect(() => {
    if (inView) animate(count, value, { duration: 0.9, ease: 'easeOut' })
  }, [inView, value, count])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix
    })
  }, [spring, decimals, suffix])

  return <span ref={ref}>0{suffix}</span>
}

// ─── Scroll progress bar ─────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-[#C9A84C] z-[100]"
    />
  )
}

// ─── Cursor spotlight ────────────────────────────────────────────────────────
function CursorSpotlight() {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const [isTouch, setIsTouch] = useState(false)
  // Must call useTransform before any conditional return (Rules of Hooks)
  const bg = useTransform(
    [x, y],
    ([cx, cy]) =>
      `radial-gradient(400px circle at ${cx}px ${cy}px, rgba(201,168,76,0.07), transparent 70%)`
  )

  useEffect(() => { setIsTouch(window.matchMedia('(hover: none)').matches) }, [])

  useEffect(() => {
    if (isTouch) return
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y, isTouch])

  if (isTouch) return null

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      style={{ background: bg }}
    />
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

// ─── Fade-in wrapper ────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Section label ───────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="h-px w-6 bg-[#C9A84C]" />
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#C9A84C]">
        {children}
      </p>
    </div>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent my-24 md:my-32" />
  )
}

// ─── Experience card ─────────────────────────────────────────────────────────
interface ExperienceCardProps {
  label: string
  org: string
  role: string
  date: string
  bullets: string[]
  logo?: React.ReactNode
  photo?: string
  photoAlt?: string
  photoPosition?: string
}

function ExperienceCard({ label, org, role, date, bullets, logo, photo, photoAlt, photoPosition = 'object-center' }: ExperienceCardProps) {
  return (
    <div className="card-shimmer group rounded-2xl border border-black/[0.07] bg-surface shadow-sm hover:shadow-md hover:border-[#C9A84C]/30 transition-all duration-300 overflow-hidden">
      <div className="p-7 md:p-9">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          {logo && <div className="shrink-0 mt-1">{logo}</div>}
          {photo && (
            <div className="shrink-0 mt-1 w-20 h-20 rounded-xl overflow-hidden border border-black/[0.08]">
              <Image src={photo} alt={photoAlt ?? ''} width={80} height={80} className={`w-full h-full object-cover ${photoPosition}`} />
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] uppercase tracking-[0.24em] text-navy/50">{label}</span>
              <span className="h-px w-8 bg-navy/20" />
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-medium text-foreground">
              {org}
            </h3>
            <p className="text-muted mt-1 text-sm">{role}</p>
          </div>
        </div>
        <span className="text-sm text-muted/70 shrink-0">{date}</span>
      </div>
      <ul className="space-y-3 text-foreground/70 text-sm leading-relaxed">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-navy/40 mt-0.5 shrink-0">·</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      </div>
    </div>
  )
}

const GALLERY_IMAGES = [
  { src: '/photos/photo-convocation.jpg', alt: 'Skyler addressing students at UNCW convocation' },
  { src: '/photos/photo-board.jpg', alt: 'Skyler speaking at UNCW Board of Trustees' },
  { src: '/photos/photo-lacrosse.jpg', alt: 'Skyler playing lacrosse for the UNCW Seahawks' },
  { src: '/photos/photo-capitol.jpg', alt: 'Skyler at the US Capitol' },
  { src: '/photos/photo-pnc.jpg', alt: 'Skyler at UNC System Boards of Trustees at PNC Arena' },
]

export default function Page() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [lightbox, setLightbox] = useState<{ images: { src: string; alt: string }[]; index: number } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [paperReader, setPaperReader] = useState<{ title: string; type: string; key: string; file: string } | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = ['experience', 'about', 'portfolio', 'education', 'contact']
    const onScroll = () => {
      const scrollY = window.scrollY + 120
      let current = ''
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollY) current = id
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden">
      <ScrollProgress />
      <CursorSpotlight />
      <AnimatePresence>
        {lightbox && <Lightbox images={lightbox.images} index={lightbox.index} onClose={() => setLightbox(null)} />}
        {paperReader && (
          <PaperReader
            title={paperReader.title}
            type={paperReader.type}
            paragraphs={PAPER_CONTENT[paperReader.key] ?? []}
            file={paperReader.file}
            onClose={() => setPaperReader(null)}
          />
        )}
      </AnimatePresence>

      {/* ── NAV ───────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-md border-b border-black/[0.07]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <a href="#" className={`font-heading text-lg font-medium tracking-wide transition-colors duration-300 ${scrolled ? 'text-foreground' : 'text-white'}`}>
            Skyler Stein
          </a>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Experience', 'About', 'Portfolio', 'Education', 'Contact'].map((item) => {
              const isActive = activeSection === item.toLowerCase()
              return (
                <a key={item} href={`#${item.toLowerCase()}`}
                  className={`text-sm transition-colors duration-200 relative ${isActive ? 'text-[#C9A84C]' : scrolled ? 'text-muted hover:text-foreground' : 'text-white/70 hover:text-white'}`}
                >
                  {item}
                  {isActive && <motion.span layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-px bg-[#C9A84C]" />}
                </a>
              )
            })}
          </div>
          {/* Desktop LinkedIn */}
          <a href="https://www.linkedin.com/in/skylerstein" target="_blank" rel="noreferrer"
            className={`hidden md:flex items-center gap-1.5 text-sm transition-colors ${scrolled ? 'text-navy hover:text-navy/70' : 'text-white/80 hover:text-white'}`}
          >
            <LinkedinIcon className="h-3.5 w-3.5" />
            LinkedIn
          </a>
          {/* Mobile hamburger */}
          <button onClick={() => setMobileMenuOpen(v => !v)} className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-foreground' : 'text-white'}`}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-[#0D1B2E]/95 backdrop-blur-md border-t border-white/10"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {['Experience', 'About', 'Portfolio', 'Education', 'Contact'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm py-3 border-b border-white/[0.07] transition-colors ${activeSection === item.toLowerCase() ? 'text-[#C9A84C]' : 'text-white/70'}`}
                  >
                    {item}
                  </a>
                ))}
                <a href="https://www.linkedin.com/in/skylerstein" target="_blank" rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm py-3 text-white/70 mt-1"
                >
                  <LinkedinIcon className="h-4 w-4" /> LinkedIn
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0D1B2E]">
        {/* Ken Burns walking photo background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="ken-burns absolute inset-[-8%]">
            <Image
              src="/photos/photo-walking.jpg"
              alt=""
              fill
              className="object-cover"
              style={{ objectPosition: '72% 28%' }}
              priority
            />
          </div>
          {/* Dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-[#0D1B2E]/70" />
          {/* Subtle navy gradient from left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2E]/80 via-[#0D1B2E]/40 to-transparent" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
        {/* Bottom fade to page background */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-b from-transparent to-[#F5F6F8] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-32 pb-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] md:tracking-[0.26em] text-white/60">
                <span className="hidden sm:inline"><Typewriter text="Searching for Public Service & Policy Opportunities" delay={0.8} /></span>
                <span className="sm:hidden">Public Service & Policy</span>
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-6xl md:text-7xl lg:text-8xl font-light leading-[0.92] tracking-[-0.02em] text-white mb-8"
            >
              Skyler A.<br />
              <span className="italic gold-shimmer">Stein</span>
            </motion.h1>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-lg text-white/55 leading-relaxed max-w-lg mb-8"
            >
              From the classroom to the Capitol — a young leader looking to build a career in public service.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3"
            >
              <a
                href="https://www.linkedin.com/in/skylerstein"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] text-[#0D1B2E] px-6 py-2.5 text-sm font-semibold hover:bg-[#d4b35f] transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
                Connect on LinkedIn
              </a>
              <a
                href="mailto:skylerstein22@gmail.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] text-white/80 px-6 py-2.5 text-sm font-medium hover:border-white/40 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                skylerstein22@gmail.com
              </a>
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] text-white/80 px-6 py-2.5 text-sm font-medium hover:border-white/40 hover:text-white transition-colors"
              >
                <Download className="h-4 w-4" />
                Resume
              </a>
            </motion.div>
          </div>

          {/* Right — headshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 80, rotate: -12, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-navy/20 via-navy/5 to-transparent blur-sm" />
              <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border border-navy/[0.12]">
                <Image
                  src="/headshot.jpg"
                  alt="Skyler Stein"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>

          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* ── EXPERIENCE ──────────────────────────────────────────────────── */}
        <section id="experience" className="py-8">
          <FadeIn>
            <SectionLabel>Work Experience</SectionLabel>
            <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-16">
              Where I&apos;ve worked.
            </h2>
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={0.1}>
              <TiltCard>
                <ExperienceCard
                  label="Current"
                  org="Nexus Strategies"
                  role="Political Research Assistant"
                  date="June 2026 – Present"
                  logo={
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-black/[0.08] overflow-hidden">
                      <img src="/logos/nexus.png" alt="Nexus Strategies" className="w-full h-full object-cover" />
                    </div>
                  }
                  bullets={[
                    'Conduct in-depth research and analysis on state and local races across North Carolina, tracking political trends, candidate positioning, and electoral developments',
                    'Monitor legislative, regulatory, and political developments related to energy policy, providing timely analysis and strategic insights for internal stakeholders',
                    'Produce research memoranda, candidate profiles, district analyses, and briefing materials to support client engagement and strategic decision-making',
                    'Analyze voting patterns, demographic trends, fundraising activity, and public policy developments to identify opportunities and risks across key North Carolina races',
                  ]}
                />
              </TiltCard>
            </FadeIn>

            <FadeIn delay={0.13}>
              <TiltCard>
                <ExperienceCard
                  label="Campaign"
                  org="NC Coordinated Campaign"
                  role="Campus Organizing Fellow"
                  date="April 2026 – May 2026"
                  logo={
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-black/[0.08] overflow-hidden p-0.5">
                      <img src="/logos/nc-campaign.svg" alt="NC Coordinated Campaign" className="w-full h-full object-contain" />
                    </div>
                  }
                  bullets={[
                    'Built relationships with student voters, campus organizations, and university stakeholders for a statewide coordinated campaign',
                    'Supported voter outreach through direct voter contact, event staffing, and voter education on a campus of over 19,000 students',
                    'Connected campus-based organizing to broader electoral and youth engagement strategy',
                  ]}
                />
              </TiltCard>
            </FadeIn>

            <FadeIn delay={0.16}>
              <TiltCard>
                <ExperienceCard
                  label="Federal"
                  org="US House of Representatives"
                  role="Legislative Intern"
                  date="Summer 2025"
                  logo={
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-black/[0.08] overflow-hidden p-0.5">
                      <img src="/logos/house.svg" alt="US House of Representatives" className="w-full h-full object-contain" />
                    </div>
                  }
                  bullets={[
                    'Researched legislation and policy issues, preparing memos and briefs to inform congressional staff decision-making',
                    'Drafted and edited constituent correspondence on federal issues',
                    'Attended committee hearings, briefings, and floor proceedings, summarizing key takeaways',
                    'Conducted Capitol tours and aided visiting constituents',
                  ]}
                />
              </TiltCard>
            </FadeIn>

            <FadeIn delay={0.19}>
              <TiltCard>
              <div className="card-shimmer group rounded-2xl border border-black/[0.07] bg-surface p-7 md:p-9 hover:border-[#C9A84C]/30 hover:shadow-md shadow-sm transition-all duration-300">
                <div className="flex items-start gap-4 mb-8">
                  <div className="shrink-0 mt-1 flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-black/[0.08] overflow-hidden p-1">
                    <img src="/logos/uncw.svg" alt="UNCW" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-navy/50">Leadership</span>
                      <span className="h-px w-8 bg-navy/20" />
                    </div>
                    <h3 className="font-heading text-2xl md:text-3xl font-medium text-foreground">
                      UNCW Student Government
                    </h3>
                  </div>
                </div>

                {/* Student Body President */}
                <div className="mb-7">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
                    <p className="text-muted text-sm font-medium">Student Body President (Reelected)</p>
                    <span className="text-sm text-muted/70 shrink-0">April 2024 – April 2026</span>
                  </div>
                  <ul className="space-y-3 text-foreground/70 text-sm leading-relaxed">
                    {[
                      'Twice elected by the student body as Student Body President at UNCW, representing over 19,000 students',
                      'Chair of the Association of Student Governments (ASG) Council of Student Body Presidents, reelected to this position as well',
                      'Ex-Officio Voting Member of the UNCW Board of Trustees, providing the student perspective on institutional decisions',
                      'Serves on the UNCW Alumni Association Board of Directors, connecting current students with the broader UNCW community',
                      'Advocated across Student Success, Institutional Effectiveness, Academic Affairs, and Sustainability',
                    ].map((bullet, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-navy/40 mt-0.5 shrink-0">·</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="h-px w-full bg-black/[0.06] mb-7" />

                {/* Student Body Vice President */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
                    <p className="text-muted text-sm font-medium">Student Body Vice President</p>
                    <span className="text-sm text-muted/70 shrink-0">April 2023 – April 2024</span>
                  </div>
                  <ul className="space-y-3 text-foreground/70 text-sm leading-relaxed">
                    {[
                      'Elected Student Body Vice President and President of the Senate',
                      'Led a team of over 50 student leaders managing the Student Senate and Senatorial Board',
                      'Served as Tri-Chair of the Campus Initiated Tuition and Fee Advisory Committee (CITI)',
                      'Collaborated with the Student Body President on campus-wide initiatives including the Seahawk Swap Shop',
                    ].map((bullet, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-navy/40 mt-0.5 shrink-0">·</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              </TiltCard>
            </FadeIn>

            {/* Endless Sports */}
            <FadeIn delay={0.22}>
              <TiltCard>
              <ExperienceCard
                label="Nonprofit · Volunteer"
                org="Endless Sports"
                role="Board Member"
                date="Dec 2021 – Present"
                logo={
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-black/[0.08] overflow-hidden p-0.5">
                    <img src="/logos/endless-sports.png" alt="Endless Sports" className="w-full h-full object-contain" />
                  </div>
                }
                bullets={[
                  'Serve on the board of a nonprofit dedicated to providing athletic programs and recreational opportunities for individuals with special needs',
                  'Handle email correspondence on behalf of the organization, coordinating with volunteers, partners, and community members',
                  'Assist with social media content to promote events, share participant stories, and grow the organization\'s community presence',
                  'Support weekly events and athletic programs, helping ensure participants have a positive and inclusive experience',
                ]}
              />
              </TiltCard>
            </FadeIn>
          </div>
        </section>

        <Divider />

        {/* ── ABOUT ───────────────────────────────────────────────────────── */}
        <section id="about" className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <SectionLabel>About</SectionLabel>
              <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-8">
                A young leader looking to begin a career in public service.
              </h2>
              {/* Photo grid — click any photo to open lightbox */}
              <div className="grid grid-cols-3 gap-2.5 mt-6">
                {/* Convocation — tall left panel */}
                <button onClick={() => setLightbox({ images: GALLERY_IMAGES, index: 0 })} className="col-span-2 row-span-2 rounded-xl overflow-hidden aspect-[4/3] group relative focus:outline-none">
                  <Image src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">View</span>
                  </div>
                </button>
                {/* Board — top right */}
                <button onClick={() => setLightbox({ images: GALLERY_IMAGES, index: 1 })} className="rounded-xl overflow-hidden aspect-square group relative focus:outline-none">
                  <Image src={GALLERY_IMAGES[1].src} alt={GALLERY_IMAGES[1].alt} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </button>
                {/* Lacrosse — mid right */}
                <button onClick={() => setLightbox({ images: GALLERY_IMAGES, index: 2 })} className="rounded-xl overflow-hidden aspect-square group relative focus:outline-none">
                  <Image src={GALLERY_IMAGES[2].src} alt={GALLERY_IMAGES[2].alt} fill className="object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </button>
                {/* Capitol — bottom left */}
                <button onClick={() => setLightbox({ images: GALLERY_IMAGES, index: 3 })} className="rounded-xl overflow-hidden aspect-[3/2] group relative focus:outline-none">
                  <Image src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} fill className="object-cover object-[50%_65%] group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </button>
                {/* PNC — bottom right */}
                <button onClick={() => setLightbox({ images: GALLERY_IMAGES, index: 4 })} className="col-span-2 rounded-xl overflow-hidden aspect-[3/2] group relative focus:outline-none">
                  <Image src={GALLERY_IMAGES[4].src} alt={GALLERY_IMAGES[4].alt} fill className="object-cover object-[50%_30%] group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </button>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="space-y-5 text-foreground/70 leading-relaxed pt-8 lg:pt-16">
                <p>
                  Skyler grew up in Apex, NC, a small town outside of Raleigh. He was drawn to politics and public service from an early age, and chose to study Political Science at UNC Wilmington with a Pre-Law minor, graduating Cum Laude in May 2026.
                </p>
                <p>
                  At UNCW, Skyler got involved quickly. He was elected Student Body Vice President his freshman year, then Student Body President, and was reelected to that role the following year. It was not something he expected when he arrived on campus, and he tried not to take it for granted. Over four years he represented over 19,000 students, served as a voting member on the Board of Trustees, and chaired the statewide Association of Student Governments Council of Student Body Presidents. He learned a lot from the job and from the people around him.
                </p>
                <p>
                  Outside of student government, Skyler has served on the board of Endless Sports, a nonprofit that provides athletic programs and recreational opportunities for individuals with special needs. It has been one of the more meaningful things he has been a part of and something he hopes to stay involved in long term.
                </p>
                <p>
                  The summer of 2025 he interned in a congressional office in Washington, D.C., where he attended committee hearings, helped with constituent correspondence, and got a ground-level look at how federal policy moves. After returning to North Carolina he worked on a statewide Senate campaign before joining Nexus Strategies, where he does political research on races and policy developments across the state.
                </p>
                <p className="text-foreground font-medium">
                  Skyler is looking for opportunities in public service and policy, whether that is a government office, a policy organization, or a role that points toward law school somewhere down the road. He is based in North Carolina but open to Washington, D.C. If you think there might be a fit, he would be glad to connect.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        <Divider />

        {/* ── PORTFOLIO ───────────────────────────────────────────────────── */}
        <section id="portfolio" className="py-8">
          <FadeIn>
            <SectionLabel>Writing & Research</SectionLabel>
            <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-4">
              Selected work.
            </h2>
            <p className="text-muted text-sm mb-16 max-w-lg">
              Academic papers, policy memos, and research written during my time at UNCW and in professional settings. Click any card to download.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: 'Cobalt and Capitalism',
                description: 'Argues that the global green energy transition depends on exploitative cobalt extraction in the DRC, challenging the moral framing of the electric vehicle revolution.',
                type: 'Research Paper',
                contentKey: 'cobalt',
                file: '/portfolio/cobalt-and-capitalism.docx',
                accent: 'text-emerald-700',
                border: 'hover:border-emerald-300/50',
                leftBorder: 'border-l-emerald-400',
              },
              {
                title: 'Affordable Housing in America',
                description: 'A full policy analysis examining the U.S. affordable housing crisis, evaluating existing interventions, and proposing targeted solutions for urban accessibility.',
                type: 'Policy Analysis',
                contentKey: 'housing',
                file: '/portfolio/affordable-housing-policy.docx',
                accent: 'text-blue-700',
                border: 'hover:border-blue-300/50',
                leftBorder: 'border-l-blue-400',
              },
              {
                title: 'AI Regulation Policy Memo',
                description: 'A professional policy memo analyzing the federal AI regulatory landscape and recommending strategic positioning for enterprise stakeholders amid Congressional debate.',
                type: 'Policy Memo',
                contentKey: 'ai',
                file: '/portfolio/ai-regulation-memo.docx',
                accent: 'text-violet-700',
                border: 'hover:border-violet-300/50',
                leftBorder: 'border-l-violet-400',
              },
              {
                title: 'Party Affiliation Among College Students',
                description: 'Senior capstone research examining what explains political party affiliation among college students, with a focus on high school background as an explanatory variable.',
                type: 'Research Paper',
                contentKey: 'party',
                file: '/portfolio/party-affiliation-research.docx',
                accent: 'text-amber-700',
                border: 'hover:border-amber-300/50',
                leftBorder: 'border-l-amber-400',
              },
              {
                title: 'Nuclear Proliferation: Three Models',
                description: "A critical essay examining Scott Sagan's three-model framework for nuclear proliferation, evaluating the security, domestic politics, and norms models against case evidence.",
                type: 'Critical Essay',
                contentKey: 'nuclear',
                file: '/portfolio/nuclear-proliferation-essay.docx',
                accent: 'text-rose-700',
                border: 'hover:border-rose-300/50',
                leftBorder: 'border-l-rose-400',
              },
            ].map((item) => (
              <FadeIn key={item.title} delay={0.05}>
                <TiltCard>
                  <button
                    onClick={() => setPaperReader({ title: item.title, type: item.type, key: item.contentKey, file: item.file })}
                    className={`card-shimmer group flex flex-col h-full w-full text-left rounded-2xl border border-black/[0.07] bg-surface p-7 shadow-sm hover:shadow-md ${item.border} transition-all duration-300 border-l-4 ${item.leftBorder}`}
                  >
                    <span className={`text-[10px] uppercase tracking-[0.22em] font-medium mb-3 block ${item.accent}`}>{item.type}</span>
                    <h3 className="font-heading text-lg font-medium text-foreground mb-4 leading-snug">{item.title}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed flex-1">{item.description}</p>
                    <div className="flex items-center gap-1.5 mt-6 text-xs text-muted/50 group-hover:text-[#C9A84C] transition-colors">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      <span>Read paper</span>
                    </div>
                  </button>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── EDUCATION ───────────────────────────────────────────────────── */}
        <section id="education" className="py-8">
          <FadeIn>
            <SectionLabel>Education</SectionLabel>
            <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-16">
              Academic record.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border border-black/[0.07] bg-surface overflow-hidden h-full hover:shadow-sm transition-all duration-300">
                <div className="w-full aspect-[3/2] overflow-hidden">
                  <Image src="/photos/photo-grad.jpg" alt="Skyler graduating from UNCW May 2026" width={1400} height={933} className="w-full h-full object-cover object-center" />
                </div>
                <div className="p-7">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-heading text-2xl font-medium text-foreground">UNC Wilmington</h3>
                    <p className="text-muted mt-1 text-sm">BA Political Science · Minor: Pre-Law</p>
                    <p className="text-muted/60 text-sm">Cum Laude · Graduated May 2026</p>
                  </div>
                  <span className="font-heading text-3xl font-semibold text-navy">3.565</span>
                </div>
                <div className="space-y-2">
                  {[
                    "Dean's List — Fall 2022, Spring 2023, Fall 2024, Spring 2025, Spring 2026",
                    'Cum Laude',
                    'Relevant coursework: Constitutional Law I & II, Legal Philosophy & Jurisprudence, Judicial Politics, Public Policy Analysis, International Relations, Political Theory',
                  ].map((item) => (
                    <div key={item} className="flex gap-3 text-sm text-foreground/65">
                      <span className="text-navy/40 shrink-0">·</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex flex-col gap-5 h-full">
                {/* Skills */}
                <div className="rounded-2xl border border-black/[0.07] bg-surface p-7 hover:shadow-sm transition-all duration-300">
                  <h3 className="font-heading text-xl font-medium text-foreground mb-5">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Public Speaking',
                      'Legislative Research',
                      'Policy Analysis',
                      'Political Research',
                      'Strategic Leadership',
                      'Stakeholder Engagement',
                      'Constituent Relations',
                      'Community Organizing',
                      'Advocacy',
                      'Voter Outreach',
                      'Written Communication',
                      'Board Governance',
                      'Team Leadership',
                      'Election Analysis',
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-black/[0.08] bg-background px-3 py-1.5 text-xs text-foreground/70 hover:border-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D1B2E] hover:font-medium transition-all duration-200 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Areas of Interest */}
                <div className="rounded-2xl border border-black/[0.07] bg-surface p-7 hover:shadow-sm transition-all duration-300">
                  <h3 className="font-heading text-xl font-medium text-foreground mb-5">Areas of Interest</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'State & Local Government', icon: '🏛️' },
                      { label: 'Election Law & Policy', icon: '⚖️' },
                      { label: 'Energy Policy', icon: '⚡' },
                      { label: 'Constitutional Law', icon: '📜' },
                      { label: 'Campaign Strategy', icon: '🗳️' },
                      { label: 'Public Administration', icon: '🏢' },
                      { label: 'Public Higher Education', icon: '🎓' },
                    ].map(({ label, icon }) => (
                      <div key={label} className="flex items-center gap-2.5 text-sm text-foreground/65">
                        <span className="text-base">{icon}</span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <Divider />

        {/* ── CONTACT ─────────────────────────────────────────────────────── */}
        <section id="contact" className="py-8 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <FadeIn>
                <SectionLabel>Contact</SectionLabel>
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 max-w-2xl">
                  Let&apos;s connect.
                </h2>
                <p className="text-foreground/55 max-w-md mb-12 leading-relaxed">
                  Political Science graduate from UNCW, currently doing political research at Nexus Strategies. Searching for public service and policy opportunities in Washington, D.C. or Raleigh, N.C. Happy to connect.
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
                  <a
                    href="https://www.linkedin.com/in/skylerstein"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-2xl border border-navy/20 bg-navy/[0.05] px-8 py-5 text-foreground hover:border-navy/40 hover:bg-navy/[0.08] transition-all duration-200 group"
                  >
                    <LinkedinIcon className="h-5 w-5 text-navy" />
                    <div>
                      <p className="text-sm font-medium">LinkedIn</p>
                      <p className="text-xs text-muted">linkedin.com/in/skylerstein</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted ml-auto group-hover:text-navy transition-colors" />
                  </a>
                  <a
                    href="mailto:skylerstein22@gmail.com"
                    className="inline-flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-surface px-8 py-5 text-foreground hover:border-navy/20 hover:shadow-sm transition-all duration-200 group"
                  >
                    <Mail className="h-5 w-5 text-navy" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-xs text-muted">skylerstein22@gmail.com</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted ml-auto group-hover:text-navy transition-colors" />
                  </a>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.15}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative rounded-2xl overflow-hidden aspect-[3/2] max-w-sm mx-auto"
              >
                <Image
                  src="/photos/photo-trustees.jpg"
                  alt="Skyler speaking at UNCW Board of Trustees"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
              </motion.div>
            </FadeIn>
          </div>
        </section>

      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0D1B2E] py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-heading text-sm text-white/60">Skyler Stein</span>
          <span className="text-xs text-white/30">Political Science · UNCW Class of 2026</span>
          <a
            href="mailto:skylerstein22@gmail.com"
            className="text-xs text-white/25 hover:text-[#C9A84C] transition-colors"
          >
            skylerstein22@gmail.com
          </a>
        </div>
      </footer>
    </main>
  )
}
