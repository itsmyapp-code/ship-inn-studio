"use client"
import { Studio } from '@keystatic/next'
import config from '../../../keystatic.config'

export default function KeystaticPage() {
  return <Studio config={config} />
}
