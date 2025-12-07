import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-10-01',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Blog post type for Events & News
export interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: any[]
  category: string
  publishedAt: string
  author: {
    name: string
    image?: any
  }
  mainImage?: any
}