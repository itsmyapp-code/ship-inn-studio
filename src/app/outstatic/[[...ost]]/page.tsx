import 'outstatic/outstatic.css'
import { Outstatic } from 'outstatic'
import { OstClient } from 'outstatic/client'

export default function Page({ params }: { params: { ost: string[] } }) {
  return <Outstatic params={params} />
}
