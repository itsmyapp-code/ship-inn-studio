Sanity Studio (scaffold)
=========================

This folder is a minimal scaffold of a Sanity Studio for the Ship Inn site. It contains example `news` and `event` schemas and a `sanity.config.ts` to get started quickly.

Quick start
-----------

1. In PowerShell, from the repo root run:

```powershell
cd studio
npm install
npm run dev
```

2. Open the Studio (usually at `http://localhost:3333`). If you prefer an embedded Studio served by the Next app, run the Next dev server (`npm run dev` at project root) and access `/studio` if configured.

Notes
-----
- Add `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` to `studio/.env` or use `SANITY_PROJECT_ID` in the project root.
- The scaffold uses the official `sanity` package. If you prefer the CLI flow, run `npm create sanity@latest studio` instead and copy these schema files into the created Studio.

Next steps I can do for you
--------------------------
- Register the schema types with an embedded Studio already in `src/sanity/` (we added `newsType`/`eventType` there earlier),
- Create migration script to move existing `post` documents into `news`,
- Wire a preview route for draft previews in Next.js.
