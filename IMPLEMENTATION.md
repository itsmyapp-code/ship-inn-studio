The Implementation Guide (VS Code)
Save this as IMPLEMENTATION.md in your project root. It contains every file you need to copy-paste to get the system working.

Markdown

# Developer Implementation Guide: Ship Inn News & Automation

## 1. Clean & Install
Remove Sanity remnants and install the new stack.

```bash
# 1. Remove Sanity (if present)
npm uninstall sanity next-sanity @sanity/client @sanity/image-url next-sanity-image

# 2. Install Keystatic & RSS
npm install @keystatic/core @keystatic/next rss
2. Environment Variables (.env.local)
Get the MailerLite API Key from: Integrations -> API.

Code snippet

# Keystatic (Local mode doesn't need these, but Cloud does)
NEXT_PUBLIC_KEYSTATIC_PROJECT=... # Add later when you deploy
NEXT_PUBLIC_KEYSTATIC_MODE=github

# MailerLite
MAILERLITE_API_KEY=your_mailerlite_api_token_here
3. Keystatic Config (The CMS)
File: keystatic.config.ts (Root)

TypeScript

import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: process.env.NODE_ENV === 'development'
    ? { kind: 'local' }
    : { kind: 'cloud', project: 'your-cloud-project-name' }, // Update after deploying
  collections: {
    news: collection({
      label: 'News Updates',
      slugField: 'title',
      path: 'content/news/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Headline' } }),
        publishedDate: fields.date({ label: 'Date Posted', validation: { isRequired: true } }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/images/news',
          publicPath: '/images/news',
        }),
        content: fields.document({ label: 'Content', formatting: true, links: true, images: true }),
      },
    }),
    events: collection({
      label: 'Upcoming Events',
      slugField: 'title',
      path: 'content/events/*',
      format: { contentField: 'description' },
      schema: {
        title: fields.slug({ name: { label: 'Event Name' } }),
        eventDate: fields.date({ label: 'Date of Event', validation: { isRequired: true } }),
        location: fields.text({ label: 'Location' }),
        description: fields.document({ label: 'Event Details', formatting: true }),
      },
    }),
  },
});
4. The RSS Feed Generator (For MailerLite)
File: app/feed.xml/route.ts This creates the endpoint https://site.com/feed.xml that MailerLite watches.

TypeScript

import RSS from 'rss';
import { createReader } from '@keystatic/core/reader';
import config from '../../keystatic.config';

export async function GET() {
  const reader = createReader(process.cwd(), config);
  const posts = await reader.collections.news.all();
  const events = await reader.collections.events.all();

  // Combine and Sort by Date (Newest first)
  const allItems = [
    ...posts.map(p => ({ ...p, type: 'news', date: p.entry.publishedDate })),
    ...events.map(e => ({ ...e, type: 'event', date: e.entry.eventDate }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const feed = new RSS({
    title: 'The Ship Inn News',
    site_url: '[https://shipinnporlockweir.com](https://shipinnporlockweir.com)',
    feed_url: '[https://shipinnporlockweir.com/feed.xml](https://shipinnporlockweir.com/feed.xml)',
  });

  allItems.forEach((item) => {
    feed.item({
      title: item.entry.title,
      description: item.type === 'event' 
        ? `Upcoming Event on ${item.entry.eventDate} at ${item.entry.location}` 
        : 'Latest news from The Ship Inn.',
      url: `https://shipinnporlockweir.com/news-events`, 
      date: item.date,
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: { 'Content-Type': 'application/xml' },
  });
}
5. Newsletter Signup API (Secure Proxy)
File: app/api/newsletter/route.ts

TypeScript

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  try {
    const res = await fetch('[https://connect.mailerlite.com/api/subscribers](https://connect.mailerlite.com/api/subscribers)', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({ email: email }),
    });
    
    if (!res.ok) throw new Error('MailerLite Error');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
6. Frontend: Newsletter Component
File: components/NewsletterForm.tsx

TypeScript

'use client';
import { useState } from 'react';

export default function NewsletterForm() {
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e: any) {
    e.preventDefault();
    setStatus('loading');
    const email = e.target.email.value;
    
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (res.ok) setStatus('success');
    else setStatus('error');
  }

  if (status === 'success') return <div className="text-green-600 font-bold p-4">You're on the list!</div>;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-gray-50 rounded">
      <input name="email" type="email" placeholder="Enter email for updates..." className="border p-2 rounded flex-1" required />
      <button type="submit" disabled={status === 'loading'} className="bg-blue-900 text-white px-4 py-2 rounded">
        {status === 'loading' ? '...' : 'Sign Up'}
      </button>
    </form>
  );
}
7. Frontend: News & Events Page (Smart Filtering)
File: app/news-events/page.tsx

TypeScript

import { createReader } from '@keystatic/core/reader';
import config from '../../keystatic.config';
import { DocumentRenderer } from '@keystatic/core/renderer';
import NewsletterForm from '../../components/NewsletterForm';

const reader = createReader(process.cwd(), config);

export default async function Page() {
  const news = await reader.collections.news.all();
  const events = await reader.collections.events.all();
  
  // Logic: Hide events older than today
  const today = new Date(); 
  today.setHours(0,0,0,0);
  
  const upcomingEvents = events
    .filter(e => new Date(e.entry.eventDate) >= today)
    .sort((a, b) => new Date(a.entry.eventDate).getTime() - new Date(b.entry.eventDate).getTime());

  const sortedNews = news.sort((a, b) => new Date(b.entry.publishedDate).getTime() - new Date(a.entry.publishedDate).getTime());

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-12">
      
      {/* Left 2 Cols: Content */}
      <div className="md:col-span-2 space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? <p className="text-gray-500">No upcoming events.</p> : (
            <div className="grid gap-6">
              {upcomingEvents.map(e => (
                <div key={e.slug} className="border p-6 rounded-lg shadow-sm bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{e.entry.title}</h3>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-bold">{e.entry.eventDate}</span>
                  </div>
                  <p className="text-gray-600 mb-2">📍 {e.entry.location}</p>
                  <div className="prose prose-sm"><DocumentRenderer document={e.entry.description} /></div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Latest News</h2>
          {sortedNews.map(n => (
            <article key={n.slug} className="mb-8 border-b pb-8">
              {n.entry.coverImage && <img src={n.entry.coverImage} className="rounded mb-4 h-64 w-full object-cover" />}
              <h3 className="text-2xl font-bold mb-2">{n.entry.title}</h3>
              <div className="text-gray-500 text-sm mb-4">{n.entry.publishedDate}</div>
              <div className="prose"><DocumentRenderer document={n.entry.content} /></div>
            </article>
          ))}
        </section>
      </div>

      {/* Right Col: Newsletter Sticky */}
      <aside className="md:col-span-1">
        <div className="sticky top-10">
          <h3 className="text-xl font-bold mb-4">Stay in the loop</h3>
          <p className="mb-4 text-gray-600">Join our mailing list for exclusive offers and event announcements.</p>
          <NewsletterForm />
        </div>
      </aside>

    </div>
  );
}