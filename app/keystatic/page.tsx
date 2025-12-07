import Link from 'next/link'

export default function KeystaticPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Keystatic Studio</h1>
      <p className="mb-4">The Keystatic editing studio is hosted in Keystatic Cloud for this project. Use the cloud studio to manage content while I fix embedding the studio into the site.</p>
      <p className="mb-4">Open the project admin in a new tab:</p>
      <p className="mb-6"><a className="text-blue-600 underline" href="https://keystatic.cloud/teams/ship-inn/project/ship-inn-news-events" target="_blank" rel="noreferrer">Open Keystatic Cloud — ship-inn-news-events</a></p>
      <p className="text-sm text-gray-600">If you want the studio embedded on the site at <code>/keystatic</code>, tell me and I'll attempt to add the package or a different safe embedding.</p>
    </div>
  )
}
