import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import '../globals.css'

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
