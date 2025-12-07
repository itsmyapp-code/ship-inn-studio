import {CalendarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'startDate', type: 'datetime' }),
    defineField({ name: 'endDate', type: 'datetime' }),
    defineField({ name: 'time', type: 'string' }),
    defineField({ name: 'summary', type: 'text' }),
    defineField({ name: 'price', type: 'string' }),
    defineField({ name: 'location', type: 'string' }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alternative text' }),
      ],
    }),
    defineField({ name: 'body', type: 'blockContent' }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'startDate' },
  },
})
