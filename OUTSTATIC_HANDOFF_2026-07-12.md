# Outstatic Debug Handoff (2026-07-12)

## Objective
Restore reliable delete behavior in Outstatic admin for:
- https://ship-inn-website.vercel.app/outstatic/events

## Current User-Visible Problem
- Delete action in Outstatic gets stuck on "Deleting" spinner.
- Operation may fail silently (weak error surfacing in UI).

## What Was Done

### 1) Environment/OAuth alignment work
- Confirmed Outstatic requires GitHub OAuth + Vercel `OST_*` env vars.
- Callback expected:
  - `https://ship-inn-website.vercel.app/api/outstatic/callback`
- Investigated prior callback issue `{"error":"no_access_token"}`.

### 2) Code changes applied in workspace

#### A) Outstatic page integration
File:
- `src/app/outstatic/[[...ost]]/page.tsx`

Current content in working tree:
- Explicit Outstatic config:
  - `repoOwner: process.env.OST_REPO_OWNER`
  - `repoSlug: process.env.OST_REPO_SLUG`
  - `repoBranch: process.env.OST_REPO_BRANCH || 'main'`

Notes:
- Previous attempt used branch normalization to `refs/heads/...`.
- Latest local state has this removed and uses plain branch string (`main`), matching Outstatic expectations.

#### B) Metadata bootstrap file
File added:
- `outstatic/content/metadata.json`

Content:
```json
{
  "commit": "",
  "generated": "2026-07-12T00:00:00.000Z",
  "metadata": []
}
```

Rationale:
- Outstatic delete/update preflight appears to depend on metadata file presence.

### 3) Deployments
- Multiple production deploys were run during troubleshooting.
- Most recently confirmed active production deployment at one point:
  - `dpl_EpCpwgx5EuK9aBXDvZFzn7aG3fy4`

## Current Local Git State (important)
Modified/uncommitted files:
1. `src/app/outstatic/[[...ost]]/page.tsx` (Outstatic config changes)
2. `outstatic/content/metadata.json` (new file)
3. `src/app/(website)/news-events/page.tsx` (unrelated pre-existing local edit; gift card styling)

Do NOT accidentally ship unrelated `news-events` styling change unless intended.

## Why This Has Been Difficult
- Failure crosses multiple boundaries: OAuth, Vercel env scope, Outstatic API behavior, and branch/content metadata assumptions.
- Outstatic UI often does not clearly surface delete failures.
- Public event listing can hide past events, causing false positives for deletion success.

## Most Likely Remaining Failure Modes
1. GitHub OAuth token has insufficient repo access.
2. `OST_REPO_BRANCH` mismatch with actual default branch.
3. GitHub App/OAuth callback or env mismatch across Production/Preview scope.
4. Delete request failing server-side while UI spinner fails to reset.

## What Next AI Should Do (strict order)
1. Verify exact production env vars in Vercel (Production scope):
   - `OST_GITHUB_ID`
   - `OST_GITHUB_SECRET`
   - `OST_TOKEN_SECRET`
   - `OST_REPO_OWNER`
   - `OST_REPO_SLUG`
   - `OST_REPO_BRANCH` (plain branch name, e.g. `main`)
2. Re-authenticate in Outstatic and test delete on a disposable test item.
3. Capture concrete error artifact:
   - Browser network response for delete endpoint
   - Browser console error
   - Vercel runtime logs for matching timestamp
4. If UI spinner still hangs, patch client/server path to always clear loading state and show actionable error.
5. Deploy ONLY relevant files.

## Useful Commands
```powershell
# Build sanity
npm run build

# List Vercel env vars for project
vercel env ls

# Inspect current production deployment alias target
vercel inspect ship-inn-website.vercel.app

# Stream production logs (adjust syntax if CLI options change)
vercel logs ship-inn-website.vercel.app
```

## Notes About Logs
- A previous command failed:
  - `vercel logs ship-inn-website.vercel.app --environment production --no-branch --since 10m --follow --expand`
- Next AI should use currently supported `vercel logs` flags/version semantics.

## Handoff Summary
- Core fix attempts are in place locally (Outstatic branch handling + metadata file).
- Deletion reliability still needs an end-to-end verified pass with captured failure evidence if it still fails.
- Unrelated local style edits exist and should be excluded from focused Outstatic deployment.
