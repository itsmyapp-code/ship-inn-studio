'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCookieConsent } from '@/lib/hooks/useCookieConsent'

export default function CookieBanner() {
    const { consent, acceptCookies, rejectCookies } = useCookieConsent()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (consent === null) {
            const timer = setTimeout(() => setIsVisible(true), 500)
            return () => clearTimeout(timer)
        } else {
            setIsVisible(false)
        }
    }, [consent])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 p-4 md:p-6 shadow-[0_-4px_16px_-1px_rgba(0,0,0,0.12)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 text-stone-800 text-sm md:text-base">
                    <h2 className="font-semibold mb-1 text-stone-900">We use cookies</h2>
                    <p className="text-stone-600 text-sm">
                        We use essential cookies to make our site work. With your consent, we may also use
                        optional analytics cookies to understand how you use the site.{' '}
                        <Link href="/cookies" className="underline hover:text-blue-800 transition-colors">
                            Read our Cookie Policy
                        </Link>
                        .
                    </p>
                </div>
                {/* Equal prominence buttons — identical size, weight, and visual presence */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    <button
                        onClick={rejectCookies}
                        className="px-6 py-2.5 rounded-md border-2 border-gray-800 text-gray-800 font-semibold hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-gray-400 focus:outline-none w-full sm:w-auto text-center text-sm"
                    >
                        Reject Non-Essential
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="px-6 py-2.5 rounded-md border-2 border-gray-800 bg-gray-800 text-white font-semibold hover:bg-gray-700 hover:border-gray-700 transition-colors focus:ring-2 focus:ring-gray-400 focus:outline-none w-full sm:w-auto text-center text-sm"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    )
}
