# Sanity Studio Setup & Integration (improved)

This guide shows a practical Sanity Studio setup for the `events-news` content on this test site and how to connect it to the Next.js app in this repo.

It covers two common setups and provides copy-paste TypeScript schema examples, CORS & env guidance, GROQ queries, preview tips, webhooks for Vercel, and troubleshooting steps.

**Prerequisites**
- Node.js 18+ and npm (or pnpm)
- A Sanity account (https://www.sanity.io)
- Access to the Next.js repo and (optionally) Vercel project

Quick decision: embedded Studio vs standalone Studio
- Embedded Studio: keep the Studio code inside this repo (e.g. `studio/` or `src/sanity/`) and serve it at `/studio` via the Next dev server. Good for a small project and easier CI.
- Standalone Studio: manage the Studio in a separate folder/repo. Good if you want to host Studio separately or give editors a separate deploy.

If you want me to scaffold a `studio/` folder with the example schemas, say "Scaffold Studio" and I'll create it.

**1) Quick Start — Embedded Studio (recommended for testing)**

Run these commands in PowerShell from the project root to create a `studio/` folder (TypeScript):

```powershell
npm create sanity@latest studio
# choose "clean" or Next.js template, select TypeScript, set dataset (production)
cd studio
npm install
npm run dev
```

- The embedded Studio will usually start at `http://localhost:3333` if run standalone, or if you serve the Studio through Next.js it will be available at `http://localhost:3000/studio` when `npm run dev` is running in the Next app.
- If you choose embedded, ensure your `next.config.js` does not use `output: 'export'` (App Router needs dynamic routes for `/studio`).

**2) Basic `sanity.config.ts` (TypeScript)**
Place or verify the following in `studio/sanity.config.ts`:

```ts
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schema} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Ship Inn CMS',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production',
  plugins: [deskTool()],
  schema: { types: schema.types },
})
```

**3) TypeScript schema examples**
Add these files under `studio/schemas/` (or adapt to your existing `src/sanity/schemaTypes` if you keep the Studio in-repo):

`studio/schemas/news.ts` (TypeScript / minimal):

```ts
export default {
  name: 'news',
  title: 'News',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 96 } },
    { name: 'publishedAt', type: 'datetime', title: 'Published at' },
    { name: 'summary', type: 'text', title: 'Summary' },
    { name: 'coverImage', type: 'image', title: 'Cover Image', options: { hotspot: true } },
    { name: 'body', type: 'array', of: [{ type: 'block' }] },
  ],
}
```

`studio/schemas/event.ts`:

```ts
export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 96 } },
    { name: 'startDate', type: 'datetime', title: 'Start Date' },
    { name: 'endDate', type: 'datetime', title: 'End Date' },
    { name: 'time', type: 'string', title: 'Time' },
    { name: 'summary', type: 'text', title: 'Summary' },
    { name: 'price', type: 'string', title: 'Price' },
    { name: 'location', type: 'string', title: 'Location' },
    { name: 'coverImage', type: 'image', title: 'Cover Image' },
    { name: 'body', type: 'array', of: [{ type: 'block' }] },
  ],
}
```

`studio/schemas/index.ts`:

```ts
import news from './news'
import event from './event'

export default [news, event]
```

Notes: if you already have `src/sanity/schemaTypes/*` used by an embedded Studio, copy these definitions into that folder or register the new `news` and `event` types there (we already added `newsType` and `eventType` to `src/sanity/schemaTypes/` in the repo).

**4) Environment variables — which names to use**
- For Next.js (client + server reads):
  - `SANITY_PROJECT_ID` (required)
  - `SANITY_DATASET` (defaults to `production`)
  - `SANITY_API_VERSION` (e.g. `2025-01-01`)
  - `SANITY_USE_CDN` (`true` for public reads)
  - `SANITY_READ_TOKEN` (optional — for previewing drafts)

- For Studio (local or in CI):
  - `SANITY_STUDIO_PROJECT_ID` or `SANITY_PROJECT_ID` (both work if you wire them)
  - `SANITY_STUDIO_DATASET` or `SANITY_DATASET`

Store these locally in `.env.local` (project root) while developing and add them to Vercel under Project → Settings → Environment Variables for `Production` (and `Preview`).

Example `.env.local` (project root):

```env
SANITY_PROJECT_ID=yourProjectId
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
SANITY_USE_CDN=true
SANITY_READ_TOKEN=sk_... (optional, don't commit)
```

**5) CORS**
Allow your dev & production origins so the site can fetch images and data:

```powershell
npx sanity cors add http://localhost:3000 --allow-credentials
npx sanity cors add https://your-vercel-app.vercel.app
```

**6) GROQ queries (examples)**
The repository has `src/lib/sanityQueries.ts`. Recommended queries:

