import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '../../../../../keystatic.config'

// Debug logging to check if environment variables are loaded
console.log('Keystatic Route Handler Loaded')
console.log('Environment Check:')
console.log('- NODE_ENV:', process.env.NODE_ENV)
console.log('- KEYSTATIC_GITHUB_CLIENT_ID:', process.env.KEYSTATIC_GITHUB_CLIENT_ID ? 'Set' : 'MISSING')
console.log('- KEYSTATIC_GITHUB_CLIENT_SECRET:', process.env.KEYSTATIC_GITHUB_CLIENT_SECRET ? 'Set' : 'MISSING')
console.log('- KEYSTATIC_SECRET:', process.env.KEYSTATIC_SECRET ? 'Set' : 'MISSING')

export const { GET, POST } = makeRouteHandler({
  config,
  secret: process.env.KEYSTATIC_SECRET || 'fallback-secret-key-for-ship-inn-studio-123',
})
