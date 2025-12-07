Seale Arms Clone - Quick Guide

This folder contains an automated cloning script to produce a branded copy of this website for "The Seale Arms".

How it works
1. `node scripts/brand-clone.js "The Seale Arms" seale-arms seale-arms-website`
   - Replaces common branding strings (e.g. "The Ship Inn" -> "The Seale Arms" and `ship-inn` -> `seale-arms`).
   - Copies all non-ignored files into `seale-arms-website`.
   - Skips `node_modules`, `.git`, `.next`, `.vercel` folders.

2. After cloning:
   - `cd ../seale-arms-website`
   - `npm install`
   - `npm run dev` to start the dev server, or `npm run build` to test the production build.

Notes & next steps
- The script performs string replacements across text files, but manual review is strongly recommended for:
  - Contact details (phone, email, address)
  - Any images that include the old branding inside the image pixels (replace manually)
  - SEO metadata and any copy that should be tailored more precisely for The Seale Arms

- To deploy: connect the new folder to your Vercel account and run `vercel --prod`, or follow your preferred deployment process.

If you'd like, I can run the script now to create the `seale-arms-website` folder and test building it for you.