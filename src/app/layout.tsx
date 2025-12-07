import { Inter } from 'next/font/google'

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
        {children}
      </body>
    </html>
  )
}
