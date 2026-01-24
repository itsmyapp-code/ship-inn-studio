'use client'

import { useState, FormEvent } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'xrezadnw'

    if (!formspreeId) {
      console.error('Formspree ID is not set in environment variables.')
      setStatus('error')
      return
    }

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Message Sent!</h3>
        <p className="text-green-700 mb-6">
          Thank you for contacting us. We have received your message and will get back to you shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-semibold transition-colors"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
        />
      </div>

      <div>
        <label htmlFor="enquiryType" className="block text-sm font-medium text-gray-700 mb-1">
          Enquiry Type
        </label>
        <select
          id="enquiryType"
          name="enquiryType"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
        >
          <option value="">Please select...</option>
          <option value="room-booking">Room Booking</option>
          <option value="restaurant-reservation">Restaurant Reservation</option>
          <option value="event-enquiry">Event Enquiry</option>
          <option value="general-enquiry">General Enquiry</option>
          <option value="gift-voucher">Gift Voucher</option>
          <option value="group-booking">Group Booking</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Please tell us about your enquiry, including preferred dates if booking accommodation..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-ship-blue-600 hover:bg-ship-blue-700 text-white py-3 px-4 rounded-md font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'error' && (
        <p className="text-red-600 text-center mt-4">
          Oops! There was an error sending your message. Please try again or call us directly.
        </p>
      )}
    </form>
  )
}
