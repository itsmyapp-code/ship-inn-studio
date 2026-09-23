

import Link from 'next/link'
import Image from 'next/image'
import RoomGallery from '@/components/RoomGallery'
import { getPageData, getSharedContactData } from '@/lib/outstatic'
import { TrackedPhoneLink, TrackedEmailLink } from '@/components/TrackedContactLinks'

export const metadata = {
  title: 'From the Cabins - The Ship Inn Porlock Weir',
  description: 'Discover our three beautifully appointed guest rooms, each offering modern comfort with traditional charm in the heart of Porlock Weir.',
}

export default function RoomsPage() {
  const rooms = [
    {
      id: 1,
      name: "Guest Room 1",
      description: "A beautifully appointed en-suite room finished to a high, comfortable standard.",
      features: ["En-suite bathroom", "Tea/coffee facilities", "Digital TV", "Free Wi-Fi"],
      price: "Contact for rates",
      images: [
        {
          src: "/images/shipinn-031.webp",
          alt: "Guest Room 1",
          caption: "Comfortable accommodation at The Ship Inn"
        },
        {
          src: "/images/shipinn-197.webp",
          alt: "Guest Room 1",
          caption: "Comfortable accommodation at The Ship Inn"
        },
        {
          src: "/images/shipinn-035.webp",
          alt: "Guest Room 1",
          caption: "Comfortable accommodation at The Ship Inn"
        }
      ]
    },
    {
      id: 2,
      name: "Guest Room 2",
      description: "A beautifully appointed en-suite room finished to a high, comfortable standard.",
      features: ["En-suite bathroom", "Tea/coffee facilities", "Digital TV", "Free Wi-Fi"],
      price: "Contact for rates",
      images: [
        {
          src: "/images/shipinn-124.webp",
          alt: "Guest Room 2",
          caption: "Comfortable accommodation at The Ship Inn"
        },
        {
          src: "/images/shipinn-039.webp",
          alt: "Guest Room 2",
          caption: "Comfortable accommodation at The Ship Inn"
        },
        {
          src: "/images/shipinn-106.webp",
          alt: "Guest Room 2",
          caption: "Comfortable accommodation at The Ship Inn"
        }
      ]
    },
    {
      id: 3,
      name: "Guest Room 3",
      description: "A beautifully appointed en-suite room finished to a high, comfortable standard.",
      features: ["En-suite bathroom", "Tea/coffee facilities", "Digital TV", "Free Wi-Fi"],
      price: "Contact for rates",
      images: [
        {
          src: "/images/IMG_4416.webp",
          alt: "Guest Room 3",
          caption: "Comfortable accommodation at The Ship Inn"
        },
        {
          src: "/images/shipinn-042.webp",
          alt: "Guest Room 3",
          caption: "Comfortable accommodation at The Ship Inn"
        },
        {
          src: "/images/shipinn-079.webp",
          alt: "Guest Room 3",
          caption: "Comfortable accommodation at The Ship Inn"
        },
        {
          src: "/images/shipinn-070.webp",
          alt: "Guest Room 3",
          caption: "Comfortable accommodation at The Ship Inn"
        }
      ]
    }
  ]

  const pageData = getPageData('rooms')
  const contactData = getSharedContactData()

  const heroImage = pageData?.coverImage
  const heroAlt = pageData?.heroAlt || 'The Ship Inn Guest Room'

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-ship-blue-600 flex items-center justify-center overflow-hidden">
        {heroImage && (
          <>
            <Image
              src={heroImage}
              alt={heroAlt}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </>
        )}
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">From the Cabins</h1>
          <p className="text-xl">A warm and welcoming place to unwind</p>
        </div>
      </section>

      {/* Rooms Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Comfortable Accommodation</h2>
            <div className="text-lg text-gray-600 max-w-4xl mx-auto space-y-4">
              <p>
                We have three double/twin en-suite rooms, all recently refurbished and finished to a high, comfortable standard. Each room is thoughtfully equipped with tea and coffee facilities and digital TV, making them ideal for a relaxed overnight stay whether you’re passing through or planning a longer break. Well-behaved dogs are always welcome, so your four-legged companions can enjoy the adventure too.
              </p>
              <p>
                Whether you’re here for the walking, the views, or simply the calm coastal atmosphere, The Ship Inn at Porlock Weir offers a warm and welcoming place to unwind.
              </p>
            </div>
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
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-ship-blue-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-yellow-400/20 text-yellow-300 font-sans font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-yellow-400/30">
            Direct Booking &amp; Best Rates
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">Ready to Stay With Us?</h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Contact us directly to check availability, secure the best guaranteed rates, and plan your coastal getaway in Porlock Weir.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <TrackedPhoneLink
              phone={contactData.phone}
              location="rooms_booking_cta"
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-sans font-bold px-9 py-4 rounded-2xl shadow-xl shadow-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/30 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-3 text-lg"
            >
              <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Call Us: {contactData.phone}</span>
            </TrackedPhoneLink>

            <Link
              href="/contact"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/60 backdrop-blur-md font-sans font-semibold px-9 py-4 rounded-2xl shadow-lg hover:shadow-white/10 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-3 text-lg"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Send Room Enquiry</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
