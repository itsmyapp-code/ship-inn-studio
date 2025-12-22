


export const metadata = {
  title: 'From the Galley & Saloon - The Ship Inn Porlock Weir',
  description: 'Enjoy fresh local seafood, traditional pub classics, and fine ales at The Ship Inn. Our restaurant and bar offer the best of Somerset cuisine with stunning harbour views.',
}

export default function FoodDrinkPage() {
  const menuSections = [
    {
      title: "Fresh From The Sea",
      description: "Daily catch from local fishing boats",
      items: [
        { name: "Pan-fried Local Sole", description: "With samphire and lemon butter", price: "£18.95" },
        { name: "Crab Cakes", description: "With mixed leaves and marie rose sauce", price: "£12.95" },
        { name: "Fish & Chips", description: "Beer battered cod with triple-cooked chips", price: "£14.95" },
        { name: "Seafood Platter", description: "Selection of local seafood for two", price: "£32.95" }
      ]
    },
    {
      title: "From The Land",
      description: "Using the finest Exmoor and Somerset produce",
      items: [
        { name: "Exmoor Lamb", description: "Slow roasted with rosemary and garlic", price: "£19.95" },
        { name: "Somerset Beef", description: "8oz sirloin with peppercorn sauce", price: "£22.95" },
        { name: "Free-Range Chicken", description: "Pan-roasted with wild mushrooms", price: "£16.95" },
        { name: "Vegetarian Wellington", description: "Seasonal vegetables in puff pastry", price: "£14.95" }
      ]
    },
    {
      title: "Traditional Pub Classics",
      description: "Hearty comfort food done well",
      items: [
        { name: "Steak & Kidney Pie", description: "With buttery mashed potato", price: "£13.95" },
        { name: "Bangers & Mash", description: "Local sausages with onion gravy", price: "£11.95" },
        { name: "Ploughman's Lunch", description: "Local cheese, ham, and pickles", price: "£9.95" },
        { name: "Somerset Burger", description: "With mature cheddar and bacon", price: "£12.95" }
      ]
    }
  ]

  const drinks = [
    { name: "Exmoor Ale", description: "Local brewery favorite", type: "Ale" },
    { name: "Somerset Cider", description: "Traditional farmhouse cider", type: "Cider" },
    { name: "Sharp's Doom Bar", description: "Cornwall's finest", type: "Ale" },
    { name: "Guinness", description: "The black stuff", type: "Stout" },
    { name: "House Wine", description: "Red, white, or rosé", type: "Wine" },
    { name: "Champagne", description: "For special occasions", type: "Sparkling" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-ship-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">From the Galley & Saloon</h1>
          <p className="text-xl">Fresh local ingredients, traditional recipes, warm hospitality</p>
        </div>
      </section>

      {/* Restaurant Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Ship Inn Restaurant</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our restaurant celebrates the finest that Somerset and the West Country have to offer. 
                From fresh seafood landed at nearby harbours to premium meat from Exmoor farms, 
                every dish tells the story of our beautiful region.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Dine in our cozy restaurant with views over Porlock Weir's picturesque harbour, 
                or enjoy a drink in our traditional bar with its warming log fire and maritime charm.
              </p>
            </div>
            <div className="h-96 bg-ship-blue-200 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Menu</h2>
            <p className="text-lg text-gray-600">Seasonal menus featuring the best local produce</p>
          </div>

          <div className="space-y-12">
            {menuSections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h3>
                  <p className="text-gray-600">{section.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      </div>
                      <span className="font-bold text-ship-blue-600 ml-4">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Drinks Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Drinks & Bar</h2>
            <p className="text-lg text-gray-600">Local ales, fine wines, and classic spirits</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <img 
              src="/images/interior/bar-area.png" 
              alt="The Ship Inn Bar Area"
              className="h-96 w-full object-cover rounded-lg"
            />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Selection</h3>
              <p className="text-lg text-gray-600 mb-6">
                Our bar features a carefully curated selection of local ales, including favorites 
                from Exmoor Brewery, alongside traditional Somerset ciders and a well-chosen wine list.
              </p>
              
              <div className="space-y-3">
                {drinks.map((drink, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div>
                      <h4 className="font-semibold text-gray-900">{drink.name}</h4>
                      <p className="text-gray-600 text-sm">{drink.description}</p>
                    </div>
                    <span className="text-sm text-ship-blue-600 font-medium px-2 py-1 bg-ship-blue-50 rounded">
                      {drink.type}
                    </span>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Full Somerset Breakfast</h3>
              <p className="text-lg text-gray-600 mb-6">
                Included with all room bookings, our hearty breakfast features the best local produce 
                to fuel your Exmoor adventures.
              </p>
              
              <div className="space-y-2 text-gray-600 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-ship-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Local farm sausages and bacon
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-ship-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free-range eggs cooked to order
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-ship-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Black pudding and grilled tomatoes
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-ship-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Baked beans and sautéed mushrooms
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-ship-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Fresh toast and preserves
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-ship-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Fresh fruit and cereal selection
                </div>
              </div>
              
              <p className="text-gray-600">
                <strong>Serving Times:</strong> 08:00 - 09:30 daily<br/>
                Continental options and dietary requirements catered for.
              </p>
            </div>
            <div className="h-96 bg-ship-blue-200 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-16 bg-ship-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Book Your Table</h2>
          <p className="text-xl text-blue-100 mb-8">
            Reserve your table for an unforgettable dining experience overlooking Porlock Weir harbour.
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
