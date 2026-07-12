import 'outstatic/outstatic.css'
import { Outstatic } from 'outstatic'
import { OstClient } from 'outstatic/client'

export default async function Page({ params }: { params: Promise<{ ost: string[] }> }) {
  const repoBranch = process.env.OST_REPO_BRANCH || 'main'

  const outstatic = await Outstatic({
    repoOwner: process.env.OST_REPO_OWNER,
    repoSlug: process.env.OST_REPO_SLUG,
    repoBranch,
  })
  const resolvedParams = await params
  return <OstClient ostData={outstatic} params={resolvedParams} />
}
