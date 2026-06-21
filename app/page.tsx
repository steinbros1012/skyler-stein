'use client'

import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Mail, ChevronDown } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

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
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Section label ───────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.28em] text-navy/60 mb-4">
      {children}
    </p>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent my-24 md:my-32" />
  )
}

// ─── Experience card ─────────────────────────────────────────────────────────
interface ExperienceCardProps {
  label: string
  org: string
  role: string
  date: string
  bullets: string[]
}

function ExperienceCard({ label, org, role, date, bullets }: ExperienceCardProps) {
  return (
    <div className="group rounded-2xl border border-black/[0.07] bg-surface p-7 md:p-9 hover:border-navy/20 hover:shadow-sm transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
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
  )
}

export default function Page() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* ── NAV ───────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-md border-b border-black/[0.07]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <span className="font-heading text-lg font-medium tracking-wide text-foreground">
            Skyler Stein
          </span>
          <div className="hidden md:flex items-center gap-8">
            {['Experience', 'About', 'Education', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-muted hover:text-foreground transition-colors duration-200 navy-link"
              >
                {item}
              </a>
            ))}
          </div>
          <a
            href="https://www.linkedin.com/in/skylerstein"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-navy hover:text-navy/70 transition-colors"
          >
            <LinkedinIcon className="h-3.5 w-3.5" />
            LinkedIn
          </a>
        </div>
      </motion.nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background grid with navy tint */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(27,58,107,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(27,58,107,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
        {/* Subtle navy glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(27,58,107,0.05),transparent_65%)] blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-32 pb-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-navy/[0.06] px-4 py-1.5 mb-8"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-navy/60 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.26em] text-navy/70">
                Open to Law School &amp; Policy Opportunities
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-6xl md:text-7xl lg:text-8xl font-light leading-[0.92] tracking-[-0.02em] text-foreground mb-8"
            >
              Skyler<br />
              <span className="italic text-navy">Stein</span>
            </motion.h1>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="text-lg text-muted leading-relaxed max-w-lg mb-10"
            >
              Political Science student at UNC Wilmington. Twice-elected Student Body President representing 19,000+ students. Former Legislative Intern in the U.S. House of Representatives.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36 }}
              className="flex flex-wrap gap-8 mb-10"
            >
              {[
                { value: '3.565', label: 'GPA' },
                { value: '2×', label: 'Elected' },
                { value: '19K+', label: 'Students' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-heading text-3xl font-semibold text-navy">{stat.value}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted mt-0.5">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.44 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href="https://www.linkedin.com/in/skylerstein"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-navy text-white px-6 py-2.5 text-sm font-medium hover:bg-navy/85 transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
                Connect on LinkedIn
              </a>
              <a
                href="mailto:skylerstein22@gmail.com"
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.12] bg-white text-foreground/80 px-6 py-2.5 text-sm font-medium hover:border-navy/30 hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                skylerstein22@gmail.com
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
            <div className="relative">
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
            </div>
          </motion.div>

          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted/40"
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
              <ExperienceCard
                label="Leadership"
                org="UNCW Student Government"
                role="Student Body President (Reelected)"
                date="April 2024 – April 2026"
                bullets={[
                  'Twice elected by the student body as Student Body President at UNCW, representing over 19,000 students',
                  'Chair of the Association of Student Governments (ASG) Council of Student Body Presidents, reelected to this position as well',
                  'Ex-Officio Voting Member of the UNCW Board of Trustees, providing the student perspective on institutional decisions',
                  'Serves on the UNCW Alumni Association Board of Directors, connecting current students with the broader UNCW community',
                  'Advocated across Student Success, Institutional Effectiveness, Academic Affairs, and Sustainability',
                ]}
              />
            </FadeIn>

            <FadeIn delay={0.13}>
              <ExperienceCard
                label="Recent"
                org="NC Coordinated Campaign"
                role="Campus Organizing Fellow"
                date="April 2026 – May 2026"
                bullets={[
                  'Built relationships with student voters, campus organizations, and university stakeholders for a statewide coordinated campaign',
                  'Supported voter outreach through direct voter contact, event staffing, and voter education on a campus of over 19,000 students',
                  'Connected campus-based organizing to broader electoral and youth engagement strategy',
                ]}
              />
            </FadeIn>

            <FadeIn delay={0.16}>
              <ExperienceCard
                label="Federal"
                org="US House of Representatives"
                role="Legislative Intern"
                date="Summer 2025"
                bullets={[
                  'Researched legislation and policy issues, preparing memos and briefs to inform congressional staff decision-making',
                  'Drafted and edited constituent correspondence on federal issues',
                  'Attended committee hearings, briefings, and floor proceedings, summarizing key takeaways',
                  'Conducted Capitol tours and aided visiting constituents',
                ]}
              />
            </FadeIn>

            <FadeIn delay={0.19}>
              <ExperienceCard
                label="Leadership"
                org="UNCW Student Government"
                role="Student Body Vice President"
                date="April 2023 – April 2024"
                bullets={[
                  'Elected Student Body Vice President and President of the Senate',
                  'Led a team of over 50 student leaders managing the Student Senate and Senatorial Board',
                  'Served as Tri-Chair of the Campus Initiated Tuition and Fee Advisory Committee (CITI)',
                  'Collaborated with the Student Body President on campus-wide initiatives including the Seahawk Swap Shop',
                ]}
              />
            </FadeIn>

            {/* Endless Sports — smaller card */}
            <FadeIn delay={0.22}>
              <div className="rounded-2xl border border-black/[0.07] bg-surface p-6 hover:border-navy/20 hover:shadow-sm transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-navy/50">Nonprofit · Volunteer</span>
                      <span className="h-px w-6 bg-navy/20" />
                    </div>
                    <h3 className="font-heading text-xl font-medium text-foreground">Endless Sports</h3>
                    <p className="text-muted text-sm mt-0.5">Board Member — nonprofit providing athletic programs for the special needs community</p>
                  </div>
                  <span className="text-sm text-muted/60 shrink-0">Dec 2021 – Present</span>
                </div>
              </div>
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
                Four years in rooms where decisions get made.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="space-y-5 text-foreground/70 leading-relaxed pt-8 lg:pt-16">
                <p>
                  I went to UNCW for political science and ended up becoming Student Body Vice President freshman year, then President, then got reelected. Four years in, I have spent most of college in some form of elected or appointed leadership.
                </p>
                <p>
                  Between representing 19,000 students on campus, serving on the Board of Trustees, and spending a summer in Washington working in a congressional office, I have been in rooms where decisions get made. That is where I want to be long term.
                </p>
                <p className="text-foreground font-medium">
                  I graduated from UNCW in May 2026 and am looking at law school and policy-focused opportunities. If you want to talk, reach out.
                </p>
              </div>
            </FadeIn>
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
              <div className="rounded-2xl border border-black/[0.07] bg-surface p-7 h-full hover:shadow-sm transition-all duration-300">
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
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="rounded-2xl border border-black/[0.07] bg-surface p-7 h-full hover:shadow-sm transition-all duration-300">
                <h3 className="font-heading text-xl font-medium text-foreground mb-6">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Public Speaking',
                    'Legislative Research',
                    'Policy Analysis',
                    'Strategic Leadership',
                    'Stakeholder Engagement',
                    'Cross-Functional Team Management',
                    'Advocacy',
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/[0.08] bg-background px-3 py-1.5 text-xs text-foreground/70 hover:border-navy/20 hover:text-navy transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <Divider />

        {/* ── CONTACT ─────────────────────────────────────────────────────── */}
        <section id="contact" className="py-8 pb-32">
          <FadeIn>
            <SectionLabel>Contact</SectionLabel>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 max-w-2xl">
              Let&apos;s connect.
            </h2>
            <p className="text-foreground/55 max-w-md mb-12 leading-relaxed">
              Finishing at UNCW in May 2026 and open to law school and public policy opportunities. Happy to connect.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-4">
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
        </section>

      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.07] py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-heading text-sm text-muted">Skyler Stein</span>
          <span className="text-xs text-muted/60">Political Science · UNCW Class of 2026</span>
          <a
            href="mailto:skylerstein22@gmail.com"
            className="text-xs text-muted/40 hover:text-navy/60 transition-colors"
          >
            skylerstein22@gmail.com
          </a>
        </div>
      </footer>
    </main>
  )
}
