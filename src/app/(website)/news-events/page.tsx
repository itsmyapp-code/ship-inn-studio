import NewsletterForm from '@/components/NewsletterForm'
import { getDocuments } from 'outstatic/server'
import Link from 'next/link'
import { parseDate, formatDateShort } from '@/lib/dateUtils'
import TideTimes from '@/components/TideTimes'
import WeatherWidget from '@/components/WeatherWidget'

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

// Helper to extract image and description from markdown content
function extractContentMetadata(content: string) {
  // Find first image
  const imageMatch = content.match(/!\[.*?\]\((.*?)\)/)
  const extractedImage = imageMatch ? imageMatch[1] : undefined

  // Remove images and get text
  const textContent = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/#{1,6}\s/g, '') // Remove heading markers
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim()

  // limit to 150 chars
  const extractedDescription = textContent.length > 150
    ? textContent.slice(0, 150) + '...'
    : textContent

  return { extractedImage, extractedDescription }
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const news = getDocuments('news', ['title', 'slug', 'publishedAt', 'description', 'coverImage', 'content', 'status'])
    return (news as any[])
      .filter((item: any) => item.status === 'published')
      .map((item) => {
        const { extractedImage, extractedDescription } = extractContentMetadata(item.content || '')
        return {
          ...item,
          coverImage: item.coverImage || extractedImage,
          description: item.description || extractedDescription
        }
      }) as NewsItem[]
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
      .map((event) => {
        const { extractedImage, extractedDescription } = extractContentMetadata(event.content || '')
        return {
          ...event,
          coverImage: event.coverImage || extractedImage,
          description: event.description || extractedDescription,
          // Use eventDate if set, otherwise fall back to publishedAt
          displayDate: event.eventDate || event.publishedAt
        }
      })
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
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-ship-blue-900 flex items-center justify-center mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {/* Optional: Add a subtle background pattern or image here */}
        <div className="relative z-20 text-center text-white max-w-4xl px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-centaur drop-shadow-lg">News & Events</h1>
          <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto opacity-90">
            Discover what's happening at Porlock Weir, from live music to seasonal specials.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-20">

          {/* Events Section */}
          <section>
            <div className="flex items-center justify-between mb-10 border-b border-stone-200 pb-4">
              <h2 className="text-4xl font-bold font-centaur text-ship-blue-900">Upcoming Events</h2>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-stone-200 text-center shadow-sm">
                <p className="text-stone-500 text-lg italic">We're planning some exciting updates. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {upcomingEvents.map((event) => (
                  <Link href={`/events/${event.slug}`} key={event.slug} className="group block">
                    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col md:flex-row relative">
                      {/* Image Container */}
                      <div className="w-full md:w-1/3 relative min-h-[250px] md:min-h-[280px] bg-stone-200">
                        {event.coverImage ? (
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-300">
                            <span className="text-5xl">📅</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-md shadow-md text-sm font-semibold text-ship-blue-900 z-10">
                          {formatDateShort(parseDate(event.displayDate))}
                        </div>
                      </div>

                      {/* Content Container */}
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                        <h3 className="text-3xl font-bold font-centaur text-slate-800 mb-3 group-hover:text-amber-700 transition-colors">
                          {event.title}
                        </h3>

                        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-stone-500 mb-5 uppercase tracking-wide font-medium">
                          {event.eventTime && <span className="flex items-center">🕐 {event.eventTime}</span>}
                          {event.location && <span className="flex items-center">📍 {event.location}</span>}
                        </div>

                        {event.description && (
                          <p className="text-stone-600 line-clamp-3 mb-6 text-lg leading-relaxed">
                            {event.description}
                          </p>
                        )}

                        <span className="text-amber-700 font-medium group-hover:underline decoration-amber-700 underline-offset-4 inline-flex items-center">
                          View details <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Gift Voucher Banner */}
          <section className="bg-ship-blue-900 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl text-white">
            <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')]"></div> {/* Placeholder for texture */}
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-1/3">
                <img
                  src="/images/logo/ship-inn-voucher.webp"
                  alt="Gift Voucher"
                  className="rounded-lg shadow-lg rotate-[-3deg] border-4 border-white/20"
                />
              </div>
              <div className="md:w-2/3 text-center md:text-left">
                <h2 className="text-3xl font-bold font-centaur mb-4">The Perfect Gift</h2>
                <p className="text-lg text-blue-100 mb-8 max-w-xl">
                  Treat someone special to a memorable experience at The Ship Inn. Perfect for birthdays, anniversaries, or just because.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-amber-500 hover:bg-amber-400 text-ship-blue-950 font-bold py-3 px-8 rounded-full transition-transform hover:-translate-y-1 shadow-lg"
                >
                  Enquire About Vouchers
                </Link>
              </div>
            </div>
          </section>

          {/* News Section */}
          <section>
            <div className="flex items-center justify-between mb-10 border-b border-stone-200 pb-4">
              <h2 className="text-3xl font-bold font-centaur text-ship-blue-900">Latest News</h2>
            </div>

            {latestNews.length === 0 ? (
              <p className="text-stone-500 italic">No news updates yet.</p>
            ) : (
              <div className="space-y-8">
                {latestNews.map((news) => (
                  <Link href={`/news-events/${news.slug}`} key={news.slug} className="group block">
                    <article className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-stone-100 flex flex-col md:flex-row gap-8 items-start">
                      {news.coverImage && (
                        <div className="w-full md:w-48 aspect-video md:aspect-square flex-shrink-0 rounded-lg overflow-hidden bg-stone-100">
                          <img
                            src={news.coverImage}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <span className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-2 block">
                          {formatDateShort(parseDate(news.publishedAt))}
                        </span>
                        <h3 className="text-2xl font-bold font-centaur text-slate-900 mb-3 group-hover:text-amber-700 transition-colors">
                          {news.title}
                        </h3>
                        {news.description && (
                          <p className="text-stone-600 mb-4 line-clamp-2">
                            {news.description}
                          </p>
                        )}
                        <span className="text-stone-500 text-sm font-medium group-hover:text-amber-700 flex items-center">
                          Read full story <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <h3 className="text-xl font-bold font-centaur mb-4 text-ship-blue-900 border-b border-stone-100 pb-2">Newsletter</h3>
              <p className="mb-6 text-stone-600 text-sm">Join our community for exclusive offers and first announcements of special events.</p>
              <NewsletterForm />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <WeatherWidget />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <TideTimes />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
