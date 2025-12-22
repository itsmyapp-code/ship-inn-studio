'use client'

import { useState, FormEvent } from 'react'

export default function NewsletterSignup() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-white mb-4">
          Stay Connected with The Ship Inn
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Get the latest news, special offers, and events delivered to your inbox
        </p>
        
        {status === 'success' ? (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Thank you for subscribing!</h3>
            <p>You've been added to our mailing list.</p>
          </div>
        ) : (
          <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg font-bold transition-colors duration-200 whitespace-nowrap disabled:opacity-70"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {status === 'error' && (
              <p className="text-red-200 text-sm mt-4">
                Oops! Something went wrong. Please try again later.
              </p>
            )}
            <p className="text-blue-200 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}