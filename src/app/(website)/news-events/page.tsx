import NewsletterForm from '@/components/NewsletterForm'
import { getDocuments } from 'outstatic/server'
import Link from 'next/link'

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
    return (events as any[])
      .filter((event: any) => event.status === 'published')
      .map((event) => ({
        ...event,
        // Use eventDate if set, otherwise fall back to publishedAt
        displayDate: event.eventDate || event.publishedAt
      }))
      .sort((a, b) => {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      }) as EventItem[]
  } catch (e) {
    console.error('Error fetching events:', e)
    return []
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default async function Page() {
  const upcomingEvents = await getEvents()
  const latestNews = await getNews()

  return (
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
                      {formatDate(event.displayDate || event.publishedAt)}
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
                      className="w-full h-48 object-cover rounded-lg my-4"
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
                      {formatDate(news.publishedAt)}
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

      <aside className="md:col-span-1">
        <div className="sticky top-10">
          <h3 className="text-xl font-bold mb-4">Stay in the loop</h3>
          <p className="mb-4 text-gray-600">Join our mailing list for exclusive offers and event announcements.</p>
          <NewsletterForm />
        </div>
      </aside>
    </div>
  )
}
