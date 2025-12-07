"use client"
import dynamic from 'next/dynamic'
import config from '../../keystatic.config'

const Studio = dynamic(() => import('@keystatic/next').then((m) => m.Studio), { ssr: false })

export default function KeystaticPage() {
  return <Studio config={config} />
}
