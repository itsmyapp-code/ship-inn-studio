


export const metadata = {
  title: 'Things to do - The Ship Inn Porlock Weir',
  description: 'Discover the best of Porlock Weir and Exmoor National Park. From coastal walks to historic villages, your guide to West Somerset adventures.',
}

export default function ThingsToDoPage() {
  const activities = [
    {
      category: "Coastal Adventures",
      items: [
        {
          name: "South West Coast Path",
          description: "World-class cliff-top walking with stunning views over the Bristol Channel.",
          distance: "On your doorstep",
          duration: "1-8 hours"
        },
        {
          name: "Porlock Beach",
          description: "Pebble beach perfect for fossil hunting and rock pooling.",
          distance: "5 minutes walk",
          duration: "Half day"
        },
        {
          name: "Hurlstone Point",
          description: "Dramatic coastal headland with panoramic sea views.",
          distance: "2 miles",
          duration: "2-3 hours"
        }
      ]
    },
    {
      category: "Exmoor Exploration",
      items: [
        {
          name: "Dunkery Beacon",
          description: "Exmoor's highest point with 360° views across the moor and sea.",
          distance: "8 miles",
          duration: "Half day"
        },
        {
          name: "Tarr Steps",
          description: "Ancient clapper bridge over the River Barle in beautiful woodland.",
          distance: "12 miles",
          duration: "Half day"
        },
        {
          name: "Exmoor Ponies",
          description: "Spot wild ponies roaming freely across the open moorland.",
          distance: "Various locations",
          duration: "Ongoing"
        }
      ]
    },
    {
      category: "Historic Villages",
      items: [
        {
          name: "Porlock Village",
          description: "Charming thatched village with medieval church and local shops.",
          distance: "1 mile",
          duration: "2-3 hours"
        },
        {
          name: "Dunster",
          description: "Medieval castle town with cobbled streets and yarn market.",
          distance: "8 miles",
          duration: "Full day"
        },
        {
          name: "Lynton & Lynmouth",
          description: "Victorian seaside resorts connected by cliff railway.",
          distance: "15 miles",
          duration: "Full day"
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-ship-green-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Things to do</h1>
          <p className="text-xl">Your gateway to Exmoor National Park and the Somerset coast</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Explore Our Beautiful Corner of England</h2>
            <div className="text-lg text-gray-600 max-w-4xl mx-auto space-y-6">
              <p>
                Porlock Weir is the perfect base for exploring the beauty of Exmoor and the surrounding coast. Enjoy scenic local walks, discover charming villages, or follow in the footsteps of Lorna Doone. For a different perspective, take a sea trip on one of the local boats, or get your adrenaline fix with Exmoor Adventures’ activities nearby.
              </p>
              <p>
                Whether you prefer relaxing by the harbour, taking in the stunning views, or trying something more adventurous, there’s plenty to see and do for all ages.
              </p>
              <div className="pt-4">
                <a 
                  href="https://www.porlock.co.uk/walking/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-ship-green-700 hover:text-ship-green-800 font-semibold underline decoration-2 underline-offset-4"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.827a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Discover local walks in and around Porlock
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities by Category */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activities.map((category, index) => (
            <div key={index} className="mb-16 last:mb-0">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{category.category}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden ship-card-hover">
                    <div className="h-48 bg-ship-green-200"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span><strong>Distance:</strong> {item.distance}</span>
                        <span><strong>Duration:</strong> {item.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Local Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Local Tips & Recommendations</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-ship-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Best Time to Visit</h3>
                  <p className="text-gray-600">Early morning or late afternoon for the best light and fewer crowds on popular walks.</p>
                </div>
                <div className="border-l-4 border-ship-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Weather Preparation</h3>
                  <p className="text-gray-600">Exmoor weather can change quickly - always pack waterproofs and warm layers.</p>
                </div>
                <div className="border-l-4 border-ship-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Walking Boots Essential</h3>
                  <p className="text-gray-600">Many paths can be muddy and uneven - proper footwear makes all the difference.</p>
                </div>
                <div className="border-l-4 border-ship-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Parking Information</h3>
                  <p className="text-gray-600">We can provide details on parking locations and any seasonal restrictions.</p>
                </div>
              </div>
            </div>
            <img 
              src="/images/location/porlock-weir-harbour.png" 
              alt="Porlock Weir Harbour"
              className="h-96 w-full object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Seasonal Activities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Seasonal Highlights</h2>
            <p className="text-lg text-gray-600">Different times of year offer unique experiences on Exmoor</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Spring</h3>
              <p className="text-gray-600 text-sm">Bluebells, lambing season, mild weather perfect for walking</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Summer</h3>
              <p className="text-gray-600 text-sm">Long days, heather in bloom, perfect for coastal walks</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Autumn</h3>
              <p className="text-gray-600 text-sm">Stunning colors, red deer rutting, clear skies</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Winter</h3>
              <p className="text-gray-600 text-sm">Dramatic storms, cozy pub evenings, crisp clear days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Your Visit */}
      <section className="py-16 bg-ship-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Need Help Planning Your Adventures?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Our local knowledge is at your disposal. We're happy to provide maps, route suggestions, 
            and insider tips to make the most of your stay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white hover:bg-gray-100 text-ship-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
              Download Walking Guide
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-ship-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Local Maps
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
