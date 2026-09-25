

import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import { getPageData, getSharedContactData, getMenusData } from '@/lib/outstatic'
import { TrackedPhoneLink, TrackedEmailLink, TrackedMenuLink, TrackedPromoLink } from '@/components/TrackedContactLinks'

interface MenuDisplayItem {
  title: string
  subtitle?: string
  path: string
}

function getMenus(): MenuDisplayItem[] {
  // 1. Try fetching menus from Outstatic CMS collection
  const outstaticMenus = getMenusData()
  if (outstaticMenus && outstaticMenus.length > 0) {
    return outstaticMenus.map(menu => {
      let menuPath = menu.pdfFile || menu.pdfUrl || ''
      if (menuPath && !menuPath.startsWith('http://') && !menuPath.startsWith('https://')) {
        menuPath = '/' + menuPath.replace(/^\/+/, '')
      }

      return {
        title: menu.title,
        subtitle: menu.subtitle,
        path: menuPath || `/menus/${menu.title}.pdf`
      }
    })
  }

  // 2. Fallback: scan public/menus directory if no Outstatic menus exist
  const menusDirectory = path.join(process.cwd(), 'public/menus')
  if (!fs.existsSync(menusDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(menusDirectory)
  return fileNames
    .filter(fileName => fileName.toLowerCase().endsWith('.pdf'))
    .map(fileName => {
      const title = fileName
        .replace(/\.pdf$/i, '')
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      return {
        title,
        path: `/menus/${fileName}`
      }
    })
}

export default function FoodDrinkPage() {
  const menus = getMenus()
  const pageData = getPageData('food-drink')
  const contactData = getSharedContactData()

  const heroImage = pageData?.coverImage || '/images/shipinn-204.webp'
  const heroAlt = pageData?.heroAlt || 'The Ship Inn Restaurant'

  const lagersList = pageData?.lagers ? pageData.lagers.split(',').map(s => s.trim()) : ["Estrella", "Carlsberg", "Peretti", "Budvar", "1664 Blanc"]
  const cidersList = pageData?.ciders ? pageData.ciders.split(',').map(s => s.trim()) : ["Thatchers", "Hawkstone", "Porlock Vale"]
  const alesList = pageData?.ales ? pageData.ales.split(',').map(s => s.trim()) : ["Otter Amber", "Guinness", "Exmoor Ale – changes weekly", "Hardings"]

  const drinkCategories = [
    {
      category: "Lagers",
      items: lagersList
    },
    {
      category: "Cider",
      items: cidersList
    },
    {
      category: "Ales",
      items: alesList
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-ship-blue-600 flex items-center justify-center overflow-hidden">
        <Image
          src={heroImage}
          alt={heroAlt}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">From the Galley & Saloon</h1>
          <p className="text-xl">A true taste of the region in welcoming surroundings</p>
        </div>
      </section>

      {/* Top BBQ Promo Card */}
      <section className="bg-amber-50/40 border-b border-amber-100 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
              {/* Glowing Thumbnail */}
              <TrackedPromoLink promoName="Saturday BBQ Thumbnail" href="#bbq" className="relative block group shrink-0">
                <div className="relative w-[85px] h-[120px] rounded-lg overflow-hidden border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.8)] transition-all duration-300 transform group-hover:scale-105">
                  <Image
                    src="/images/Ship_Inn_BBQ.jpg"
                    alt="BBQ Every Saturday"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Pulsing glow ring */}
                <div className="absolute inset-0 rounded-lg border-2 border-amber-400 opacity-75 group-hover:opacity-100 animate-pulse pointer-events-none"></div>
              </TrackedPromoLink>
              <div>
                <span className="inline-block bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                  Weekend Event
                </span>
                <h3 className="text-lg font-bold text-gray-900 font-centaur">
                  Saturday BBQ / Braai!
                </h3>
                <p className="text-sm text-gray-600">
                  Firing up the grill from 2pm–5pm at The Ship Inn. Good food, cold drinks, and sea views.
                </p>
              </div>
            </div>
            <TrackedPromoLink
              promoName="Explore BBQ Button"
              href="#bbq"
              className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-colors whitespace-nowrap"
            >
              <span>Explore BBQ</span>
              <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </TrackedPromoLink>
          </div>
        </div>
      </section>

      {/* Restaurant Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Ship Inn Restaurant</h2>
              <div className="text-lg text-gray-600 space-y-4">
                <p>
                  {pageData?.foodDrinkIntroOne || "We celebrate the very best of local and national drinks, alongside seasonal food. Enjoy a refreshing Hawkstone cider, a perfectly poured Guinness, or a classic 1664 while soaking up the coastal atmosphere."}
                </p>
                <p>
                  {pageData?.foodDrinkIntroTwo || "Our menu is built around fresh, seasonal ingredients, changing with the time of year to bring you honest, flavourful dishes. Whether it’s a relaxed drink at the bar or a leisurely meal, you’ll find welcoming surroundings and a true taste of the region."}
                </p>
              </div>
            </div>
            <img
              src="/images/shipinn-204.webp"
              alt="The Ship Inn Restaurant"
              className="h-96 w-full object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Downloadable Menus Section */}
      {menus.length > 0 && (
        <section className="py-12 bg-ship-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Menus</h2>
              <p className="text-lg text-gray-600">Explore our menus and discover daily specials, freshly updated on the blackboard in the pub.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {menus.map((menu, index) => (
                <TrackedMenuLink
                  key={index}
                  menuTitle={menu.title}
                  menuUrl={menu.path}
                  className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 group border border-gray-100 cursor-pointer"
                >
                  <div className="bg-ship-blue-100 p-2 rounded-full group-hover:bg-ship-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <title>PDF Icon</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold text-gray-900 group-hover:text-ship-blue-600 transition-colors">{menu.title}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {menu.subtitle ? `${menu.subtitle} • PDF Menu` : 'PDF Menu'}
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-ship-blue-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </TrackedMenuLink>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* Drinks Section */}
      <section className="py-16 bg-white">
        {/* ... existing drinks content ... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Drinks & Bar</h2>
            <p className="text-lg text-gray-600">Local ales, fine wines, and classic spirits</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <img
              src="/images/shipinn-217.webp"
              alt="The Ship Inn Bar Area"
              className="h-96 w-full object-cover rounded-lg"
            />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Selection</h3>
              <p className="text-lg text-gray-600 mb-6">
                Our bar features a carefully curated selection of local and national drinks, including regional ales and traditional cider, complemented by a carefully selected wine list, a great range of beers, and quality spirits.
              </p>

              <div className="space-y-6">
                {drinkCategories.map((group, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-ship-blue-600 text-lg mb-2 flex items-center">
                      {group.category}
                      <span className="ml-3 h-px flex-grow bg-ship-blue-100"></span>
                    </h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {group.items.map((item, idx) => (
                        <li key={idx} className="text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-ship-green-400 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BBQ/Braai Section */}
      <section id="bbq" className="py-16 md:py-24 bg-amber-50/40 scroll-mt-20 border-t border-b border-amber-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <span className="text-amber-800 font-semibold uppercase tracking-widest text-xs bg-amber-100/60 px-3 py-1.5 rounded-full inline-block mb-4 border border-amber-200/50">
              Weekend Events
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-centaur text-gray-900 mb-6 leading-tight">
              BBQ / Braai!
            </h2>
            <div className="space-y-4 md:space-y-6">
              <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed">
                We’ll be firing up the grill from <span className="text-amber-700 font-semibold whitespace-nowrap">2pm–5pm</span> at The Ship Inn, Porlock Weir.
              </p>
              <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
                Good food, cold drinks, sea views and that unmistakable smell of the BBQ… what better way to spend a Saturday? ☀️🍻🌊
              </p>
              <div className="pt-2 md:pt-4">
                <span className="inline-block text-lg md:text-xl text-ship-blue-700 font-semibold bg-white border border-ship-blue-100 shadow-sm px-6 py-2.5 rounded-xl">
                  Come hungry — we’ll take care of the rest!
                </span>
              </div>
            </div>
          </div>

          {/* Grid of BBQ images (Stacks on mobile, 3 columns on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-64 sm:h-72 md:h-80 w-full">
                <Image
                  src="/images/seafood%20bbq.webp"
                  alt="Fresh Seafood BBQ at The Ship Inn"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-w-768px) 100vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-medium text-lg tracking-wide">Fresh Seafood Grill</span>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-64 sm:h-72 md:h-80 w-full">
                <Image
                  src="/images/seaFOOD%20bbq%202.webp"
                  alt="Sizzling Lobster and Sea Food Braai"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-w-768px) 100vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-medium text-lg tracking-wide">Local Coastal Flavours</span>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-64 sm:h-72 md:h-80 w-full">
                <Image
                  src="/images/bbq%20board.webp"
                  alt="Saturday BBQ Menu"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-w-768px) 100vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-medium text-lg tracking-wide">Saturday BBQ Menu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breakfast Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Breakfast</h2>
            <p className="text-lg text-gray-600">Start your day the right way</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Breakfast at The Ship Inn</h3>
              <p className="text-lg text-gray-600 mb-6">
                {pageData?.breakfastDescription || "Included with all room bookings, our hearty breakfast features the best local produce to fuel your Exmoor adventures."}
              </p>

              <div className="space-y-2 text-gray-600 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-ship-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full English options
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-ship-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Locally sourced ingredients
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-ship-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Freshly prepared to order
                </div>
              </div>

              <p className="text-gray-600">
                <strong>Serving Times:</strong> {pageData?.breakfastTimes || "8am - 10am (Residents Only)"}<br />
                Dietary requirements catered for upon request.
              </p>
            </div>
            <img
              src="/images/shipinn-225.webp"
              alt="Breakfast at The Ship Inn"
              className="h-96 w-full object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-ship-blue-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-yellow-400/20 text-yellow-300 font-sans font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-yellow-400/30">
            Table Reservations &amp; Enquiries
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">Dine With Us</h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Reserve your table for an unforgettable dining experience featuring fresh Exmoor produce and fine local ales overlooking Porlock Weir harbour.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <TrackedPhoneLink
              phone={contactData.phone}
              location="food_drink_cta"
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-sans font-bold px-9 py-4 rounded-2xl shadow-xl shadow-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/30 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-3 text-lg"
            >
              <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Call to Reserve: {contactData.phone}</span>
            </TrackedPhoneLink>

            <TrackedEmailLink
              email={contactData.email}
              location="food_drink_cta"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/60 backdrop-blur-md font-sans font-semibold px-9 py-4 rounded-2xl shadow-lg hover:shadow-white/10 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-3 text-lg"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email Dining Enquiry</span>
            </TrackedEmailLink>
          </div>
        </div>
      </section>
    </div>
  )
}
