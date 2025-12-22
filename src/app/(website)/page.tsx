import Link from 'next/link'
import NewsletterSignup from '@/components/NewsletterSignup'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/exterior/ship-inn-front-view.png')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center max-w-6xl mx-auto px-6">
            {/* Logo Overlay */}
            <div className="bg-white rounded-full w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 flex items-center justify-center shadow-2xl overflow-hidden p-6">
              <img 
                src="/images/logo/the_ship_inn2.png" 
                alt="The Ship Inn Logo" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <h1 className="text-2xl md:text-4xl font-semibold mb-6 text-white">
              <span className="block">Welcome to</span>
              <span className="block text-yellow-300">The Ship Inn Porlock Weir</span>
            </h1>
            <p className="text-xl md:text-3xl mb-12 text-white opacity-90">
              Historic charm meets modern comfort
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/rooms"
                className="bg-white hover:bg-gray-100 text-blue-900 px-10 py-4 rounded-full text-xl font-bold transition-all duration-300 shadow-lg"
              >
                From the Cabins
              </Link>
              <Link
                href="/contact"
                className="border-4 border-white bg-transparent hover:bg-white text-white hover:text-blue-900 px-10 py-4 rounded-full text-xl font-bold transition-all duration-300"
              >
                Contact us
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
              <p>
                Nestled in the heart of the stunning Exmoor coast, The Ship Inn at Porlock Weir is more than just a pub—it's a destination, a retreat, and a warm welcome at the edge of the sea. With roots tracing back over 200 years, our historic inn has long been a haven for weary travellers, sailors, walkers, and locals alike.
              </p>
              <p>
                Set against the dramatic backdrop of Porlock Bay and the ancient woodland of Exmoor National Park, The Ship Inn blends timeless charm with modern comfort. Whether you’re dropping in for a pint of local ale, a hearty meal or staying the night in one of our cosy rooms, you'll feel the character and history.
              </p>
              <p>
                In the summertime, our outdoor tables offer some of the best views on the coast—perfect for enjoying a cold drink, a leisurely lunch, or simply watching the boats drift by as the sun sets over the harbour.
              </p>
              <p>
                At our core, we’re all about relaxed hospitality. Log fires, sea views, good conversation, and great food, these are the ingredients we believe make a perfect visit. We’re proud to champion West Country suppliers and seasonal menus.
              </p>
              <p>
                Whether you're exploring the South West Coast Path or simply soaking in the peaceful harbour setting, The Ship Inn is your home by the sea.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Comfortable Accommodation</h3>
              <p className="text-gray-600 text-lg">Five beautifully appointed rooms, each with modern amenities and traditional charm.</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-teal-500 to-teal-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Traditional Pub & Restaurant</h3>
              <p className="text-gray-600 text-lg">Enjoy locally sourced food and fine ales in our historic pub with harbour views.</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Perfect Location</h3>
              <p className="text-gray-600 text-lg">Situated in the heart of Porlock Weir with easy access to Exmoor National Park.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience The Ship Inn?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us today and discover why guests return year after year to our coastal retreat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rooms"
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300"
            >
              From the Cabins
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white bg-transparent hover:bg-white text-white hover:text-blue-600 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  )
}
