import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'
import { getSharedContactData, getMenusData } from '@/lib/outstatic'
import { TrackedPhoneLink, TrackedEmailLink, TrackedMenuLink } from '@/components/TrackedContactLinks'

export const metadata = {
  title: 'Christmas at The Ship Inn — Porlock Weir (Private Preview)',
  description:
    'Celebrate a proper coastal Christmas at The Ship Inn Porlock Weir with roaring log fires, spiced mulled wine, warm homemade mince pies, and festive menus.',
  robots: {
    index: false,
    follow: false,
  },
}

interface MenuDisplayItem {
  title: string
  subtitle?: string
  description: string
  badge?: string
  path: string
}

function getChristmasMenus(): MenuDisplayItem[] {
  const outstaticMenus = getMenusData()
  const festiveMenus: MenuDisplayItem[] = []

  if (outstaticMenus && outstaticMenus.length > 0) {
    outstaticMenus.forEach((menu) => {
      let menuPath = menu.pdfFile || menu.pdfUrl || ''
      if (menuPath && !menuPath.startsWith('http://') && !menuPath.startsWith('https://')) {
        menuPath = '/' + menuPath.replace(/^\/+/, '')
      }
      const lower = (menu.title || '').toLowerCase()
      if (lower.includes('christmas') || lower.includes('festive') || lower.includes('winter') || lower.includes('boxing')) {
        festiveMenus.push({
          title: menu.title,
          subtitle: menu.subtitle || 'Festive Season',
          description:
            'Prepared fresh in our galley using the finest West Country produce and seasonal Exmoor ingredients.',
          badge: 'Festive Menu',
          path: menuPath || `/menus/${menu.title}.pdf`,
        })
      }
    })
  }

  // Fallback / Showcase Christmas Menus (plus any live PDFs from public/menus so downloads work right away)
  let fallbackPdfPath = '/menus/Menu.pdf'
  const menusDir = path.join(process.cwd(), 'public/menus')
  if (fs.existsSync(menusDir)) {
    const pdfs = fs.readdirSync(menusDir).filter((f) => f.toLowerCase().endsWith('.pdf'))
    if (pdfs.length > 0) {
      fallbackPdfPath = `/menus/${pdfs[0]}`
    }
  }

  if (festiveMenus.length === 0) {
    return [
      {
        title: 'Christmas Party & Fayre Menu',
        subtitle: '1st – 24th December',
        description:
          '2 or 3 courses featuring roast West Country turkey with all the trimmings, braised Exmoor venison, pan-seared sea bass & homemade Christmas pudding.',
        badge: 'Most Popular',
        path: fallbackPdfPath,
      },
      {
        title: 'Christmas Day & Boxing Day Feast',
        subtitle: '25th & 26th December',
        description:
          'A glass of fizz or spiced mulled wine on arrival followed by our traditional festive feast and warm mince pies & brandy butter by the fire.',
        path: fallbackPdfPath,
      },
      {
        title: 'Festive Opening Hours & Winter Drinks',
        subtitle: 'December & New Year Schedule',
        description:
          'Full schedule of our Christmas & New Year kitchen serving times, winter real ales, mulled cider, and festive harbourside events.',
        path: fallbackPdfPath,
      },
    ]
  }

  return festiveMenus
}

