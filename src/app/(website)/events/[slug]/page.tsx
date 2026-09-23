import { getDocumentBySlug, getDocuments } from 'outstatic/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { remark } from 'remark'
import html from 'remark-html'
import { parseDate, formatDate } from '@/lib/dateUtils'

type Props = {
  params: Promise<{ slug: string }>
}

// Helper to process markdown and extract hero image without duplication
async function processEventContent(
  content: string = '',
  frontmatterCover?: string
): Promise<{ heroImage?: string; contentHtml: string }> {
  // 1. Normalize double-slash Outstatic paths in markdown (//images/ -> /images/)
  let normalized = content.replace(/!\[(.*?)\]\(\/\/+images\/(.*?)\)/g, '![$1](/images/$2)')

  let heroImage = frontmatterCover ? frontmatterCover.replace(/^\/+/, '/') : undefined

  // 2. Check for first image in markdown
  const firstImageMatch = normalized.match(/^\s*!\[(.*?)\]\((.*?)\)/)

  if (!heroImage && firstImageMatch) {
    heroImage = firstImageMatch[2].replace(/^\/+/, '/')
    // Remove the first image from body so it displays as the hero banner without duplication
    normalized = normalized.replace(/^\s*!\[.*?\]\(.*?\)/, '')
  } else if (heroImage && firstImageMatch) {
    const firstSrc = firstImageMatch[2].replace(/^\/+/, '/')
    if (firstSrc === heroImage || heroImage.includes(firstSrc) || firstSrc.includes(heroImage)) {
      normalized = normalized.replace(/^\s*!\[.*?\]\(.*?\)/, '')
    }
  }

  const result = await remark().use(html).process(normalized)
  return { heroImage, contentHtml: result.toString() }
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
    'uploadImage',
    'author',
    'eventDate',
    'eventTime',
    'location',
  ])

  if (!event) {
    notFound()
  }

  const explicitCover = (event as any).coverImage || (event as any).uploadImage
  const { heroImage, contentHtml } = await processEventContent(event.content || '', explicitCover)
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
        </header>

        {heroImage && (
          <div className="w-full max-w-4xl mx-auto mb-12 shadow-xl rounded-xl overflow-hidden bg-stone-100 flex justify-center">
            <img
              src={heroImage.startsWith('/') ? heroImage : `/${heroImage}`}
              alt={event.title}
              className="w-full h-auto max-h-[700px] object-contain mx-auto"
            />
          </div>
        )}

        {contentHtml && contentHtml.trim().length > 0 && (
          <div
            className="prose prose-lg prose-slate mx-auto prose-headings:font-centaur prose-headings:font-bold prose-a:text-amber-700 hover:prose-a:text-amber-800 prose-img:rounded-xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        )}
      </article>
    </div>
  )
}
