import type { Metadata, Viewport } from 'next'
import AnalyticsScripts from '@/components/AnalyticsScripts'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CookieBanner from '@/components/CookieBanner'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PWARegister from '@/components/PWARegister'
import '../globals.css'

export const viewport: Viewport = {
  themeColor: '#1e3a8a',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'The Ship Inn Porlock Weir - Historic B&B with Pub & Restaurant',
  description: 'Experience coastal charm at The Ship Inn, a historic B&B with 3 beautifully appointed rooms, traditional pub, and restaurant in picturesque Porlock Weir, Exmoor National Park.',
  keywords: 'Porlock Weir accommodation, Exmoor B&B, pub with rooms, coastal hotel, Somerset holiday, West Somerset, Porlock Bay',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'The Ship Inn',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-centaur">
        <PWARegister />
        <AnalyticsScripts />
        <Analytics />
        <SpeedInsights />
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}
