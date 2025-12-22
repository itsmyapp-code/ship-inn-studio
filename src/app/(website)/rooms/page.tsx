

import Link from 'next/link'
import RoomGallery from '@/components/RoomGallery'

export const metadata = {
  title: 'From the Cabins - The Ship Inn Porlock Weir',
  description: 'Discover our five beautifully appointed guest rooms, each offering modern comfort with traditional charm in the heart of Porlock Weir.',
}

export default function RoomsPage() {
  const rooms = [
    {
      id: 1,
      name: "The Harbour Room",
      description: "Our largest room with spectacular harbour views and a comfortable king-size bed.",
      features: ["King-size bed", "Harbour views", "En-suite bathroom", "Tea/coffee facilities", "Free Wi-Fi"],
      price: "£120/night",
      images: [
        {
          src: "/images/rooms/harbour-room-bed01.png",
          alt: "The Harbour Room - Comfortable King-size Bed",
          caption: "Spacious king-size bed with harbour views"
        },
        {
          src: "/images/rooms/harbour-room-bed02.png",
          alt: "The Harbour Room - Alternative View",
          caption: "Another angle of the comfortable accommodation"
        }
      ]
    },
    {
      id: 2,
      name: "The Weir Room",
      description: "Cozy double room overlooking the weir with traditional maritime décor.",
      features: ["Double bed", "Weir views", "En-suite shower", "Tea/coffee facilities", "Free Wi-Fi"],
      price: "£95/night",
      images: []
    },
    {
      id: 3,
      name: "The Cottage Room",
      description: "Charming room with period features and a comfortable double bed.",
      features: ["Double bed", "Garden views", "En-suite bathroom", "Tea/coffee facilities", "Free Wi-Fi"],
      price: "£90/night",
      images: []
    },
    {
      id: 4,
      name: "The Moor Room",
      description: "Comfortable twin room perfect for friends or family members.",
      features: ["Twin beds", "Countryside views", "En-suite shower", "Tea/coffee facilities", "Free Wi-Fi"],
      price: "£85/night",
      images: []
    },
    {
      id: 5,
      name: "The Captain's Room",
      description: "Our most characterful room with maritime antiques and harbour glimpses.",
      features: ["Double bed", "Period features", "En-suite bathroom", "Tea/coffee facilities", "Free Wi-Fi"],
      price: "£100/night",
      images: []
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-ship-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">From the Cabins</h1>
          <p className="text-xl">Five unique rooms, each with its own character and charm</p>
        </div>
      </section>

      {/* Rooms Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comfortable Accommodation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each of our guest rooms has been thoughtfully designed to offer modern comfort 
              while maintaining the historic character of this beautiful 18th-century inn.
            </p>
          </div>

          {/* Room Cards */}
          <div className="space-y-12">
            {rooms.map((room) => (
              <div key={room.id} id={`room-${room.id}`} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <RoomGallery images={room.images} roomName={room.name} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{room.name}</h3>
                  <p className="text-gray-600 mb-4">{room.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Room Features:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {room.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 text-ship-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-ship-blue-600">{room.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Guest Amenities</h2>
            <p className="text-lg text-gray-600">Everything you need for a comfortable stay</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-ship-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Wi-Fi</h3>
              <p className="text-gray-600 text-sm">High-speed internet throughout the property</p>
            </div>

            <div className="text-center">
              <div className="bg-ship-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Full English Breakfast</h3>
              <p className="text-gray-600 text-sm">Included with all room bookings</p>
            </div>

            <div className="text-center">
              <div className="bg-ship-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Daily Housekeeping</h3>
              <p className="text-gray-600 text-sm">Fresh towels and room service daily</p>
            </div>

            <div className="text-center">
              <div className="bg-ship-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Amenities</h3>
              <p className="text-gray-600 text-sm">Quality toiletries and fresh linens</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-16 bg-ship-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Stay?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us directly for the best rates and to check availability for your preferred dates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="tel:01643863288"
              className="bg-white hover:bg-gray-100 text-ship-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Call Us: 01643 863288
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
