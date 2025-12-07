import { createReader } from '@keystatic/core/reader'
import config from '../../../../keystatic.config'
import fs from 'fs'
import path from 'path'
import { DocumentRenderer } from '@keystatic/core/renderer'
import NewsletterForm from '@/components/NewsletterForm'

const reader = createReader(process.cwd(), config)

export default async function Page() {
  const news = await reader.collections.news.all()
  const events = await reader.collections.events.all()

  // Fallback: if Keystatic cloud/local reader returned no news, read local markdown files
  let localNews: Array<any> = []
  try {
    const newsDir = path.join(process.cwd(), 'content', 'news')
    if (news.length === 0 && fs.existsSync(newsDir)) {
      const files = fs.readdirSync(newsDir).filter((f) => f.endsWith('.md'))
      localNews = files.map((file) => {
        const raw = fs.readFileSync(path.join(newsDir, file), 'utf8')
        const fmMatch = raw.match(/^-{3}\s*([\s\S]*?)\s*-{3}\s*/)
        let fm: any = {}
        let body = raw
        if (fmMatch) {
          const fmRaw = fmMatch[1]
          body = raw.slice(fmMatch[0].length)
          fmRaw.split(/\r?\n/).forEach((line) => {
            const kv = line.split(':')
            const key = (kv.shift() || '').trim()
            const val = kv.join(':').trim().replace(/^"|"$/g, '')
            if (key) fm[key] = val
          })
        }
        return {
          slug: file.replace(/\.md$/, ''),
          entry: {
            title: fm.title || fm.name || file.replace(/\.md$/, ''),
            publishedDate: fm.publishedDate || '',
            coverImage: fm.coverImage || null,
            body: body.trim(),
          },
        }
      })
    }
  } catch (e) {
    // ignore fallback errors
  }

  const today = new Date()
  today.setHours(0,0,0,0)

  const upcomingEvents = events
    .filter(e => new Date(e.entry.eventDate) >= today)
    .sort((a, b) => new Date(a.entry.eventDate).getTime() - new Date(b.entry.eventDate).getTime())

  const sortedNews = news.sort((a, b) => new Date(b.entry.publishedDate).getTime() - new Date(a.entry.publishedDate).getTime())
  
  // Resolve possible async fields (Keystatic may store rich text as a function that returns DocumentElement[])
  const resolvedUpcomingEvents = await Promise.all(
    upcomingEvents.map(async (e) => {
      const description = typeof (e.entry as any).description === 'function'
        ? await (e.entry as any).description()
        : (e.entry as any).description
      return { ...e, resolvedDescription: description }
    })
  )

  const resolvedNews = await Promise.all(
    sortedNews.map(async (n) => {
      const content = typeof (n.entry as any).content === 'function'
        ? await (n.entry as any).content()
        : (n.entry as any).content
      return { ...n, resolvedContent: content }
    })
  )

  // merge in localNews if reader returned none
  const finalNews = resolvedNews.length > 0 ? resolvedNews : localNews

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2 space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
          {resolvedUpcomingEvents.length === 0 ? <p className="text-gray-500">No upcoming events.</p> : (
            <div className="grid gap-6">
              {resolvedUpcomingEvents.map(e => (
                <div key={e.slug} className="border p-6 rounded-lg shadow-sm bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{e.entry.title}</h3>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-bold">{e.entry.eventDate}</span>
                  </div>
                  <p className="text-gray-600 mb-2">📍 {e.entry.location}</p>
                  <div className="prose prose-sm"><DocumentRenderer document={e.resolvedDescription} /></div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Latest News</h2>
          {finalNews.map((n: any) => (
            <article key={n.slug} className="mb-8 border-b pb-8">
              {n.entry.coverImage && <img src={n.entry.coverImage} className="rounded mb-4 h-64 w-full object-cover" />}
              <h3 className="text-2xl font-bold mb-2">{n.entry.title}</h3>
              <div className="text-gray-500 text-sm mb-4">{n.entry.publishedDate}</div>
              {n.resolvedContent ? (
                <div className="prose"><DocumentRenderer document={n.resolvedContent} /></div>
              ) : (
                <div className="prose"><p>{n.entry.body}</p></div>
              )}
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
