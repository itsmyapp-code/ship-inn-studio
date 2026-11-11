import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import SmartImage from '@/components/SmartImage'
import { getTestimonials, getReviewText } from '@/lib/testimonials'
import ReviewsGalleryList from '@/components/testimonials/ReviewsGalleryList'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Guest Reviews & Testimonials • The Ship Inn Porlock Weir',
  description:
    'Read real guest reviews, ratings, and customer experiences from travellers and diners at The Ship Inn Porlock Weir on the Exmoor coast.',
  openGraph: {
    title: 'Guest Reviews & Testimonials • The Ship Inn Porlock Weir',
    description:
      'Honest reviews from visitors, locals, and travellers resting their sea legs at The Ship Inn Porlock Weir.'
  }
}

export default async function ReviewsPage() {
  const publishedReviews = await getTestimonials({ status: 'published' })

  const totalReviews = publishedReviews.length
  const averageRating =
    totalReviews > 0
      ? Number(
          (
            publishedReviews.reduce((sum, t) => sum + (t.rating || 5), 0) / totalReviews
          ).toFixed(1)
        )
      : 5.0

  // Google-compliant LocalBusiness / LodgingBusiness Structured Data (JSON-LD)
  const businessAddress = {
    '@type': 'PostalAddress',
    streetAddress: 'The Ship Inn',
    addressLocality: 'Porlock Weir, Minehead',
    addressRegion: 'Somerset',
    postalCode: 'TA24 8PB',
    addressCountry: 'GB'
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LodgingBusiness', 'Restaurant', 'BarOrPub'],
    name: 'The Ship Inn Porlock Weir',
    url: 'https://www.theshipinnporlockweir.co.uk',
    image: 'https://www.theshipinnporlockweir.co.uk/images/Ship%20-new-thatch.webp',
    telephone: '+44 1643 863288',
    email: 'hello@theshipinnporlockweir.co.uk',
    priceRange: '££',
    address: businessAddress,
    ...(totalReviews > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: averageRating.toString(),
            reviewCount: totalReviews,
            bestRating: '5',
            worstRating: '1'
          },
          review: publishedReviews.map((rev) => {
            const dateStr = rev.publishedAt
              ? rev.publishedAt.split('T')[0]
              : rev.createdAt
              ? rev.createdAt.split('T')[0]
              : new Date().toISOString().split('T')[0]

            return {
              '@type': 'Review',
              name: rev.title || `${rev.stayType || 'Guest'} Experience`,
              headline: rev.title || `${rev.stayType || 'Guest'} Experience`,
              author: {
                '@type': 'Person',
                name: rev.name
              },
              datePublished: dateStr,
              reviewBody: getReviewText(rev),
              reviewRating: {
                '@type': 'Rating',
                ratingValue: rev.rating || 5,
                bestRating: '5',
                worstRating: '1'
              },
              itemReviewed: {
                '@type': 'LodgingBusiness',
                name: 'The Ship Inn Porlock Weir',
                image: 'https://www.theshipinnporlockweir.co.uk/images/Ship%20-new-thatch.webp',
                telephone: '+44 1643 863288',
                address: businessAddress
              }
            }
          })
        }
      : {})
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header with Warm Photography Background (No solid black) */}
      <section className="relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
        {/* Photographic Background */}
        <div className="absolute inset-0">
          <SmartImage
            src="/images/Ship -new-thatch.webp"
            alt="The Ship Inn Porlock Weir"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Coastal Navy / Warm pub overlay with soft blur */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-900/70 to-slate-950/85 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <span className="inline-block bg-amber-400/20 text-yellow-300 font-sans font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-amber-400/40 shadow-sm backdrop-blur-xs">
            Guest Experiences &amp; Stories
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-4 drop-shadow-md">
            Guest Reviews &amp; Testimonials
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal mb-8 drop-shadow-sm">
            Honest reflections from sailors, walkers, and weary travellers resting their sea legs at The Ship Inn by the water’s edge in Porlock Weir.
          </p>

          {/* Rating Snapshot & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 border-t border-white/20 max-w-xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-serif font-bold text-white drop-shadow-sm">{averageRating}</span>
              <div className="text-left">
                <div className="flex items-center text-amber-400 text-lg drop-shadow-sm">
                  {'★'.repeat(Math.round(averageRating))}
                  {'☆'.repeat(5 - Math.round(averageRating))}
                </div>
                <span className="text-xs text-slate-200 font-medium">
                  Based on {totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-white/25"></div>

            <Link
              href="/review"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold rounded-2xl shadow-xl shadow-amber-500/30 hover:scale-105 transition duration-200 text-sm"
            >
              <span>+ Share Your Experience</span>
              <span className="text-base leading-none">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Reviews Directory */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ReviewsGalleryList initialReviews={publishedReviews} />
      </main>
    </div>
  )
}
