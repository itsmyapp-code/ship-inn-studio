import RSS from 'rss'
import { getDocuments } from 'outstatic/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ship-inn-website.vercel.app'

export async function GET() {
  const feed = new RSS({
    title: 'The Ship Inn - News & Events',
    description: 'Latest news and upcoming events from The Ship Inn, Porlock Weir',
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.xml`,
    language: 'en-GB',
    pubDate: new Date(),
    ttl: 60,
    custom_namespaces: {
      'media': 'http://search.yahoo.com/mrss/'
    }
  })

  // Fetch events from Outstatic
  try {
    const events = getDocuments('events', [
      'title',
      'slug',
      'publishedAt',
      'description',
      'coverImage',
      'content',
      'status'
    ])

    const publishedEvents = events.filter((event: any) => event.status === 'published')

    publishedEvents.forEach((event: any) => {
      feed.item({
        title: `🎉 Event: ${event.title}`,
        description: event.description || event.content?.substring(0, 200) || '',
        url: `${SITE_URL}/events/${event.slug}`,
        date: new Date(event.publishedAt),
        enclosure: event.coverImage ? {
          url: `${SITE_URL}${event.coverImage}`,
          type: 'image/jpeg'
        } : undefined,
        custom_elements: event.coverImage ? [
          { 'media:content': { _attr: { url: `${SITE_URL}${event.coverImage}`, medium: 'image' } } }
        ] : []
      })
    })
  } catch (e) {
    console.error('Error fetching events for RSS:', e)
  }

  // Fetch news from Outstatic
  try {
    const news = getDocuments('news', [
      'title',
      'slug',
      'publishedAt',
      'description',
      'coverImage',
      'content',
      'status'
    ])

    const publishedNews = news.filter((item: any) => item.status === 'published')

    publishedNews.forEach((item: any) => {
      feed.item({
        title: item.title,
        description: item.description || item.content?.substring(0, 200) || '',
        url: `${SITE_URL}/news-events/${item.slug}`,
        date: new Date(item.publishedAt),
        enclosure: item.coverImage ? {
          url: `${SITE_URL}${item.coverImage}`,
          type: 'image/jpeg'
        } : undefined,
        custom_elements: item.coverImage ? [
          { 'media:content': { _attr: { url: `${SITE_URL}${item.coverImage}`, medium: 'image' } } }
        ] : []
      })
    })
  } catch (e) {
    console.error('Error fetching news for RSS:', e)
  }

  // Sort items by date (newest first) - RSS library handles this but we ensure it
  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
