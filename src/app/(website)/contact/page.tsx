import ContactForm from '@/components/ContactForm'
import Image from 'next/image'
import { getPageData } from '@/lib/outstatic'

export const metadata = {
  title: 'Contact us - The Ship Inn Porlock Weir',
  description: 'Get in touch with The Ship Inn for bookings, enquiries, or directions. Located in the heart of Porlock Weir, Somerset.',
}

export default function ContactPage() {
  const pageData = getPageData('contact')

  const heroImage = pageData?.coverImage || '/images/shipinn-012.webp'
  const heroAlt = pageData?.heroAlt || 'The Ship Inn Side View'
  
  const phone = pageData?.phone || '01643 863288'
  const email = pageData?.email || 'hello@theshipinnporlockweir.co.uk'
  const addressLine1 = pageData?.addressLineOne || 'The Ship Inn'
  const addressLine2 = pageData?.addressLineTwo || 'Porlock Weir'
  const town = pageData?.town || 'Minehead, Somerset'
  const postcode = pageData?.postcode || 'TA24 8PB'

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact us</h1>
          <p className="text-xl">Get in touch or visit us in beautiful Porlock Weir</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-ship-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">
                      <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-ship-blue-600 transition-colors">{phone}</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-ship-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">
                      <a href={`mailto:${email}`} className="hover:text-ship-blue-600 transition-colors break-all">{email}</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-ship-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">
                      {addressLine1}<br />
                      {addressLine2}<br />
                      {town}<br />
                      {postcode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start pt-4 border-t border-gray-100">
                  <div className="bg-ship-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Opening Hours</h3>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p>Bar: {pageData?.openingHoursMon || '11:00 AM - 11:00 PM'}</p>
                      <p>{pageData?.kitchenClose || 'Food served: 12:00 PM - 9:00 PM'}</p>
                      <p>{pageData?.breakfastTimes || 'Breakfast: 8:00 AM - 10:00 AM (Residents only)'}</p>
                      {pageData?.seasonalNote && (
                        <p className="text-xs text-gray-500 italic mt-2">{pageData.seasonalNote}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="mb-12">
                <img
                  src={heroImage}
                  alt={heroAlt}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-lg text-gray-600">Located in the heart of Porlock Weir</p>
          </div>

          {/* Map Section */}
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg mb-12">
            <iframe
              src="https://www.google.com/maps?q=The%20Ship%20Inn%20Porlock%20Weir%20TA24%208PB&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Ship Inn Location"
            ></iframe>
          </div>

          {/* Directions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-ship-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">By Car</h3>
              <p className="text-gray-600 text-sm">
                From A39, follow signs to Porlock then Porlock Weir.
                Limited parking available on-site and in village.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-ship-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">By Public Transport</h3>
              <p className="text-gray-600 text-sm">
                Bus services from Minehead and Lynton.
                Nearest railway station is Taunton (45 minutes drive).
              </p>
            </div>

            <div className="text-center">
              <div className="bg-ship-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Parking</h3>
              <p className="text-gray-600 text-sm">
                Limited on-site parking available. Additional parking in village car park
                (2 minutes walk). Free for guests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-ship-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Visit?</h2>
          <p className="text-xl text-ship-blue-100 mb-8">
            Contact us directly for stay or table reservations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="bg-white hover:bg-gray-100 text-ship-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Call Now: {phone}
            </a>
            <a
              href={`mailto:${email}`}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-ship-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Send Email
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
