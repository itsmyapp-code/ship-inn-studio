import { createReader } from '@keystatic/core/reader'
import config from '../../keystatic.config'
import { DocumentRenderer } from '@keystatic/core/renderer'
import NewsletterForm from '../../components/NewsletterForm'

const reader = createReader(process.cwd(), config)

export default async function Page() {
  const news = await reader.collections.news.all()
  const events = await reader.collections.events.all()

  const today = new Date()
  today.setHours(0,0,0,0)

  const upcomingEvents = events
    .filter(e => new Date(e.entry.eventDate) >= today)
    .sort((a, b) => new Date(a.entry.eventDate).getTime() - new Date(b.entry.eventDate).getTime())

  const sortedNews = news.sort((a, b) => new Date(b.entry.publishedDate).getTime() - new Date(a.entry.publishedDate).getTime())

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2 space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? <p className="text-gray-500">No upcoming events.</p> : (
            <div className="grid gap-6">
              {upcomingEvents.map(e => (
                <div key={e.slug} className="border p-6 rounded-lg shadow-sm bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{e.entry.title}</h3>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-bold">{e.entry.eventDate}</span>
                  </div>
                  <p className="text-gray-600 mb-2">📍 {e.entry.location}</p>
                  <div className="prose prose-sm"><DocumentRenderer document={e.entry.description} /></div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Latest News</h2>
          {sortedNews.map(n => (
            <article key={n.slug} className="mb-8 border-b pb-8">
              {n.entry.coverImage && <img src={n.entry.coverImage} className="rounded mb-4 h-64 w-full object-cover" />}
              <h3 className="text-2xl font-bold mb-2">{n.entry.title}</h3>
              <div className="text-gray-500 text-sm mb-4">{n.entry.publishedDate}</div>
              <div className="prose"><DocumentRenderer document={n.entry.content} /></div>
            </article>
          ))}
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
