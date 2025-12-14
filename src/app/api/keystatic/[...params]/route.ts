import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '../../../../../keystatic.config'

// HARDCODED FALLBACK FOR DEBUGGING ONLY
const FALLBACK_SECRET = '3f664d8ac4622c86018c9ff4158d81f4e2b9a0c7d3e5f1g6h8i9j0k1l2m3n4o'
const FALLBACK_CLIENT_ID = 'Ov23liJWu8geK8HsiyH0'
const FALLBACK_CLIENT_SECRET = '01a1223c25936d38e8c03dcbd67bdb4477596dfc'

export const dynamic = 'force-dynamic'

export const { GET, POST } = makeRouteHandler({
  config,
  secret: FALLBACK_SECRET,
  clientId: FALLBACK_CLIENT_ID.trim(),
  clientSecret: FALLBACK_CLIENT_SECRET.trim(),
})
