import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins, Inter } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const SITE_URL = 'https://adebolacaxtonmartins.xyz'
const TITLE = 'Save A Life — Help Our Colleague Receive a Kidney Transplant'
const DESCRIPTION =
  'Our beloved colleague is battling End-Stage Kidney Disease and urgently needs a life-saving kidney transplant. Your support can give her a second chance at life.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  generator: 'v0.app',
  keywords: [
    'kidney transplant',
    'medical fundraising',
    'donation appeal',
    'save a life',
    'end-stage kidney disease',
    'charity',
    'medical support',
    'crowdfunding',
  ],
  authors: [{ name: 'Medical Support Committee' }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Save A Life Appeal',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Save A Life — Kidney Transplant Appeal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#1e3a8a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalScholarlyArticle',
    name: 'Save A Life — Kidney Transplant Appeal',
    headline:
      'Help Our Dear Colleague Receive a Life-Saving Kidney Transplant',
    description: DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
  }

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} bg-background scroll-smooth`}
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