```js
// NEWS_QUERY
*[_type == "news"] | order(publishedAt desc) {
  _id,
  title,
  summary,
  publishedAt,
  "slug": slug.current,
  "coverImageUrl": coverImage.asset->url
}

// EVENTS_QUERY (only upcoming)
*[_type == "event" && startDate >= now()] | order(startDate asc) {
  _id,
  title,
  summary,
  startDate,
  endDate,
  time,
  price,
  location,
  "slug": slug.current,
  "coverImageUrl": coverImage.asset->url
}
```

If you have legacy `post` documents and want them to appear as `news`, either:
- Add `news` docs and re-create content, or
- Use an interim query that fetches both types, e.g. `*[_type in ["news","post"]] ...` while you migrate.

**7) Preview & Drafts**
To preview drafts in Next.js:
- Create a Next.js Preview API route that sets `preview` cookies and uses `SANITY_READ_TOKEN` to request drafts from Sanity.
- Use `client.fetch(query, params, {token: process.env.SANITY_READ_TOKEN})` for draft reads.

**8) Webhooks (Vercel) to trigger redeploys**
1. In Vercel: Project → Settings → Git → Deploy Hooks → Create Hook → copy URL.
2. In Studio: Settings → API → Webhooks → Create webhook → paste the Vercel hook → select events (Publish, Create, Delete as needed).

Test by publishing a document in the Studio — Vercel should get a webhook and start a new deployment.

**9) Deploying Studio**
- Sanity hosting (simple): inside `studio/` run:

```powershell
cd studio
npx sanity build
npx sanity deploy
```

- Vercel hosting: Build the Studio as a static app and host on Vercel/Netlify. Ensure your `studio/package.json` has `build` script and point the deploy to that folder.

**10) Migrations & content cleanup (optional)**
- If you already have `post` documents, you can either:
  - Create new `news` docs in the Studio and copy content, or
  - Run a small script (using the Sanity JS client and a write token) to copy/transform `post` -> `news`. I can help scaffold that script.

**11) Troubleshooting**
- Build says `projectId missing`:
  - Verify `SANITY_PROJECT_ID` is present in `.env.local` and in Vercel env vars.
- Studio not showing new schemas:
  - Restart the Studio dev process (or Next dev server if embedded).
- Images appear broken:
  - Ensure assets are published and `coverImage.asset->url` exists. Check dataset is `production`.
- Studio route 404 when using Next's `output: 'export'`:
  - Remove `output: 'export'` from `next.config.js` during development so the Studio can mount at `/studio`.

**12) Useful commands**

```powershell
# Run Next.js dev (Studio at /studio if embedded)
npm run dev

# Run Studio standalone
cd studio ; npm run dev

# Add CORS
npx sanity cors add http://localhost:3000 --allow-credentials

# List Sanity projects (CLI must be logged in)
npx sanity projects list
```

**Checklist before production**
- [ ] Add `SANITY_PROJECT_ID` and `SANITY_DATASET` to Vercel env vars
- [ ] Add CORS origin for your production domain
- [ ] Create a Vercel deploy webhook and add it to Studio webhooks
- [ ] Confirm public reads use `SANITY_USE_CDN=true` and preview uses `SANITY_READ_TOKEN` safely

If you want, I can:
- scaffold the `studio/` folder with `news`/`event` schema files inside this repo,
- create a small migration script to convert existing `post` docs into `news`, or
- add a `preview` API route and example client code for draft previewing.

Tell me which follow-up you'd like and I'll implement it next.

---

**Quick checklist — I did the heavy lifting, do these final steps (copy/paste)**

- **Add Vercel env vars (Main site + Studio project)**

  1. Open your project in https://vercel.com
  2. Go to Project → Settings → Environment Variables
  3. Add these three variables for Production (and Preview):

     - `SANITY_PROJECT_ID` = `98yj74tk`
     - `SANITY_DATASET` = `production`
     - `SANITY_API_VERSION` = `2025-01-01`

- **Create a Vercel Deploy Hook (one-click in Vercel)**

  1. Vercel → Project → Settings → Git → Deploy Hooks → Create Hook → copy the URL.

- **Add the Deploy Hook to Sanity Studio webhooks (paste the URL)**

  1. Open `https://ship-inn-studio.vercel.app/` (your Studio) and log in.
  2. Studio → Settings (left) → API → Webhooks → Create webhook.
  3. Paste the Vercel Hook URL, enable event: **Publish** (and optionally Create/Delete), Save.

- **Test**

  1. In the Studio, open a `news` or `event` document and click **Publish**.
  2. Vercel should start a redeploy for the main site. Confirm the changes on your public site once deploy finishes.

If you want, I can add these env vars and create the Vercel Hook for you — I will need access (a Vercel token or a short-lived invite). Otherwise follow the three GUI steps above.
