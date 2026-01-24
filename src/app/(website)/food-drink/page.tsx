

import fs from 'fs'
import path from 'path'

// ... metadata ...

function getMenus() {
  const menusDirectory = path.join(process.cwd(), 'public/menus')

  if (!fs.existsSync(menusDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(menusDirectory)
  const menus = fileNames
    .filter(fileName => fileName.toLowerCase().endsWith('.pdf'))
    .map(fileName => {
      // Create a nice title from the filename
      // e.g., "lunch-menu.pdf" -> "Lunch Menu"
      const title = fileName
        .replace(/\.pdf$/i, '')
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      return {
        title,
        fileName,
        path: `/menus/${fileName}`
      }
    })

  return menus
}

export default function FoodDrinkPage() {
  const menus = getMenus()



  // ... existing drinks ...
  const drinkCategories = [
    {
      category: "Lagers",
      items: ["Estrella", "Carlsberg", "Peretti", "Budvar", "1664 Blanc"]
    },
    {
      category: "Cider",
      items: ["Thatchers", "Hawkstone", "Porlock Vale"]
    },
    {
      category: "Ales",
      items: ["Otter Amber", "Guinness", "Exmoor Ale – changes weekly", "Hardings"]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-ship-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">From the Galley & Saloon</h1>
          <p className="text-xl">A true taste of the region in welcoming surroundings</p>
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
                  We celebrate the very best of local and national drinks, alongside seasonal food. Enjoy a refreshing Hawkstone cider, a perfectly poured Guinness, or a classic 1664 while soaking up the coastal atmosphere.
                </p>
                <p>
                  Our menu is built around fresh, seasonal ingredients, changing with the time of year to bring you honest, flavourful dishes. Whether it’s a relaxed drink at the bar or a leisurely meal, you’ll find welcoming surroundings and a true taste of the region.
                </p>
              </div>
            </div>
            <img
              src="/images/interior/shipinn-204.webp"
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
                <a
                  key={index}
                  href={menu.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 group border border-gray-100"
                >
                  <div className="bg-ship-blue-100 p-2 rounded-full group-hover:bg-ship-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <title>PDF Icon</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold text-gray-900 group-hover:text-ship-blue-600 transition-colors">{menu.title}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">PDF Menu</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-ship-blue-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
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
              src="/images/interior/shipinn-217.webp"
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
                Included with all room bookings, our hearty breakfast features the best local produce
                to fuel your Exmoor adventures.
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
                <strong>Serving Times:</strong> 8am - 10am (Residents Only)<br />
                Dietary requirements catered for upon request.
              </p>
            </div>
            <img
              src="/images/interior/shipinn-225.webp"
              alt="Breakfast at The Ship Inn"
              className="h-96 w-full object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-16 bg-ship-blue-600">
        {/* ... existing CTA ... */}
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Visit Us</h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us to reserve your table for an unforgettable dining experience overlooking Porlock Weir harbour.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:01643863288"
              className="bg-white hover:bg-gray-100 text-ship-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Call to Reserve: 01643 863288
            </a>
            <a
              href="mailto:hello@theshipinnporlockweir.co.uk"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-ship-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
