import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
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

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-yellow-400/10 text-yellow-300 font-sans font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-yellow-400/30">
            Guest Experiences &amp; Stories
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-4">
            Guest Reviews &amp; Testimonials
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light mb-8">
            Honest reflections from sailors, walkers, and weary travellers resting their sea legs at The Ship Inn by the water’s edge in Porlock Weir.
          </p>

          {/* Rating Snapshot & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 border-t border-slate-800/80 max-w-xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-serif font-bold text-white">{averageRating}</span>
              <div>
                <div className="flex items-center text-amber-400 text-lg">
                  {'★'.repeat(Math.round(averageRating))}
                  {'☆'.repeat(5 - Math.round(averageRating))}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Based on {totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-slate-800"></div>

            <Link
              href="/review"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition duration-200 text-sm"
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
