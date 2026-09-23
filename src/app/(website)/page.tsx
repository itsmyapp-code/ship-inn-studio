import Link from 'next/link'
import HeroCarousel from '@/components/HeroCarousel'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getPageData } from '@/lib/outstatic'
import { TrackedFeatureCard } from '@/components/TrackedContactLinks'

export default function HomePage() {
  const pageData = getPageData('home')

  // Hero images for carousel — fix Outstatic's double-slash paths
  const fixPath = (p: string) => p.replace(/^\/\//, '/')
  const heroImage1 = fixPath(pageData?.heroImageOne || '/images/shipinn-011.webp')
  const heroImage2 = fixPath(pageData?.heroImageTwo || '')
  const heroImage3 = fixPath(pageData?.heroImageThree || '')
  const heroImages = [heroImage1, heroImage2, heroImage3]
  
  const heroAlt = pageData?.heroAlt || 'The Ship Inn Exterior'
  const strapline = pageData?.strapline || 'Historic charm meets modern comfort'
  
  const introParagraphs = [
    pageData?.introParagraphOne,
    pageData?.introParagraphTwo,
    pageData?.introParagraphThree,
    pageData?.introParagraphFour,
    pageData?.introParagraphFive
  ].map((p, idx) => {
    if (p !== undefined && p !== null) return p
    // Return original hardcoded paragraphs as fallbacks
    const fallbacks = [
      "Nestled in the heart of the stunning Exmoor coast, The Ship Inn at Porlock Weir is more than just a pub—it's a destination, a retreat, and a warm welcome at the edge of the sea. With roots tracing back over 200 years, our historic inn has long been a haven for weary travellers, sailors, walkers, and locals alike.",
      "Set against the dramatic backdrop of Porlock Bay and the ancient woodland of Exmoor National Park, The Ship Inn blends timeless charm with modern comfort. Whether you’re dropping in for a pint of local ale, a hearty meal or staying the night in one of our cosy rooms, you'll feel the character and history.",
      "In the summertime, our outdoor tables offer some of the best views on the coast—perfect for enjoying a cold drink, a leisurely lunch, or simply watching the boats drift by as the sun sets over the harbour.",
      "At our core, we’re all about relaxed hospitality. Log fires, sea views, good conversation, and great food, these are the ingredients we believe make a perfect visit. We’re proud to champion West Country suppliers and seasonal menus.",
      "Whether you're exploring the South West Coast Path or simply soaking in the peaceful harbour setting, The Ship Inn is your home by the sea."
    ]
    return fallbacks[idx]
  }).filter(Boolean)

  const feature1Title = pageData?.featureOneTitle || 'Comfortable Accommodation'
  const feature1Desc = pageData?.featureOneDesc || 'Three beautifully appointed rooms, each with modern amenities and traditional charm.'
  
  const feature2Title = pageData?.featureTwoTitle || 'Traditional Pub & Restaurant'
  const feature2Desc = pageData?.featureTwoDesc || 'Enjoy locally sourced food and fine ales in our historic pub with harbour views.'
  
  const feature3Title = pageData?.featureThreeTitle || 'Perfect Location'
  const feature3Desc = pageData?.featureThreeDesc || 'Situated in the heart of Porlock Weir with easy access to Exmoor National Park.'

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[75vh] md:h-screen w-full overflow-hidden">
        {/* Background Images Carousel */}
        <HeroCarousel images={heroImages} alt={heroAlt} />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center max-w-6xl mx-auto px-6">
            {/* Logo Overlay */}
            <div className="bg-white rounded-full w-32 h-32 md:w-64 md:h-64 mx-auto mb-4 md:mb-8 flex items-center justify-center shadow-2xl overflow-hidden p-4 md:p-6 relative">
              <img
                src="/images/the_ship_inn2.webp"
                alt="The Ship Inn Logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <h1 className="text-2xl md:text-4xl font-semibold mb-6 text-white text-shadow-lg">
              <span className="block">Welcome to</span>
              <span className="block text-yellow-300">The Ship Inn Porlock Weir</span>
            </h1>
            <p className="text-lg md:text-3xl mb-8 md:mb-12 text-white opacity-90 text-shadow-md">
              {strapline}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                href="/rooms"
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-sans font-bold px-9 py-4 rounded-full text-lg sm:text-xl shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2.5"
              >
                <svg className="w-5 h-5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>From the Cabins</span>
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white border-2 border-white/60 hover:border-white backdrop-blur-md font-sans font-semibold px-9 py-4 rounded-full text-lg sm:text-xl shadow-xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2.5"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Your Coastal Retreat in Porlock Weir
            </h2>
            <div className="text-xl text-gray-600 max-w-4xl mx-auto space-y-6 text-left md:text-center">
              {introParagraphs.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mt-12">
            <TrackedFeatureCard
              href="/rooms"
              featureKey="Accommodation"
              title={feature1Title}
              description={feature1Desc}
              buttonText="Explore Our Rooms"
              iconGradient="bg-gradient-to-br from-blue-500 to-blue-700 text-white"
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            />

            <TrackedFeatureCard
              href="/food-drink"
              featureKey="Pub & Restaurant"
              title={feature2Title}
              description={feature2Desc}
              buttonText="View Food & Menus"
              iconGradient="bg-gradient-to-br from-teal-500 to-teal-700 text-white"
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <TrackedFeatureCard
              href="/things-to-do"
              featureKey="Location & Things to Do"
              title={feature3Title}
              description={feature3Desc}
              buttonText="Discover Things to Do"
              iconGradient="bg-gradient-to-br from-green-500 to-green-700 text-white"
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-ship-blue-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <span className="inline-block bg-yellow-400/20 text-yellow-300 font-sans font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-yellow-400/30">
            Visit Porlock Weir
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to Experience The Ship Inn?
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Contact us today and discover why guests return year after year to our historic coastal retreat.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              href="/rooms"
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-sans font-bold px-9 py-4 rounded-2xl shadow-xl shadow-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/30 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2.5 text-lg"
            >
              <svg className="w-5 h-5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>From the Cabins</span>
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/60 backdrop-blur-md font-sans font-semibold px-9 py-4 rounded-2xl shadow-lg hover:shadow-white/10 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2.5 text-lg"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contact us</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  )
}
