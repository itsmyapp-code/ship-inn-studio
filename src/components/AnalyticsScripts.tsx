'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { useCookieConsent } from '@/lib/hooks/useCookieConsent'

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function AnalyticsScripts() {
    const { consent } = useCookieConsent()
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

    useEffect(() => {
        if (consent === 'granted' && gaId) {
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function gtag() {
                window.dataLayer.push(arguments);
            };
            window.gtag('js', new Date());
            window.gtag('config', gaId);
        }
    }, [consent, gaId])

    if (consent !== 'granted' || !gaId) return null

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', {
                        page_path: window.location.pathname,
                    });
                `}
            </Script>
        </>
    )
}
