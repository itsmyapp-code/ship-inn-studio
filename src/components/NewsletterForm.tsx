'use client'
import { useState } from 'react'

export default function NewsletterForm() {
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  async function handleSubmit(e: any) {
    e.preventDefault()
    setStatus('loading')
    const email = e.target.email.value

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'success') return <div className="text-green-600 font-bold p-4 text-lg">You're on the list!</div>

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-gray-50 rounded">
      <input name="email" type="email" placeholder="Enter email for updates..." className="border p-2 rounded flex-1 text-lg" required />
      <button type="submit" disabled={status === 'loading'} className="bg-blue-900 text-white px-4 py-2 rounded text-lg font-medium">
        {status === 'loading' ? '...' : 'Sign Up'}
      </button>
    </form>
  )
}
