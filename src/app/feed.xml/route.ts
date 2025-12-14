import RSS from 'rss'

export async function GET() {
  const feed = new RSS({
    title: 'The Ship Inn News',
    site_url: 'https://shipinnporlockweir.com',
    feed_url: 'https://shipinnporlockweir.com/feed.xml',
  })

  // Placeholder item until Outstatic is fully integrated
  feed.item({
    title: 'Website Update',
    description: 'We are currently updating our news feed system. Please check back soon.',
    url: 'https://shipinnporlockweir.com/news-events',
    date: new Date(),
  })

  return new Response(feed.xml({ indent: true }), { headers: { 'Content-Type': 'application/xml' } })
}
