'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { useCookieConsent } from '@/lib/hooks/useCookieConsent'

export default function AnalyticsScripts() {
    const { consent } = useCookieConsent()

    useEffect(() => {
        if (consent === 'granted') {
            // Setup data layer if needed
            // window.dataLayer = window.dataLayer || [];
            // function gtag(){dataLayer.push(arguments);}
            // gtag('js', new Date());
            // gtag('config', 'GA_MEASUREMENT_ID');
        }
    }, [consent])

    if (consent !== 'granted') return null

    return (
        <>
            {/* 
        Add your scripts here (Google Analytics, Facebook Pixel, etc.)
        Example:
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
      */}
        </>
    )
}
