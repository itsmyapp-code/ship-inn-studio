import { config, fields, collection } from '@keystatic/core'

// Helper to determine storage mode
const getStorageConfig = () => {
  // Development always uses local
  if (process.env.NODE_ENV === 'development') {
    return { kind: 'local' } as const
  }

  // In Production:
  // 1. Client-side (Browser): Always use GitHub mode so the Admin UI works
  if (typeof window !== 'undefined') {
    return { kind: 'github', repo: 'itsmyapp-code/ship-inn-studio' } as const
  }

  // 2. Server-side (API/Build):
  // If we have credentials (Runtime), use GitHub.
  // If we are missing credentials (Build time), fallback to local to prevent build errors.
  if (process.env.KEYSTATIC_GITHUB_CLIENT_ID && process.env.KEYSTATIC_GITHUB_CLIENT_SECRET) {
    return { kind: 'github', repo: 'itsmyapp-code/ship-inn-studio' } as const
  }

  // Fallback for build time
  return { kind: 'local' } as const
}

export default config({
  storage: getStorageConfig(),
  collections: {
    news: collection({
      label: 'News Updates',
      slugField: 'title',
      path: 'content/news/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Headline' } }),
        publishedDate: fields.date({ label: 'Date Posted', validation: { isRequired: true } }),
        coverImage: fields.image({ label: 'Cover Image', directory: 'public/images/news', publicPath: '/images/news' }),
        content: fields.document({ label: 'Content', formatting: true, links: true, images: true }),
      },
    }),
    events: collection({
      label: 'Upcoming Events',
      slugField: 'title',
      path: 'content/events/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.slug({ name: { label: 'Event Name' } }),
        eventDate: fields.date({ label: 'Date of Event', validation: { isRequired: true } }),
        location: fields.text({ label: 'Location' }),
        description: fields.document({ label: 'Event Details', formatting: true }),
      },
    }),
  },
})
