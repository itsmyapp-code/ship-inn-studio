import { getDocumentBySlug, getDocuments } from 'outstatic/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { remark } from 'remark'
import html from 'remark-html'
import { parseDate, formatDateShort } from '@/lib/dateUtils'

type Props = {
  params: { slug: string }
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}

export async function generateStaticParams() {
  const news = getDocuments('news', ['slug'])
  return news.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props) {
  const post = getDocumentBySlug('news', params.slug, ['title', 'description'])
  if (!post) return { title: 'Not Found' }
  return {
    title: `${post.title} | The Ship Inn`,
    description: post.description || '',
  }
}

export default async function NewsArticlePage({ params }: Props) {
  const post = getDocumentBySlug('news', params.slug, [
    'title',
    'publishedAt',
    'description',
    'content',
    'coverImage',
    'author',
  ])

  if (!post) {
    notFound()
  }

  const contentHtml = await markdownToHtml(post.content || '')

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
          <p className="text-amber-800 font-semibold tracking-wide uppercase text-sm mb-4">
            {formatDateShort(parseDate(post.publishedAt))}
            {post.author && ` • ${typeof post.author === 'object' ? post.author.name : post.author}`}
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-centaur text-slate-900 leading-tight">
            {post.title}
          </h1>

          {/* duplicates content frequently 
          {post.description && (
             <p className="text-xl text-gray-500">{post.description}</p>
          )} */}
        </header>

        {post.coverImage && (
          <div className="relative aspect-video w-full mb-12 shadow-xl rounded-xl overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="object-cover w-full h-full"
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
