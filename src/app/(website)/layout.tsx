import AnalyticsScripts from '@/components/AnalyticsScripts'
import CookieBanner from '@/components/CookieBanner'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import '../globals.css'

export const metadata = {
  title: 'The Ship Inn Porlock Weir - Historic B&B with Pub & Restaurant',
  description: 'Experience coastal charm at The Ship Inn, a historic B&B with 3 beautifully appointed rooms, traditional pub, and restaurant in picturesque Porlock Weir, Exmoor National Park.',
  keywords: 'Porlock Weir accommodation, Exmoor B&B, pub with rooms, coastal hotel, Somerset holiday, West Somerset, Porlock Bay',
}

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-centaur">
        <AnalyticsScripts />
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
