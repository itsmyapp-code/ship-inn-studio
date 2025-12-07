import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'The Ship Inn Porlock Weir - Historic B&B with Pub & Restaurant',
  description: 'Experience coastal charm at The Ship Inn, a historic B&B with 5 beautifully appointed rooms, traditional pub, and restaurant in picturesque Porlock Weir, Exmoor National Park.',
  keywords: 'Porlock Weir accommodation, Exmoor B&B, pub with rooms, coastal hotel, Somerset holiday, West Somerset, Porlock Bay',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}