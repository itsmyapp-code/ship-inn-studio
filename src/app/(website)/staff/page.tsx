import { Metadata } from 'next'
import StaffPwaClient from './StaffPwaClient'

export const metadata: Metadata = {
  title: 'Staff Publisher | The Ship Inn Porlock Weir',
  description: 'Fast mobile publisher for pub events, daily specials, and news updates.',
  robots: {
    index: false,
    follow: false
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ship Staff'
  }
}

export default function StaffPage() {
  return <StaffPwaClient />
}

