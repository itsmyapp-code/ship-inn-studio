import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {newsType} from './newsType'
import {eventType} from './eventType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, authorType, postType, newsType, eventType],
}
