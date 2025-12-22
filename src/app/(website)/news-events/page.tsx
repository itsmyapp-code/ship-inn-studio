import NewsletterForm from '@/components/NewsletterForm'
import { getDocuments } from 'outstatic/server'
import Link from 'next/link'
import { parseDate, formatDateShort } from '@/lib/dateUtils'
import TideTimes from '@/components/TideTimes'

export const metadata = {
  title: 'News and Events - The Ship Inn Porlock Weir',
  description: 'Stay up to date with the latest news and upcoming events at The Ship Inn, Porlock Weir.',
}

type NewsItem = {
  title: string
  slug: string
  publishedAt: string
  description?: string
  coverImage?: string
  content: string
}

type EventItem = {
  title: string
  slug: string
  publishedAt: string
  description?: string
  coverImage?: string
  content: string
  eventDate?: string
  eventTime?: string
  location?: string
  displayDate?: string
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const news = getDocuments('news', ['title', 'slug', 'publishedAt', 'description', 'coverImage', 'content', 'status'])
    return news.filter((item: any) => item.status === 'published') as NewsItem[]
  } catch (e) {
    console.error('Error fetching news:', e)
    return []
  }
}

async function getEvents(): Promise<EventItem[]> {
  try {
    const events = getDocuments('events', ['title', 'slug', 'publishedAt', 'description', 'coverImage', 'content', 'status', 'eventDate', 'eventTime', 'location'])
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Start of today

    return (events as any[])
      .filter((event: any) => event.status === 'published')
      .map((event) => ({
        ...event,
        // Use eventDate if set, otherwise fall back to publishedAt
        displayDate: event.eventDate || event.publishedAt
      }))
      .filter((event) => {
        const date = parseDate(event.displayDate)
        // Keep events that are today or in the future
        return date >= now
      })
      .sort((a, b) => {
        const dateA = parseDate(a.displayDate)
        const dateB = parseDate(b.displayDate)
        return dateA.getTime() - dateB.getTime() // Soonest first
      }) as EventItem[]
  } catch (e) {
    console.error('Error fetching events:', e)
    return []
  }
}

export default async function Page() {
  const upcomingEvents = await getEvents()
  const latestNews = await getNews()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-ship-blue-600 flex items-center justify-center mb-12">
        <div className="text-center text-white max-w-4xl px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News and Events</h1>
          <p className="text-xl">
            At The Ship Inn at Porlock Weir, there’s always something happening! From live music events and pub quiz nights to our popular curry nights and pie & pint evenings, there’s plenty to enjoy. Keep an eye on our events, there’s always something fun around the corner!
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2 space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500">No upcoming events at the moment. Check back soon!</p>
          ) : (
            <div className="grid gap-6">
              {upcomingEvents.map((event) => (
                <article key={event.slug} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      {formatDateShort(parseDate(event.displayDate))}
                    </span>
                  </div>
                  {event.eventTime && (
                    <p className="text-gray-600 text-sm mb-2">🕐 {event.eventTime}</p>
                  )}
                  {event.location && (
                    <p className="text-gray-600 text-sm mb-2">📍 {event.location}</p>
                  )}
                  {event.coverImage && (
                    <img 
                      src={event.coverImage} 
                      alt={event.title}
                      className="w-32 h-24 object-cover rounded-lg float-right ml-4"
                    />
                  )}
                  {event.description && (
                    <p className="text-gray-700 mt-3">{event.description}</p>
                  )}
                  <Link 
                    href={`/events/${event.slug}`}
                    className="text-amber-700 hover:text-amber-800 font-medium mt-3 inline-block"
                  >
                    View details →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Latest News</h2>
          {latestNews.length === 0 ? (
            <p className="text-gray-500">No news updates yet. Stay tuned!</p>
          ) : (
            <div className="grid gap-6">
              {latestNews.map((news) => (
                <article key={news.slug} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{news.title}</h3>
                    <span className="text-gray-500 text-sm">
                      {formatDateShort(parseDate(news.publishedAt))}
                    </span>
                  </div>
                  {news.description && (
                    <p className="text-gray-700 mt-2">{news.description}</p>
                  )}
                  <Link 
                    href={`/news-events/${news.slug}`}
                    className="text-amber-700 hover:text-amber-800 font-medium mt-3 inline-block"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <aside className="md:col-span-1 space-y-8">
        <div className="sticky top-10 space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Stay in the loop</h3>
            <p className="mb-4 text-gray-600">Join our mailing list for exclusive offers and event announcements.</p>
            <NewsletterForm />
          </div>
          
          <TideTimes />
        </div>
      </aside>
    </div>
    </div>
  )
}
