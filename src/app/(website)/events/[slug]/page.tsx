import { getDocumentBySlug, getDocuments } from 'outstatic/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { remark } from 'remark'
import html from 'remark-html'

type Props = {
  params: { slug: string }
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}

export async function generateStaticParams() {
  const events = getDocuments('events', ['slug'])
  return events.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props) {
  const event = getDocumentBySlug('events', params.slug, ['title', 'description'])
  if (!event) return { title: 'Not Found' }
  return {
    title: `${event.title} | The Ship Inn`,
    description: event.description || '',
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default async function EventPage({ params }: Props) {
  const event = getDocumentBySlug('events', params.slug, [
    'title',
    'publishedAt',
    'description',
    'content',
    'coverImage',
    'author',
    'eventDate',
    'eventTime',
    'location',
  ])

  if (!event) {
    notFound()
  }

  const contentHtml = await markdownToHtml(event.content || '')
  const displayDate = (event as any).eventDate || event.publishedAt

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link 
        href="/news-events" 
        className="text-amber-700 hover:text-amber-800 mb-6 inline-block"
      >
        ← Back to News & Events
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
            <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-medium">
              📅 {formatDate(displayDate)}
            </span>
            {(event as any).eventTime && (
              <span className="bg-gray-100 px-4 py-2 rounded-full">
                🕐 {(event as any).eventTime}
              </span>
            )}
            {(event as any).location && (
              <span className="bg-gray-100 px-4 py-2 rounded-full">
                📍 {(event as any).location}
              </span>
            )}
          </div>

          {event.description && (
            <p className="text-xl text-gray-600">{event.description}</p>
          )}
        </header>

        {event.coverImage && (
          <img 
            src={event.coverImage} 
            alt={event.title}
            className="w-full h-80 object-cover rounded-lg mb-8"
          />
        )}

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </div>
  )
}
