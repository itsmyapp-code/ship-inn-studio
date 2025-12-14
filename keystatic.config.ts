import { config, fields, collection } from '@keystatic/core'

// Helper to determine storage mode
const getStorageConfig = () => {
  // Development always uses local
  if (process.env.NODE_ENV === 'development') {
    return { kind: 'local' } as const
  }

  // PRODUCTION: ALWAYS USE GITHUB MODE
  // This ensures both Client (Admin UI) and Server (API Route) agree.
  // Credentials are injected via the API route handler.
  return { kind: 'github', repo: 'itsmyapp-code/ship-inn-studio' } as const
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
