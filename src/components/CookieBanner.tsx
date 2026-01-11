'use client'

import { useState, useEffect } from 'react'
import { useCookieConsent } from '@/lib/hooks/useCookieConsent'

export default function CookieBanner() {
    const { consent, acceptCookies, rejectCookies } = useCookieConsent()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Only show if consent hasn't been set yet
        if (consent === null) {
            // Small delay to prevent hydration mismatch or immediate flash
            const timer = setTimeout(() => setIsVisible(true), 500)
            return () => clearTimeout(timer)
        } else {
            setIsVisible(false)
        }
    }, [consent])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 p-4 md:p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-transform duration-300">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 text-stone-800 text-sm md:text-base">
                    <h2 className="font-semibold mb-2 text-stone-900">We value your privacy</h2>
                    <p>
                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
                        By clicking "Accept All", you consent to our use of cookies.
                        <a href="/legal" className="underline ml-1 hover:text-stone-600 transition-colors">Read our Cookie Policy</a>.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                        onClick={rejectCookies}
                        className="px-6 py-2.5 rounded-md border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors focus:ring-2 focus:ring-stone-400 focus:outline-none w-full sm:w-auto text-center"
                    >
                        Reject Non-Essential
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="px-6 py-2.5 rounded-md bg-stone-900 text-white font-medium hover:bg-stone-700 transition-colors focus:ring-2 focus:ring-stone-400 focus:outline-none w-full sm:w-auto text-center shadow-sm"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    )
}
