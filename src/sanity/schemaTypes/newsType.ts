import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const newsType = defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'summary', type: 'text' }),
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
    select: { title: 'title', media: 'coverImage' },
  },
})
