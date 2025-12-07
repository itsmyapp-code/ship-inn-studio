import { config, fields, collection } from '@keystatic/core'

export default config({
  storage:
    // Use local mode in dev OR if no cloud/github credentials are present (prevents build failure)
    process.env.NODE_ENV === 'development' || (!process.env.NEXT_PUBLIC_KEYSTATIC_PROJECT && !process.env.KEYSTATIC_GITHUB_CLIENT_ID)
      ? { kind: 'local' }
      : (process.env.NEXT_PUBLIC_KEYSTATIC_PROJECT
        ? ({ kind: 'cloud', project: process.env.NEXT_PUBLIC_KEYSTATIC_PROJECT } as any)
        : { kind: 'github', repo: 'itsmyapp-code/ship-inn-studio' }),
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
