import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'
import { getSharedContactData } from '@/lib/outstatic'
import { TrackedPhoneLink, TrackedEmailLink } from '@/components/TrackedContactLinks'
import ChristmasVideoPlayer from '@/components/ChristmasVideoPlayer'

export const metadata = {
  title: 'Christmas at The Ship Inn Porlock Weir — Festive Dining, Log Fires & Holiday Magic',
  description:
    'Celebrate a proper coastal Christmas at The Ship Inn Porlock Weir. Enjoy our special Festive Menu (2 courses £30.00 / 3 courses £35.50), roaring log fires, mulled wine, warm mince pies, and festive harbourside dining.',
  openGraph: {
    title: 'Christmas at The Ship Inn Porlock Weir',
    description:
      'Warm log fires, spiced mulled wine, harbour lights and delicious festive dining at Exmoor’s historic coastal pub.',
    images: ['/images/shipinn-204.webp'],
  },
}

export default function ChristmasPage() {
  const contactData = getSharedContactData()
  const festivePdfPath = '/menus/The-Ship-Inn-Festive-Menu.pdf'

  const emailSubject = 'Christmas & Festive Dining Enquiry - The Ship Inn Porlock Weir'
  const emailBody = `Hello Ship Inn Team,

I would like to make an enquiry regarding Christmas / festive dining at The Ship Inn.

Preferred Date:
Party Size:
Preferred Time:
Any Dietary Requirements / Notes:

Name:
Contact Telephone:

Thank you!`

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ========================================================= */}
      {/* 1. FESTIVE HERO SECTION (Matched to Demo, Bright & Warm)   */}
      {/* ========================================================= */}
      <section className="relative min-h-[540px] sm:min-h-[580px] flex items-center justify-center overflow-hidden border-b border-amber-500/30">
        <SmartImage
          src="/images/shipinn-204.webp"
          alt="The Ship Inn Festive Bar & Saloon"
          fill
          priority
          className="object-cover scale-105 brightness-90 contrast-[1.02]"
        />
        {/* Warm, translucent festive gradient keeping pub interior bright & visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-red-950/40 to-slate-950/85" />

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
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-5 drop-shadow-md">
              A Proper Coastal Christmas at{' '}
              <span className="text-amber-300">The Ship Inn</span>
            </h1>
            <p className="text-base sm:text-xl text-amber-50/95 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed font-light drop-shadow">
              Step in from the crisp Exmoor sea breeze to roaring log fires, spiced mulled wine, warm homemade mince pies, and unforgettable festive dining overlooking the harbour.
            </p>

            {/* Primary Hero CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href={festivePdfPath}
                target="_blank"
                rel="noopener noreferrer"
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
                <span>Download Festive Menu (PDF)</span>
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
      {/* 2. SANTA VIDEO SHOWCASE SECTION                           */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-[#16120d] to-slate-950 border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-xs inline-block mb-3 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/30">
              ✦ Festive Magic at The Ship Inn ✦
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
              Santa Has Arrived in Porlock Weir
            </h2>
            <p className="text-base sm:text-lg text-amber-100/80">
              Watch the magic unfold beside our 200-year-old stone fireplace. A warm harbour welcome awaits everyone this Christmas.
            </p>
          </div>

          {/* Embedded Video Player with 2.8s Initial Frame Hold */}
          <ChristmasVideoPlayer
            src="/videos/santa-ship-inn.mp4"
            poster="/videos/santa-poster.jpg"
            autoPlay={false}
            initialHoldMs={2800}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. MULLED WINE, MINCE PIES & THE COSY FIREPLACE           */}
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

          {/* Interactive Cosy Fireplace Showcase Banner (Clean Photos: No Fire Overlay, No Text on Photos) */}
          <div className="rounded-3xl overflow-hidden border-2 border-amber-500/40 bg-slate-900/90 shadow-2xl grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Real Ship Inn Brick Fireplace (Pure & Clean Photo) */}
            <div className="lg:col-span-6 relative min-h-[360px] overflow-hidden">
              <SmartImage
                src="/images/shipinn-226.webp"
                alt="The Ship Inn Cosy Brick Fireplace"
                fill
                className="object-cover object-bottom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Right: Festive Interior Photos & Fireside Treat Offer (Clean Photos: No Text Badges) */}
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

                {/* Mini Photo Pair of Real Ship Inn Christmas Decorations (Clean Photos) */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="relative h-36 rounded-xl overflow-hidden border border-white/15">
                    <SmartImage
                      src="/images/shipinn-234.webp"
                      alt="Christmas Lights in the Window at The Ship Inn"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-36 rounded-xl overflow-hidden border border-white/15">
                    <SmartImage
                      src="/images/shipinn-218.webp"
                      alt="Festive Garlands on the Bar at The Ship Inn"
                      fill
                      className="object-cover"
                    />
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
      {/* 4. FESTIVE MENU DOWNLOAD SECTION (Opens PDF in New Window)*/}
      {/* ========================================================= */}
      <section id="festive-menu" className="py-20 sm:py-24 bg-gradient-to-b from-[#120e0a] via-slate-950 to-[#120e0a] border-b border-amber-500/30 scroll-mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-14 border-2 border-amber-500/50 bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 shadow-[0_0_60px_rgba(245,158,11,0.25)] text-center overflow-hidden">
            {/* Ambient Corner Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-500/20 border border-amber-400/40 mb-4">
                ✦ Festive Dining at The Ship Inn ✦
              </span>

              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
                Our Christmas &amp; Festive Menu
              </h2>

              <p className="text-base sm:text-xl text-amber-100/90 max-w-2xl mx-auto mb-6 leading-relaxed font-light">
                Roast West Country Turkey, Braised Local Exmoor Venison, Pan-Fried Cod Loin, Chestnut &amp; Butternut Risotto, and Warm Christmas Pudding Strudel.
              </p>

              <div className="inline-flex items-center gap-4 bg-amber-400/15 border border-amber-400/40 px-6 py-2.5 rounded-full text-amber-300 font-serif font-bold text-base sm:text-xl mb-10">
                <span>2 Courses £30.00</span>
                <span className="text-amber-500">•</span>
                <span>3 Courses £35.50</span>
              </div>

              {/* Primary Download Button (Opens in New Window) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={festivePdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-serif font-bold text-lg sm:text-xl px-10 py-5 rounded-full shadow-2xl shadow-amber-500/40 hover:scale-105 transition-all inline-flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Festive Menu (PDF)</span>
                  <svg className="w-5 h-5 opacity-70 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div className="mt-5 text-xs text-amber-200/60 font-sans">
                ✦ Opens in a new window • Full uncropped printable A4 PDF menu
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. BOOKING & ENQUIRIES CTA SECTION                        */}
      {/* ========================================================= */}
      <section id="book-christmas" className="relative py-20 bg-gradient-to-br from-slate-950 via-ship-blue-950 to-slate-900 border-t border-amber-500/30">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-3xl mb-4">
            🎄
          </div>
          <span className="block text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">
            Christmas Dining &amp; Parties
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-6">
            Book Your Table Today
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Tables for our Festive Menu and Christmas gatherings fill up quickly. Give our team a call or drop us an email with your preferred dates, party size, and any dietary requirements.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <TrackedPhoneLink
              phone={contactData.phone}
              location="christmas_cta"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold px-8 py-4 rounded-xl text-base sm:text-lg shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Call to Reserve: {contactData.phone}</span>
            </TrackedPhoneLink>

            <TrackedEmailLink
              email={contactData.email}
              location="christmas_cta"
              subject={emailSubject}
              body={emailBody}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-amber-400/40 hover:border-amber-300 backdrop-blur-md font-semibold px-8 py-4 rounded-xl text-base sm:text-lg shadow-lg hover:shadow-amber-500/10 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email Christmas Enquiry</span>
            </TrackedEmailLink>
          </div>

          <div className="mt-12 text-xs text-slate-400">
            The Ship Inn, Porlock Weir, Minehead, Somerset TA24 8PB • Open every day throughout December
          </div>
        </div>
      </section>
    </div>
  )
}
