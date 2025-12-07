import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2025-01-01'
const useCdn = process.env.SANITY_USE_CDN === 'true'

let client: any

if (projectId) {
  client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
  })
} else {
  // Provide a safe no-op client for build-time when SANITY isn't configured
  client = {
    fetch: async () => [],
  }
}

export default client
