import { getDocumentBySlug, getDocuments } from 'outstatic/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { remark } from 'remark'
import html from 'remark-html'
import { parseDate, formatDate } from '@/lib/dateUtils'

type Props = {
  params: Promise<{ slug: string }>
}

// Helper to strip the first image from markdown to prevent duplication with the hero image
function stripFirstImage(markdown: string): string {
  return markdown.replace(/^\s*!\[.*?\]\(.*?\)/, '')
}

async function markdownToHtml(markdown: string): Promise<string> {
  const cleanMarkdown = stripFirstImage(markdown)
  const result = await remark().use(html).process(cleanMarkdown)
  return result.toString()
}

export async function generateStaticParams() {
  const events = getDocuments('events', ['slug'])
  return events.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const event = getDocumentBySlug('events', slug, ['title', 'description'])
  if (!event) return { title: 'Not Found' }
  return {
    title: `${event.title} | The Ship Inn`,
    description: event.description || '',
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = getDocumentBySlug('events', slug, [
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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/news-events"
        className="text-amber-700 hover:text-amber-800 mb-8 inline-flex items-center font-medium transition-colors"
      >
        <span className="mr-2">←</span> Back to News & Events
      </Link>

      <article>
        <header className="mb-10 text-center max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-amber-800 mb-4 font-semibold tracking-wide uppercase">
            <span className="flex items-center">
              📅 {formatDate(parseDate(displayDate))}
            </span>
            {(event as any).eventTime && (
              <span className="flex items-center before:content-['•'] before:mx-3 before:text-amber-300">
                {(event as any).eventTime}
              </span>
            )}
            {(event as any).location && (
              <span className="flex items-center before:content-['•'] before:mx-3 before:text-amber-300">
                {(event as any).location}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-centaur text-slate-900 leading-tight">
            {event.title}
          </h1>

          {/* Description removed to prevent duplication as it's often in body too.
              If needed as a stand-first, it can be re-added here. */}
        </header>

        {event.coverImage && (
          <div className="w-full max-w-4xl mx-auto mb-12 shadow-xl rounded-xl overflow-hidden bg-stone-100">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-auto max-h-[600px] object-contain mx-auto"
            />
          </div>
        )}

        <div
          className="prose prose-lg prose-slate mx-auto prose-headings:font-centaur prose-headings:font-bold prose-a:text-amber-700 hover:prose-a:text-amber-800 prose-img:rounded-xl prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </div>
  )
}
