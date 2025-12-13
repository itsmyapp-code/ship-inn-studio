import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '../../../../../keystatic.config'

// HARDCODED FALLBACK FOR DEBUGGING ONLY
const FALLBACK_SECRET = '3f664d8ac4622c86018c9ff4158d81f4e2b9a0c7d3e5f1g6h8i9j0k1l2m3n4o'
const FALLBACK_CLIENT_ID = 'Ov23liJWu8geK8HsiyH0'
const FALLBACK_CLIENT_SECRET = 'ccb835f1ad02ca88ca80577a8b9089b02351a298'

export const { GET, POST } = makeRouteHandler({
  config,
  secret: FALLBACK_SECRET,
  clientId: FALLBACK_CLIENT_ID,
  clientSecret: FALLBACK_CLIENT_SECRET,
})
