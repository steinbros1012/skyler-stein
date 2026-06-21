import type { Metadata } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Skyler Stein',
  description: 'Political Science student at UNC Wilmington. Twice-elected Student Body President representing 19,000+ students. Former Legislative Intern in the U.S. House of Representatives.',
  metadataBase: new URL('https://skylerstein.com'),
  openGraph: {
    title: 'Skyler Stein',
    description: 'Political Science student at UNC Wilmington. Twice-elected Student Body President representing 19,000+ students. Former Legislative Intern in the U.S. House of Representatives.',
    url: 'https://skylerstein.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Skyler Stein',
  email: 'skylerstein22@gmail.com',
  telephone: '(919)864-0408',
  url: 'https://skylerstein.com',
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of North Carolina Wilmington',
  },
  jobTitle: 'Student Body President',
  worksFor: {
    '@type': 'Organization',
    name: 'UNC Wilmington Student Government',
  },
  sameAs: ['https://www.linkedin.com/in/skylerstein'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-background text-foreground" style={{ fontFamily: 'var(--font-body)' }}>
        {children}
      </body>
    </html>
  )
}
