import Link from 'next/link'

export default function StudioPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Content Studio</h1>
      <p className="mb-4">This project uses Keystatic Cloud for content editing. Open the cloud studio to manage News & Events while we keep the site stable.</p>
      <p className="mb-6"><a className="text-blue-600 underline" href="https://keystatic.cloud/teams/ship-inn/project/ship-inn-news-events" target="_blank" rel="noreferrer">Open Keystatic Cloud — ship-inn-news-events</a></p>
    </div>
  )
}