export default function SecretChristmasPage() {
  const contactData = getSharedContactData()
  const menus = getChristmasMenus()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Private Preview Floating Switcher Bar */}
      <div className="bg-slate-950 text-white border-b border-amber-400/40 px-4 py-2.5 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              🔒 PRIVATE PREVIEW
            </span>
            <span className="text-xs sm:text-sm font-medium text-amber-100">
              <strong>Christmas Page Mockup</strong> — Menu Downloads, Mulled Wine, Mince Pies, Cosy Fireplace &amp; Booking CTA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/xmas-preview-7924"
              className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-400/40 transition"
            >
              ← 1. Homepage + CTA Button
            </Link>
            <Link
              href="/xmas-preview-7924/christmas"
              className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 shadow"
            >
              2. Christmas Page
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. FESTIVE HERO SECTION                                   */}
      {/* ========================================================= */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden border-b border-amber-500/30">
        <SmartImage
          src="/images/shipinn-204.webp"
          alt="The Ship Inn Festive Bar & Saloon"
          fill
          priority
          className="object-cover scale-105 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-red-950/55 to-slate-950/90" />

        {/* Twinkling Stars Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="animate-pulse absolute top-10 left-[12%] text-amber-300 text-xl">✦</span>
          <span className="animate-pulse absolute top-20 right-[18%] text-yellow-200 text-2xl">★</span>
          <span className="animate-pulse absolute bottom-24 left-[20%] text-amber-400 text-lg">✧</span>
          <span className="animate-pulse absolute top-32 left-[78%] text-amber-300 text-xl">✦</span>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/80 border border-amber-400/50 text-amber-300 text-xs font-bold uppercase tracking-widest mb-5 shadow-lg">
              <span>🎄 Festive Season at Porlock Weir</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-5">
              A Proper Coastal Christmas at{' '}
              <span className="text-amber-300">The Ship Inn</span>
            </h1>
            <p className="text-base sm:text-xl text-amber-50/90 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Step in from the crisp Exmoor sea breeze to roaring log fires, spiced mulled wine, warm homemade mince pies, and unforgettable festive dining overlooking the harbour.
            </p>

            {/* Primary Hero CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="#festive-menus"
                className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-bold px-8 py-4 rounded-full text-base sm:text-lg shadow-xl shadow-amber-500/30 hover:scale-105 transition-all inline-flex items-center justify-center gap-2.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Download Festive Menus (PDF)</span>
              </a>

              <a
                href="#book-christmas"
                className="bg-red-800/85 hover:bg-red-700 text-white border-2 border-amber-300/70 font-semibold px-8 py-4 rounded-full text-base sm:text-lg shadow-xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2.5 backdrop-blur-md"
              >
                <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>Book Your Christmas Table</span>
              </a>
            </div>
          </div>

          {/* Right Floating Christmas Emblem */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.8)] bg-slate-950 p-1">
                <SmartImage
                  src="/images/christmas-cta-button.webp"
                  alt="Christmas is Coming — The Ship Inn"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-lg border border-white">
                ✨ Bookings Now Open
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. MULLED WINE, MINCE PIES & THE COSY FIREPLACE           */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-950 via-[#1c120c] to-slate-950 border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border border-amber-500/30 mb-3">
              🔥 Fireside Hospitality
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
              Mulled Wine, Mince Pies &amp; Our Good Old Cosy Fireplace
            </h2>
            <p className="text-amber-100/80 text-base sm:text-lg">
              Whether you’re returning from a winter walk along the South West Coast Path or gathering with friends, nothing beats warming your hands by our historic stone hearth.
            </p>
          </div>

          {/* 3 Feature Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {/* Card 1: Mulled Wine */}
            <div className="bg-gradient-to-br from-red-950/70 to-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl hover:border-amber-400 transition group">
              <div className="w-12 h-12 rounded-xl bg-red-900/80 border border-amber-400/40 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                🍷
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Simmered Daily on the Bar
              </span>
              <h3 className="text-xl font-serif font-bold text-white mt-1 mb-2">
                Spiced Mulled Wine &amp; Hot Cider
              </h3>
              <p className="text-sm text-amber-100/80 leading-relaxed mb-4">
                Rich red wine gently steeped with cinnamon sticks, star anise, cloves, and fresh West Country orange slices — plus hot spiced Porlock Vale cider.
              </p>
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <span>✦ Served steaming hot all day</span>
              </div>
            </div>

            {/* Card 2: Mince Pies */}
            <div className="bg-gradient-to-br from-amber-950/60 to-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl hover:border-amber-400 transition group">
              <div className="w-12 h-12 rounded-xl bg-amber-900/80 border border-amber-400/40 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                🥧
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Fresh from the Galley
              </span>
              <h3 className="text-xl font-serif font-bold text-white mt-1 mb-2">
                Warm Homemade Mince Pies
              </h3>
              <p className="text-sm text-amber-100/80 leading-relaxed mb-4">
                Crumbly golden shortcrust pastry filled with brandy-soaked fruit mincemeat, dusted with icing sugar and served warm with West Country clotted cream.
              </p>
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <span>✦ Pair with Mulled Wine or Speciality Coffee</span>
              </div>
            </div>

            {/* Card 3: The Cosy Fireplace */}
            <div className="bg-gradient-to-br from-orange-950/70 to-slate-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.3)] group">
              <div className="w-12 h-12 rounded-xl bg-orange-900/80 border border-amber-400/50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                🔥
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                200+ Years of Warmth
              </span>
              <h3 className="text-xl font-serif font-bold text-white mt-1 mb-2">
                The Good Old Cosy Fireplace
              </h3>
              <p className="text-sm text-amber-100/80 leading-relaxed mb-4">
                Pull up an armchair beside our original brick-and-stone hearth. Crackling logs, low oak beams, fairy lights, and dog-friendly corners with treats by the fire.
              </p>
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <span>✦ Muddy boots &amp; four-legged friends welcome</span>
              </div>
            </div>
          </div>

          {/* Interactive Cosy Fireplace Showcase Banner */}
          <div className="rounded-3xl overflow-hidden border-2 border-amber-500/40 bg-slate-900/90 shadow-2xl grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Real Ship Inn Brick Fireplace + Animated Crackling Fire Effect */}
            <div className="lg:col-span-6 relative min-h-[360px] overflow-hidden">
              <SmartImage
                src="/images/shipinn-226.webp"
                alt="The Ship Inn Cosy Brick Fireplace & Specials Board"
                fill
                className="object-cover object-bottom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-orange-950/25 to-transparent" />

              {/* Animated Hearth Glow & Flame inside the fireplace opening */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-28 pointer-events-none flex items-end justify-center">
                <div className="w-44 h-24 rounded-full bg-orange-500/50 blur-xl animate-pulse absolute" />
                <svg
                  className="w-24 h-20 text-amber-400/95 animate-bounce drop-shadow-[0_0_18px_rgba(249,115,22,0.95)] relative z-10"
                  viewBox="0 0 64 64"
                  fill="currentColor"
                >
                  <path
                    d="M32 4C24 16 14 24 14 38c0 11 8 20 18 20s18-9 18-20c0-10-6-18-10-25 0 6-3 10-6 10-3 0-4-6-2-19z"
                    fill="#f97316"
                  />
                  <path
                    d="M32 18c-5 8-10 13-10 22 0 7 4.5 12 10 12s10-5 10-12c0-7-4-13-10-22z"
                    fill="#fde047"
                  />
                </svg>
              </div>

              <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md border border-amber-400/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                <span>The Ship Inn Stone Hearth &amp; Specials Board</span>
              </div>
            </div>

            {/* Right: Festive Interior Photos & Fireside Treat Offer */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#1f130d] to-slate-900">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                  Fireside Winter Warmer
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 mb-3">
                  Settle In Beside the Logs
                </h3>
                <p className="text-sm sm:text-base text-amber-100/85 leading-relaxed mb-5">
                  Our traditional stone fireplace is the beating heart of The Ship Inn throughout December. Enjoy our{' '}
                  <strong className="text-amber-300">Fireside Mulled Wine &amp; Warm Mince Pie</strong> combo while admiring the twinkling harbour lights outside.
                </p>

                {/* Mini Photo Pair of Real Ship Inn Christmas Decorations */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="relative h-32 rounded-xl overflow-hidden border border-white/15">
                    <SmartImage
                      src="/images/shipinn-234.webp"
                      alt="Christmas Lights in the Window at The Ship Inn"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-1.5 left-2 text-[11px] font-semibold bg-black/75 text-amber-200 px-2 py-0.5 rounded">
                      Twinkling Window Stars
                    </span>
                  </div>
                  <div className="relative h-32 rounded-xl overflow-hidden border border-white/15">
                    <SmartImage
                      src="/images/shipinn-218.webp"
                      alt="Festive Garlands on the Bar at The Ship Inn"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-1.5 left-2 text-[11px] font-semibold bg-black/75 text-amber-200 px-2 py-0.5 rounded">
                      Festive Saloon Bar
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                    Walk-Ins Always Welcome
                  </div>
                  <div className="text-sm text-white font-medium">
                    No booking needed for fireside drinks &amp; mince pies!
                  </div>
                </div>
                <a
                  href="#book-christmas"
                  className="shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg shadow transition"
                >
                  Reserve Dining Table →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. FESTIVE MENU DOWNLOADS (PDF)                           */}
      {/* ========================================================= */}
      <section id="festive-menus" className="py-16 sm:py-20 bg-slate-900 border-b border-amber-500/20 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block bg-red-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border border-amber-400/30 mb-3">
              📜 Festive Menus
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
              Download Our Christmas Menus
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Crafted by our kitchen team using the finest West Country turkey, Exmoor game, and fresh local catch. Click any menu below to view or download the PDF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menus.map((menu, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-all ${
                  idx === 0 ? 'border-2 border-amber-400/60' : 'border border-white/15 hover:border-amber-400/50'
                }`}
              >
                {menu.badge && (
                  <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                    {menu.badge}
                  </div>
                )}
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-900/60 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  {menu.subtitle && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                      {menu.subtitle}
                    </span>
                  )}
                  <h3 className="text-xl font-serif font-bold text-white mt-1 mb-2">{menu.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">{menu.description}</p>
                </div>

                <TrackedMenuLink
                  menuTitle={menu.title}
                  menuUrl={menu.path}
                  className={`w-full font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow flex items-center justify-center gap-2 transition ${
                    idx === 0
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      : 'bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download PDF Menu</span>
                </TrackedMenuLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. FESTIVE BOOKING CTA & STAY OVERNIGHT IN THE CABINS     */}
      {/* ========================================================= */}
      <section
        id="book-christmas"
        className="relative py-16 sm:py-20 bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 text-white overflow-hidden scroll-mt-16"
      >
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-amber-400/40">
            🎅 Christmas Table Reservations &amp; Festive Stays
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Book Your Festive Table or Fireside Getaway
          </h2>
          <p className="text-base sm:text-lg text-amber-100/85 max-w-2xl mx-auto mb-8">
            Planning a Christmas work party, family gathering, or a cosy winter escape in one of our three harbour-view guest rooms? Give us a call or send an enquiry today.
          </p>

          {/* Main Booking Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <TrackedPhoneLink
              phone={contactData.phone}
              location="christmas_page_cta"
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-bold px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/25 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-3 text-base sm:text-lg"
            >
              <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>Call to Book: {contactData.phone}</span>
            </TrackedPhoneLink>

            <TrackedEmailLink
              email={contactData.email}
              location="christmas_page_cta"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-amber-300 backdrop-blur-md font-semibold px-8 py-4 rounded-2xl shadow-lg transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-3 text-base sm:text-lg"
            >
              <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Email Festive Enquiry</span>
            </TrackedEmailLink>
          </div>

          {/* Make a Night of It — Cabins Callout */}
          <Link
            href="/rooms"
            className="max-w-3xl mx-auto bg-slate-900/80 hover:bg-slate-900 border border-amber-400/30 hover:border-amber-400 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-900/60 border border-blue-400/30 flex items-center justify-center text-2xl shrink-0">
                🛏️
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-base group-hover:text-amber-300 transition">
                  Make a Night of It — Stay in The Cabins
                </h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Retire upstairs after your mulled wine by the fire to one of our three cosy en-suite rooms, with a hearty Full English breakfast included.
                </p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-bold text-amber-300 border border-amber-400/40 px-4 py-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-400 group-hover:text-slate-950 transition">
              Explore Our Rooms →
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}

