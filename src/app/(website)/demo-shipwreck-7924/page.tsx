import type { Metadata } from 'next'
import ShipwreckFestivalClient from './ShipwreckFestivalClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ShipWreck Music Festival | The Ship Inn Porlock Weir',
  description: 'Experience live maritime folk, sea shanties, and Celtic rock on the historic quayside of Porlock Weir at the ShipWreck Music Festival.',
  robots: {
    index: false,
    follow: false
  },
  openGraph: {
    title: 'ShipWreck Music Festival | The Ship Inn Porlock Weir',
    description: 'Three days of roaring shanties, quayside rock, West Country cider, and harbour acoustic sessions.',
    url: 'https://www.theshipinnporlockweir.co.uk/demo-shipwreck-7924',
    siteName: 'The Ship Inn Porlock Weir',
    images: [
      {
        url: 'https://www.theshipinnporlockweir.co.uk/videos/Ship_Wreck_with_Logo-poster.webp',
        width: 960,
        height: 720,
        alt: 'ShipWreck Music Festival at The Ship Inn'
      }
    ],
    type: 'website'
  }
}

export default function ShipwreckPage() {
  return <ShipwreckFestivalClient />
}
