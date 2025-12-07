import RSS from 'rss'
import { createReader } from '@keystatic/core/reader'
import config from '../../keystatic.config'

export async function GET() {
  const reader = createReader(process.cwd(), config)
  const posts = await reader.collections.news.all()
  const events = await reader.collections.events.all()

  const allItems = [
    ...posts.map((p) => ({ ...p, type: 'news', date: p.entry.publishedDate })),
    ...events.map((e) => ({ ...e, type: 'event', date: e.entry.eventDate })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const feed = new RSS({
    title: 'The Ship Inn News',
    site_url: 'https://shipinnporlockweir.com',
    feed_url: 'https://shipinnporlockweir.com/feed.xml',
  })

  allItems.forEach((item) => {
    const title =
      'title' in item.entry && item.entry.title
        ? item.entry.title
        : 'name' in item.entry && (item.entry as any).name
        ? (item.entry as any).name
        : 'Update'

    const description =
      item.type === 'event'
        ? `Upcoming Event on ${(item.entry as any).eventDate} at ${(item.entry as any).location}`
        : (item.entry.content && item.entry.content[0] && item.entry.content[0].children && item.entry.content[0].children.map((c: any) => c.text).join('')) || 'Latest news from The Ship Inn.'

    feed.item({
      title,
      description,
      url: `https://shipinnporlockweir.com/news-events`,
      date: item.date,
    })
  })

  return new Response(feed.xml({ indent: true }), { headers: { 'Content-Type': 'application/xml' } })
}
