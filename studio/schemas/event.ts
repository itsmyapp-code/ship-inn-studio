export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 96 } },
    { name: 'startDate', type: 'datetime', title: 'Start Date' },
    { name: 'endDate', type: 'datetime', title: 'End Date' },
    { name: 'time', type: 'string', title: 'Time' },
    { name: 'summary', type: 'text', title: 'Summary' },
    { name: 'price', type: 'string', title: 'Price' },
    { name: 'location', type: 'string', title: 'Location' },
    { name: 'coverImage', type: 'image', title: 'Cover Image' },
    { name: 'body', type: 'array', of: [{ type: 'block' }] },
  ],
}
