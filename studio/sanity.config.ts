import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import schemas from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Ship Inn CMS',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production',
  plugins: [deskTool()],
  schema: { types: schemas },
})
