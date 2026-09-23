import ContactForm from '@/components/ContactForm'
import Image from 'next/image'
import { getPageData } from '@/lib/outstatic'
import {
  TrackedPhoneLink,
  TrackedEmailLink,
  TrackedDirectionsLink
} from '@/components/TrackedContactLinks'

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Details */}
            <div>
              <div className="mb-8">
                <span className="text-ship-blue-600 font-sans font-semibold text-sm tracking-wider uppercase">Direct Contact</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">Get in Touch</h2>
                <p className="text-gray-600 mt-2">We look forward to welcoming you to The Ship Inn. Reach out to us directly or drop us a message.</p>
              </div>

              <div className="space-y-4">
                {/* Phone Card */}
                <TrackedPhoneLink
                  phone={phone}
                  location="contact_page_details"
                  className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-ship-blue-300 bg-slate-50/70 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ship-blue-600 to-blue-800 text-white flex items-center justify-center shadow-md shadow-ship-blue-600/20 group-hover:scale-105 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-xs font-sans font-semibold text-gray-500 uppercase tracking-wider">Phone</span>
                      <span className="font-sans font-bold text-lg sm:text-xl text-gray-900 tracking-normal group-hover:text-ship-blue-600 transition-colors">
                        {phone}
                      </span>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-sans font-bold text-ship-blue-600 bg-ship-blue-50 px-3 py-1.5 rounded-full group-hover:bg-ship-blue-600 group-hover:text-white transition-all">
                    Call Now ➔
                  </span>
                </TrackedPhoneLink>

                {/* Email Card */}
                <TrackedEmailLink
                  email={email}
                  location="contact_page_details"
                  className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-ship-blue-300 bg-slate-50/70 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-blue-700/20 group-hover:scale-105 transition-transform shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-sans font-semibold text-gray-500 uppercase tracking-wider">Email</span>
                      <span className="font-sans font-medium text-base sm:text-lg text-gray-900 truncate block group-hover:text-ship-blue-600 transition-colors">
                        {email}
                      </span>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-sans font-bold text-ship-blue-600 bg-ship-blue-50 px-3 py-1.5 rounded-full group-hover:bg-ship-blue-600 group-hover:text-white transition-all shrink-0 ml-2">
                    Email Us ➔
                  </span>
                </TrackedEmailLink>

                {/* Address Card */}
                <div className="p-4 sm:p-5 rounded-2xl border border-gray-100 bg-slate-50/70">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-teal-600/20 shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans font-semibold text-gray-500 uppercase tracking-wider">Address</span>
                        <TrackedDirectionsLink
                          location="contact_address_card"
                          className="inline-flex items-center gap-1 text-xs font-sans font-bold text-ship-blue-600 hover:text-ship-blue-800 bg-white px-2.5 py-1 rounded-md border border-gray-200 hover:border-ship-blue-400 shadow-xs transition-all"
                        >
                          <span>Open in Maps</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </TrackedDirectionsLink>
                      </div>
                      <p className="text-gray-800 text-base font-medium mt-1">
                        {addressLine1}, {addressLine2}<br />
                        {town}, <span className="font-sans font-bold text-gray-900">{postcode}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Opening Hours Card */}
                <div className="p-4 sm:p-5 rounded-2xl border border-gray-100 bg-slate-50/70">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="block text-xs font-sans font-semibold text-gray-500 uppercase tracking-wider mb-2">Opening Hours</span>
                      <div className="space-y-1.5 text-sm text-gray-700 font-sans">
                        <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                          <span className="font-medium text-gray-900">Bar</span>
                          <span className="font-semibold text-ship-blue-900">{pageData?.openingHoursMon || '11:00 AM - 11:00 PM'}</span>
                        </div>
                        <div className="flex justify-between items-start py-1 border-b border-gray-200/60">
                          <span className="font-medium text-gray-900">Kitchen</span>
                          <span className="text-right font-medium text-gray-800 whitespace-pre-line">{pageData?.kitchenClose || 'Lunch: 12:00 - 14:15\nDinner: 18:00 - 20:15'}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="font-medium text-gray-900">Breakfast</span>
                          <span className="font-medium text-gray-800 flex items-center gap-1.5">
                            {pageData?.breakfastTimes || '8:00 AM - 10:00 AM'}
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Residents only</span>
                          </span>
                        </div>
                        {pageData?.seasonalNote && (
                          <p className="text-xs text-gray-500 italic pt-1">{pageData.seasonalNote}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-slate-100">
              <div className="mb-6 overflow-hidden rounded-2xl">
                <img
                  src={heroImage}
                  alt={heroAlt}
                  className="w-full h-48 object-cover rounded-2xl shadow-inner transform hover:scale-102 transition-transform duration-500"
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-500 text-sm mb-6">Fill out the form below and our team will get back to you promptly.</p>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-ship-blue-600 font-sans font-semibold text-sm tracking-wider uppercase">Location &amp; Access</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1 mb-3">Find The Ship Inn</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Located right on the tranquil harbour at Porlock Weir within Exmoor National Park.
            </p>
            <div>
              <TrackedDirectionsLink
                location="contact_map_header"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-ship-blue-600 via-ship-blue-700 to-blue-800 hover:from-ship-blue-700 hover:to-blue-900 text-white font-sans font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-ship-blue-600/30 hover:shadow-xl hover:shadow-ship-blue-600/40 transform hover:-translate-y-0.5 transition-all text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Get Directions on Google Maps</span>
                <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </TrackedDirectionsLink>
            </div>
          </div>

          {/* Map Section */}
          <div className="w-full h-96 sm:h-[420px] rounded-3xl overflow-hidden shadow-xl border border-gray-200/80 mb-12">
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
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="bg-ship-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-ship-blue-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">By Car</h3>
              <p className="text-gray-600 text-sm">
                From A39, follow signs to Porlock then Porlock Weir.
                Limited parking available on-site and in the village.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="bg-ship-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-ship-blue-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">By Public Transport</h3>
              <p className="text-gray-600 text-sm">
                Bus services connect from Minehead and Lynton.
                Nearest mainline railway station is Taunton (45 mins drive).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="bg-ship-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-ship-blue-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Parking</h3>
              <p className="text-gray-600 text-sm">
                Limited on-site parking for guests. Additional parking in the village car park (2 mins walk).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions CTA Banner */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-ship-blue-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-yellow-400/20 text-yellow-300 font-sans font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-yellow-400/30">
            Bookings &amp; Inquiries
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">Ready to Visit Us?</h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Contact us directly for room bookings, table reservations, or private events in Porlock Weir.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <TrackedPhoneLink
              phone={phone}
              location="contact_page_cta"
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-sans font-bold px-9 py-4 rounded-2xl shadow-xl shadow-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/30 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-3 text-lg"
            >
              <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Call Direct: {phone}</span>
            </TrackedPhoneLink>

            <TrackedEmailLink
              email={email}
              location="contact_page_cta"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/60 backdrop-blur-md font-sans font-semibold px-9 py-4 rounded-2xl shadow-lg hover:shadow-white/10 transform hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-3 text-lg"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Send Email Enquiry</span>
            </TrackedEmailLink>
          </div>
        </div>
      </section>
    </div>
  )
}
