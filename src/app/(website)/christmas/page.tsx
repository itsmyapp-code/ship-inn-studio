import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'
import { getSharedContactData } from '@/lib/outstatic'
import { TrackedPhoneLink, TrackedEmailLink, TrackedMenuLink } from '@/components/TrackedContactLinks'
import ChristmasVideoPlayer from '@/components/ChristmasVideoPlayer'

export const metadata = {
  title: 'Christmas at The Ship Inn Porlock Weir — Festive Dining, Log Fires & Holiday Magic',
  description:
    'Celebrate the festive season at The Ship Inn Porlock Weir. Enjoy our special Festive Menu (2 courses £30.00 / 3 courses £35.50), roaring log fires, mulled wine, and warm mince pies by the harbour.',
  openGraph: {
    title: 'Christmas at The Ship Inn Porlock Weir',
    description:
      'Warm log fires, spiced mulled wine, harbour lights and delicious festive dining at Exmoor’s historic coastal pub.',
    images: ['/images/shipinn-226.webp'],
  },
}

export default function ChristmasPage() {
  const contactData = getSharedContactData()
  const festivePdfPath = '/menus/The-Ship-Inn-Festive-Menu.pdf'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-amber-500/30">
        <SmartImage
          src="/images/shipinn-226.webp"
          alt="Christmas at The Ship Inn Porlock Weir"
          fill
          priority
          className="object-cover object-center filter brightness-[0.45] contrast-[1.08] scale-105"
        />

        {/* Ambient Warm Golden Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/50 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <span className="text-base">✦</span>
            <span>Festive Season 2026 at Porlock Weir</span>
            <span className="text-base">✦</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight mb-6 leading-tight drop-shadow-md">
            Christmas at <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400">
              The Ship Inn
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-amber-100/90 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            Roaring stone hearths, spiced mulled wine, homemade mince pies, and our celebrated festive feast at the water’s edge.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#festive-menu"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold px-8 py-4 rounded-xl text-base sm:text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
            >
              <span>View Festive Menu</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>

            <a
              href={festivePdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-amber-400/40 hover:border-amber-300 backdrop-blur-md font-semibold px-8 py-4 rounded-xl text-base sm:text-lg shadow-lg hover:shadow-amber-500/10 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download Menu PDF</span>
            </a>
          </div>
        </div>
      </section>

      {/* Festive Video Showcase Section */}
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

          {/* Embedded Video Player with Initial Frame Hold */}
          <ChristmasVideoPlayer
            src="/videos/santa-ship-inn.mp4"
            poster="/videos/santa-poster.jpg"
            autoPlay={false}
            initialHoldMs={2800}
          />
        </div>
      </section>

      {/* Fireside Treats & Atmosphere Cards */}
      <section className="py-16 sm:py-20 bg-slate-950 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-xs inline-block mb-3 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
              Cosy Coastal Traditions
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
              Warm Up by the Sea
            </h2>
            <p className="text-base sm:text-lg text-slate-300">
              Step in from a crisp walk along the Exmoor coastline and let our log fire and festive cheer warm your spirits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Card 1: Spiced Mulled Wine */}
            <div className="bg-gradient-to-br from-red-950/60 to-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl hover:border-amber-400/60 transition group">
              <div className="w-12 h-12 rounded-xl bg-red-900/80 border border-amber-400/40 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                🍷
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Fireside Speciality
              </span>
              <h3 className="text-xl font-serif font-bold text-white mt-1 mb-2">
                Traditional Spiced Mulled Wine
              </h3>
              <p className="text-sm text-amber-100/80 leading-relaxed mb-4">
                Rich red wine gently infused with cinnamon, star anise, cloves, fresh Exmoor orange slices and a touch of Somerset honey. Served steaming hot in our cosy saloon bar.
              </p>
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <span>✦ Available daily by the glass</span>
              </div>
            </div>

            {/* Card 2: Warm Homemade Mince Pies */}
            <div className="bg-gradient-to-br from-amber-950/60 to-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl hover:border-amber-400/60 transition group">
              <div className="w-12 h-12 rounded-xl bg-amber-900/80 border border-amber-400/40 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                🥧
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Fresh From The Oven
              </span>
              <h3 className="text-xl font-serif font-bold text-white mt-1 mb-2">
                Warm Mince Pies &amp; Clotted Cream
              </h3>
              <p className="text-sm text-amber-100/80 leading-relaxed mb-4">
                Crumbly golden shortcrust pastry filled with brandy-soaked fruit mincemeat, dusted with icing sugar and served warm with West Country clotted cream.
              </p>
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <span>✦ Pair with Mulled Wine or Speciality Coffee</span>
              </div>
            </div>

            {/* Card 3: The Cosy Fireplace */}
            <div className="bg-gradient-to-br from-orange-950/60 to-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl hover:border-amber-400/60 transition group">
              <div className="w-12 h-12 rounded-xl bg-orange-900/80 border border-amber-400/40 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                🪵
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

          {/* Clean Fireplace Showcase Banner (No Fire Overlay, No Text on Photos) */}
          <div className="rounded-3xl overflow-hidden border-2 border-amber-500/40 bg-slate-900/90 shadow-2xl grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Real Ship Inn Brick Fireplace Photo (Pure & Clean) */}
            <div className="lg:col-span-6 relative min-h-[360px] overflow-hidden">
              <SmartImage
                src="/images/shipinn-226.webp"
                alt="The Ship Inn Cosy Brick Fireplace"
                fill
                className="object-cover object-bottom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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

      {/* The Ship Inn Festive Menu Section */}
      <section id="festive-menu" className="py-20 bg-[#0d1117] border-b border-amber-500/30 scroll-mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Card Container styled like a luxury Christmas Pub Menu */}
          <div className="relative bg-[#fbf9f5] text-slate-900 rounded-3xl p-8 sm:p-14 shadow-[0_0_60px_rgba(245,158,11,0.2)] border-4 border-amber-600/40">
            {/* Header / Pub Identity */}
            <div className="text-center pb-8 border-b-2 border-amber-800/30">
              <div className="w-16 h-16 mx-auto mb-3 relative">
                <SmartImage
                  src="/images/the_ship_inn2.webp"
                  alt="The Ship Inn Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-[0.2em] text-[#1e3a8a] mb-1">
                The Ship Inn
              </h3>
              <p className="text-xs uppercase tracking-widest text-amber-800 font-semibold mb-3">
                Porlock Weir • Exmoor Coastal Dining
              </p>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#991b1b] tracking-wider uppercase mb-3">
                Festive Menu
              </h2>
              <p className="text-sm sm:text-base italic text-slate-600 max-w-xl mx-auto">
                Carefully crafted by our Head Chef &amp; Galley team using the finest fresh Exmoor and West Country ingredients.
              </p>
              <div className="mt-4 inline-flex items-center gap-3 bg-amber-100/70 border border-amber-300 px-6 py-2 rounded-full font-serif font-bold text-amber-950 text-base sm:text-lg">
                <span>2 Courses £30.00</span>
                <span className="text-amber-500">•</span>
                <span>3 Courses £35.50</span>
              </div>
            </div>

            {/* Menu Courses */}
            <div className="py-8 space-y-10">
              {/* Starters */}
              <div>
                <div className="text-center mb-6">
                  <span className="inline-block font-serif text-2xl font-bold uppercase tracking-widest text-[#991b1b] border-b-2 border-amber-400 pb-1">
                    Starters
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-dashed border-amber-900/20 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                        Homemade Soup
                      </h4>
                      <p className="text-sm text-slate-600 italic">
                        Served warm with crusty bread &amp; West Country butter
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 mt-1 sm:mt-0 sm:ml-4 shrink-0">
                      (G, D)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-dashed border-amber-900/20 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                        Smoked Salmon Pâté
                      </h4>
                      <p className="text-sm text-slate-600 italic">
                        Crispy Melba toast, capers, pickled cucumber &amp; fresh watercress
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 mt-1 sm:mt-0 sm:ml-4 shrink-0">
                      (F, G, MU, E)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-dashed border-amber-900/20 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                        Ham Hock &amp; Cheddar Croquette
                      </h4>
                      <p className="text-sm text-slate-600 italic">
                        Somerset apple chutney &amp; dressed pea shoots
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 mt-1 sm:mt-0 sm:ml-4 shrink-0">
                      (G, D, MU)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-dashed border-amber-900/20 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                        Poached Pear &amp; Blue Cheese
                      </h4>
                      <p className="text-sm text-slate-600 italic">
                        Candied walnuts, wild rocket &amp; local Exmoor honey
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 mt-1 sm:mt-0 sm:ml-4 shrink-0">
                      (D, N)
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Courses */}
              <div>
                <div className="text-center mb-6">
                  <span className="inline-block font-serif text-2xl font-bold uppercase tracking-widest text-[#991b1b] border-b-2 border-amber-400 pb-1">
                    Main Courses
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-dashed border-amber-900/20 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                        Traditional Roast Turkey
                      </h4>
                      <p className="text-sm text-slate-600 italic">
                        Served with all the classic accompaniments, sage &amp; onion stuffing, pigs in blankets, roast potatoes &amp; rich pan gravy
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 mt-1 sm:mt-0 sm:ml-4 shrink-0">
                      (G, D, MU)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-dashed border-amber-900/20 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                        Braised Local Venison
                      </h4>
                      <p className="text-sm text-slate-600 italic">
                        Buttery mashed potatoes, roasted winter root vegetables &amp; red wine reduction
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 mt-1 sm:mt-0 sm:ml-4 shrink-0">
                      (D, MU, SU)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-dashed border-amber-900/20 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                        Pan Fried Cod Loin
                      </h4>
                      <p className="text-sm text-slate-600 italic">
                        Warm olive &amp; cherry tomato sauce, lemon crushed potatoes &amp; fine green beans
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 mt-1 sm:mt-0 sm:ml-4 shrink-0">
                      (F, D)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-dashed border-amber-900/20 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                        Chestnut &amp; Butternut Risotto
                      </h4>
                      <p className="text-sm text-slate-600 italic">
                        Crumbled feta, fragrant sage pesto &amp; toasted pumpkin seeds
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 mt-1 sm:mt-0 sm:ml-4 shrink-0">
                      (V, G, N)
                    </span>
                  </div>
                </div>
              </div>

              {/* Desserts */}
              <div>
                <div className="text-center mb-6">
                  <span className="inline-block font-serif text-2xl font-bold uppercase tracking-widest text-[#991b1b] border-b-2 border-amber-400 pb-1">
                    Desserts
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-dashed border-amber-900/20 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                        Warm Christmas Pudding Strudel
                      </h4>
                      <p className="text-sm text-slate-600 italic">
                        Silky brandy custard &amp; candied almonds
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 mt-1 sm:mt-0 sm:ml-4 shrink-0">
                      (G, D, SU, N, E)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-dashed border-amber-900/20 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                        Chocolate &amp; Orange Torte
                      </h4>
                      <p className="text-sm text-slate-600 italic">
                        Warming ginger syrup &amp; honeycomb ice cream
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 mt-1 sm:mt-0 sm:ml-4 shrink-0">
                      (G, D, E)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-dashed border-amber-900/20 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                        Godminster Cheddar
                      </h4>
                      <p className="text-sm text-slate-600 italic">
                        Somerset tomato chutney &amp; artisan crackers
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 mt-1 sm:mt-0 sm:ml-4 shrink-0">
                      (D, G, MU)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Allergen Key & Pub Details Footer */}
            <div className="pt-6 border-t border-amber-900/30 text-center text-xs text-slate-600 space-y-3">
              <p className="font-semibold text-slate-700">
                Allergen Key: G: Gluten • N: Nuts • D: Dairy • F: Fish • S: Shellfish • MU: Mustard • SE: Sesame • E: Egg • SO: Soya • CR: Crustaceans • V: Vegetarian • SU: Sulphites
              </p>
              <p>
                Please inform our team of any allergies or dietary requirements when booking.
              </p>
              <div className="text-amber-900 font-serif text-sm pt-2">
                <strong>The Ship Inn</strong> • Porlock Weir, Minehead, Somerset TA24 8PB • Tel: 01643 863288
              </div>
            </div>

            {/* Prominent Action Button to Download the Classy PDF */}
            <div className="mt-8 text-center">
              <a
                href={festivePdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-serif font-bold text-lg px-8 py-4 rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Printable Festive Menu (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Booking & Enquiries CTA Section */}
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
