import { NextResponse } from 'next/server'
import config from '../../../../keystatic.config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID || ''
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || ''
  const secret = process.env.KEYSTATIC_SECRET || ''

  const storageConfig = config.storage

  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasClientId: !!clientId,
      clientIdPrefix: clientId.substring(0, 5) + '...',
      hasClientSecret: !!clientSecret,
      clientSecretPrefix: clientSecret.substring(0, 5) + '...',
      hasSecret: !!secret,
      secretLength: secret.length,
    },
    keystaticConfig: {
      storageKind: storageConfig.kind,
      // @ts-ignore
      repo: storageConfig.repo,
    }
  }, { status: 200 })
}
