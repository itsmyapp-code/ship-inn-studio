import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '../../../../../keystatic.config'

// HARDCODED FALLBACK FOR DEBUGGING ONLY
// Since Vercel Env Vars are failing to load, we are hardcoding the secret temporarily to unblock auth.
// This should be reverted once the Env Var issue is resolved.
const FALLBACK_SECRET = '3f664d8ac4622c86018c9ff4158d81f4e2b9a0c7d3e5f1g6h8i9j0k1l2m3n4o'

export const { GET, POST } = makeRouteHandler({
  config,
  secret: process.env.KEYSTATIC_SECRET || FALLBACK_SECRET,
})
