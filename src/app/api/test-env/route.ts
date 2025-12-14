import { NextResponse } from 'next/server'
import config from '../../../../keystatic.config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID || ''
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || ''
  const secret = process.env.KEYSTATIC_SECRET || ''

  // Get all environment keys to check for typos/whitespace
  const allKeys = Object.keys(process.env).filter(key => !key.startsWith('npm_') && !key.startsWith('__'))

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasClientId: !!clientId,
      clientIdPrefix: clientId.substring(0, 5) + '...',
      hasClientSecret: !!clientSecret,
      clientSecretPrefix: clientSecret.substring(0, 5) + '...',
      hasSecret: !!secret,
      secretLength: secret.length,
      secretHint: secret ? secret.substring(0, 2) + '...' : 'EMPTY',
    },
    availableEnvKeys: allKeys.sort(), // List all keys to check for " KEYSTATIC_SECRET" etc.
  }, { status: 200 })
}
