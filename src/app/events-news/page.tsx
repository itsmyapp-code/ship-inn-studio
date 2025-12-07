


export const metadata = {
  title: 'Events & News - The Ship Inn Porlock Weir',
  description: 'Stay updated with latest news, events, and happenings at The Ship Inn and around Porlock Weir. Local events, seasonal specials, and community news.',
}

import client from '@/lib/sanityClient'
import { EVENTS_QUERY, NEWS_QUERY } from '@/lib/sanityQueries'

export default async function EventsNewsPage() {
  // Fetch news and events from Sanity. If Sanity not configured, fallback to local placeholders.
  let newsItems = []
  let upcomingEvents = []

  try {
    const [newsData, eventsData] = await Promise.all([
      client.fetch(NEWS_QUERY),
      client.fetch(EVENTS_QUERY),
    ])

    newsItems = newsData.map((n: any) => ({
      _id: n._id,
      title: n.title,
      date: n.publishedAt || null,
      excerpt:
        n.summary ||
        (n.body && Array.isArray(n.body) && n.body.length
          ? (n.body[0].children || []).map((c: any) => c.text).join('') : '') ||
        '',
      category: 'News',
      coverUrl: n.coverImage?.asset?.url || n.mainImage?.asset?.url || null,
      slug: n.slug?.current || null,
    }))

    upcomingEvents = eventsData.map((e: any) => ({
      title: e.title,
      date: e.startDate || null,
      time: null,
      description: e.summary || '',
      price: e.price || '',
      coverUrl: e.coverImage?.asset?.url || null,
      location: e.location || '',
      slug: e.slug?.current || null,
    }))
  } catch (err) {
    // Sanity not configured or fetch failed — fall back to placeholders
    console.warn('Sanity fetch failed, using local placeholders', err)
    newsItems = [
      {
        title: "Summer Menu Launch",
        date: "2024-06-01",
        excerpt: "Our new summer menu featuring the best of local seafood and seasonal produce is now available.",
        category: "Food & Drink"
      },
      {
        title: "Porlock Weir Annual Regatta",
        date: "2024-07-15",
        excerpt: "Join us for the annual sailing regatta with special viewing packages and celebration dinner.",
        category: "Local Events"
      },
      {
        title: "Live Music Evenings",
        date: "2024-05-20",
        excerpt: "Every third Friday of the month, enjoy live acoustic music in our bar area.",
        category: "Entertainment"
      }
    ]

    upcomingEvents = [
      {
        title: "Harvest Festival Dinner",
        date: "2024-09-22",
        time: "19:00",
        description: "Celebrate the autumn harvest with a special four-course dinner featuring local produce.",
        price: "£45 per person"
      },
      {
        title: "Winter Ale Festival",
        date: "2024-11-10",
        time: "12:00-23:00",
        description: "Sample the finest winter ales from local breweries across the West Country.",
        price: "Free entry"
      },
      {
        title: "New Year's Eve Celebration",
        date: "2024-12-31",
        time: "19:00",
        description: "Ring in the New Year with a gala dinner and party overlooking the harbour.",
        price: "£75 per person"
      }
    ]
  }
  

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-ship-gold-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Events & News</h1>
          <p className="text-xl">Stay connected with The Ship Inn and Porlock Weir community</p>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News</h2>
            <p className="text-lg text-gray-600">Keep up to date with what's happening at The Ship Inn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item: any, index: number) => (
              <article key={item._id || index} className="bg-white rounded-lg shadow-lg overflow-hidden ship-card-hover">
                {item.coverUrl ? (
                  <img src={item.coverUrl} alt={item.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="h-48 bg-ship-gold-200"></div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-ship-gold-600 font-medium px-2 py-1 bg-ship-gold-50 rounded">
                      {item.category}
                    </span>
                    <time className="text-sm text-gray-500">
                      {item.date ? new Date(item.date).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      }) : ''}
                    </time>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <a
                    href={item.slug ? `/events-news/${item.slug}` : '#'}
                    className="text-ship-blue-600 hover:text-ship-blue-700 font-semibold"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600">Special occasions and celebrations at The Ship Inn</p>
          </div>

          <div className="space-y-8">
            {upcomingEvents.map((event: any, index: number) => (
              <div key={event._id || index} className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.date ? new Date(event.date).toLocaleDateString('en-GB', { 
                          weekday: 'long',
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        }) : ''}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-ship-blue-600">{event.price}</span>
                    </div>
                    <a
                      href={event.slug ? `/events-news/${event.slug}` : '#'}
                      className="bg-ship-blue-600 hover:bg-ship-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-block"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-ship-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Stay in the Loop</h2>
          <p className="text-xl text-blue-100 mb-8">
            Subscribe to our newsletter for the latest news, events, and special offers.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white hover:bg-gray-100 text-ship-blue-600 px-6 py-3 rounded-r-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-4">
              We respect your privacy and never share your details.
            </p>
          </div>
        </div>
      </section>

      {/* CMS Integration Note */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Content Management</h3>
                <p className="text-blue-800">
                  This page will be integrated with Sanity CMS to allow easy content updates for news articles, 
                  events, and blog posts. The current content is placeholder data showing the layout structure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
