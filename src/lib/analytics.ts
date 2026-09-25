'use client'

import { track } from '@vercel/analytics'

type AllowedValue = string | number | boolean | null | undefined

/**
 * Tracks a custom event in both Vercel Web Analytics and Google Analytics (if active)
 */
export function trackEvent(
  name: string,
  properties?: Record<string, AllowedValue>
) {
  if (typeof window === 'undefined') return

  // 1. Vercel Web Analytics
  try {
    track(name, properties)
  } catch (error) {
    console.debug('[Vercel Analytics] Event track error:', error)
  }

  // 2. Google Analytics 4 (via gtag if loaded)
  try {
    if (typeof window.gtag === 'function') {
      const sanitizedProps: Record<string, AllowedValue> = {}
      if (properties) {
        Object.entries(properties).forEach(([key, val]) => {
          sanitizedProps[key.replace(/\s+/g, '_').toLowerCase()] = val
        })
      }
      const gaEventName = name.replace(/\s+/g, '_').toLowerCase()
      window.gtag('event', gaEventName, sanitizedProps)
    }
  } catch (error) {
    console.debug('[GA4] Event track error:', error)
  }
}

/**
 * Track when a visitor clicks a telephone link (Click-to-Call)
 */
export function trackPhoneCall(location: string, phone: string = '01643 863288') {
  trackEvent('Phone Call Click', {
    location,
    phone,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
  })
}

/**
 * Track when a visitor clicks a direct email link
 */
export function trackEmailClick(location: string, email: string = 'hello@theshipinnporlockweir.co.uk') {
  trackEvent('Direct Email Click', {
    location,
    email,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
  })
}

/**
 * Track when a form is submitted (Contact, Booking enquiry, Newsletter)
 */
export function trackFormSubmission(
  formType: 'contact_form' | 'newsletter_signup' | 'booking_enquiry',
  details?: Record<string, AllowedValue>
) {
  const eventName = formType === 'newsletter_signup'
    ? 'Newsletter Signup'
    : formType === 'contact_form'
    ? 'Contact Form Submission'
    : 'Booking Enquiry Submission'

  trackEvent(eventName, {
    form_type: formType,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    ...details,
  })
}

/**
 * Track when a visitor clicks to open Google Maps for directions
 */
export function trackDirectionsClick(location: string = 'contact_page') {
  trackEvent('Google Maps Directions Click', {
    location,
    destination: 'The Ship Inn Porlock Weir TA24 8PB',
    page: typeof window !== 'undefined' ? window.location.pathname : '',
  })
}

/**
 * Track when a visitor clicks a Homepage Feature CTA card/button
 */
export function trackFeatureClick(feature: string, targetUrl: string) {
  const eventName = feature.endsWith('Click') ? feature : `${feature} Click`
  trackEvent(eventName, {
    feature,
    target_url: targetUrl,
    page: typeof window !== 'undefined' ? window.location.pathname : '/',
  })
}

/**
 * Track when a visitor opens or downloads a PDF menu
 */
export function trackMenuClick(menuTitle: string, menuUrl: string) {
  trackEvent('Menu PDF Click', {
    menu_title: menuTitle,
    menu_url: menuUrl,
    page: typeof window !== 'undefined' ? window.location.pathname : '/food-drink',
  })
}

/**
 * Track Homepage Hero CTA button clicks
 */
export function trackHeroCta(buttonName: string, targetUrl: string) {
  trackEvent('Hero CTA Click', {
    button_name: buttonName,
    target_url: targetUrl,
    page: typeof window !== 'undefined' ? window.location.pathname : '/',
  })
}

/**
 * Track promotional banner/card clicks (e.g., Saturday BBQ)
 */
export function trackPromoClick(promoName: string, targetUrl: string) {
  trackEvent('Promo Banner Click', {
    promo_name: promoName,
    target_url: targetUrl,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
  })
}

/**
 * Track when an event or news item is clicked for details
 */
export function trackArticleClick(type: 'event' | 'news', title: string, slug: string) {
  trackEvent('Article Click', {
    content_type: type,
    title,
    slug,
    page: typeof window !== 'undefined' ? window.location.pathname : '/news-events',
  })
}

/**
 * Track gallery user actions (category filter change or photo lightbox view)
 */
export function trackGalleryInteraction(action: 'filter' | 'lightbox_open', label: string) {
  trackEvent('Gallery Interaction', {
    action,
    label,
    page: typeof window !== 'undefined' ? window.location.pathname : '/gallery',
  })
}


