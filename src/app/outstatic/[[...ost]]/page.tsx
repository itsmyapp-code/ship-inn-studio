import 'outstatic/outstatic.css'
import { Outstatic } from 'outstatic'
import { OstClient } from 'outstatic/client'

export default async function Page({ params }: { params: Promise<{ ost: string[] }> }) {
  const outstatic = await Outstatic()
  const resolvedParams = await params
  return <OstClient ostData={outstatic} params={resolvedParams} />
}
