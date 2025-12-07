import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '../../../../../keystatic.config'

export const dynamic = 'force-dynamic'

const { GET: _GET, POST: _POST } = makeRouteHandler({
  config,
  secret: process.env.KEYSTATIC_SECRET || 'fallback-secret-key-for-ship-inn-studio-123',
})

export async function GET(request: Request, props: { params: Promise<{ params: string[] }> }) {
  const params = await props.params
  return _GET(request, params as any)
}

export async function POST(request: Request, props: { params: Promise<{ params: string[] }> }) {
  const params = await props.params
  return _POST(request, params as any)
}
