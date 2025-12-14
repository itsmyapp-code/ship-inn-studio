// import 'outstatic/outstatic.css'
import { Outstatic } from 'outstatic'
import { OstClient } from 'outstatic/client'

export default async function Page({ params }: { params: { ost: string[] } }) {
  const outstatic = await Outstatic()
  return <OstClient ostData={outstatic} params={params} />
}
