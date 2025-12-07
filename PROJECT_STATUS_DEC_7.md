# Project Status - December 7, 2025

## Current Situation
The website is deployed to Vercel. The public pages work. Keystatic Studio loads at `/keystatic` and authenticates with GitHub.

## Critical Issue
**Keystatic API Failure:**
- **Symptom:** When trying to view collections or create posts, the UI shows "Unable to load collection".
- **Console Error:** `GET /api/keystatic/tree/ 404 (Not Found)` and `SyntaxError: Unexpected token 'N', "Not Found" is not valid JSON`.
- **Cause:** The API route handler at `src/app/api/keystatic/[...params]/route.ts` is failing to correctly process the request parameters. This is due to a breaking change in **Next.js 16** where route parameters (`params`) became asynchronous (Promises), and the Keystatic library adapter hasn't fully aligned with this yet in our current configuration.

## Configuration
- **Framework:** Next.js 16.0.7
- **CMS:** Keystatic (GitHub Mode)
- **Vercel Env Vars:**
  - `KEYSTATIC_GITHUB_CLIENT_ID`: (Set)
  - `KEYSTATIC_GITHUB_CLIENT_SECRET`: (Set)
  - `KEYSTATIC_SECRET`: (Set)
  - `NEXT_PUBLIC_KEYSTATIC_PROJECT`: (Set)

## Recent Attempts
1.  Updated `keystatic.config.ts` to handle storage modes robustly.
2.  Added a wrapper to `src/app/api/keystatic/[...params]/route.ts` to `await` the `params` promise before passing to Keystatic.
3.  Updated `@keystatic/core` and `@keystatic/next` to latest versions.

## Next Steps (When Resuming)
1.  **Verify API Route Wrapper:** The wrapper in `route.ts` likely needs a slight adjustment to match exactly how Keystatic expects the `params` object structure after unwrapping the Promise.
2.  **Downgrade Next.js (Option B):** If the wrapper continues to fail, downgrading to Next.js 15 or 14 would immediately resolve the async params issue.
3.  **Check Vercel Logs:** Inspect the Function logs in Vercel for the specific 404 cause (path mismatch vs internal error).
