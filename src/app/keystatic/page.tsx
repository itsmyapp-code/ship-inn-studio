import Link from 'next/link'

export default function KeystaticPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Keystatic Studio</h1>
      <p className="mb-4">This project uses Keystatic Cloud for content editing.</p>
      <p className="mb-6">
        <a 
          className="text-blue-600 underline text-lg" 
          href="https://keystatic.cloud/teams/ship-inn/project/ship-inn-news-events" 
          target="_blank" 
          rel="noreferrer"
        >
          Click here to open Keystatic Cloud Admin
        </a>
      </p>
    </div>
  )
}
