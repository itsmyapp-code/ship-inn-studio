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
    <div className="max-w-4xl mx-auto p-6">
      <Link 
        href="/news-events" 
        className="text-amber-700 hover:text-amber-800 mb-6 inline-block"
      >
        ← Back to News & Events
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-500">
            {formatDateShort(parseDate(post.publishedAt))}
            {post.author && ` • ${typeof post.author === 'object' ? post.author.name : post.author}`}
          </p>
        </header>

        {post.coverImage && (
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
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
