export default {
  name: 'news',
  title: 'News',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 96 } },
    { name: 'publishedAt', type: 'datetime', title: 'Published at' },
    { name: 'summary', type: 'text', title: 'Summary' },
    { name: 'coverImage', type: 'image', title: 'Cover Image', options: { hotspot: true } },
    { name: 'body', type: 'array', of: [{ type: 'block' }] },
  ],
}
