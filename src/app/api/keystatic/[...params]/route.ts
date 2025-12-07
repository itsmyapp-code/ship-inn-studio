import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '../../../../../keystatic.config'

export const { GET, POST } = makeRouteHandler({
  config,
  secret: process.env.KEYSTATIC_SECRET || 'fallback-secret-key-for-ship-inn-studio-123',
})
