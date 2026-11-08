# Customer Workflow & Implementation Plan: Adding Facebook Reels to The Ship Inn Website

**Website:** `theshipinnporlockweir.co.uk`  
**Date Saved:** November 2026  
**Purpose:** Breakdown of what the customer (The Ship Inn team) will need to do to add and manage their Facebook Reels and videos on the website, along with the technical implementation plan for when you are ready to build it.

---

## Executive Summary

There are **two realistic ways** to set this up for the customer, depending on whether they want **selective control** (choosing which Reels go on the website) or **100% hands-off automation** (every Facebook Reel goes onto the website automatically):

1. **Option A: Built-in "Reels Manager" (`/admin/reels`) — ~20 Seconds per Reel**  
   Works just like their existing **Menu Manager** (`/admin/menus`) and **Gallery Manager** (`/admin/gallery`). The customer simply copies a Reel link from the Facebook app on their phone and pastes it into `/admin/reels`.
2. **Option B: Automatic Facebook Sync (Feed Widget) — 0 Seconds per Reel (after a 2-minute one-time login)**  
   A one-time connection to their Facebook Page. After that, whenever they post a Reel on Facebook, it automatically appears on the website without them ever logging into the website.

---

## Option A: Using a Built-in Website "Reels Manager" (`/admin/reels`)

This approach matches the existing custom admin tools already built on the website (`/admin/gallery` and `/admin/menus`).

### What the Customer Needs to Do (Step-by-Step)

#### Step 1: Post the Reel on Facebook as Normal
* The customer creates and publishes their Reel on **The Ship Inn Porlock Weir** Facebook Page using their phone or computer as they already do.

#### Step 2: Copy the Link from Facebook
* **On a Phone (Facebook App):**
  1. Open the Reel on Facebook.
  2. Tap the **Share** arrow icon on the right side of the screen.
  3. Tap **Copy Link** at the bottom.
* **On a Computer (Web Browser):**
  1. Click on the Reel.
  2. Either click **Share → Copy link**, or simply copy the web address from the top browser bar.

#### Step 3: Paste it into the Website's Reels Manager
1. Go to `https://www.theshipinnporlockweir.co.uk/admin/reels` *(Tip: they can save this page as an icon on their phone's home screen so it opens with one tap).*
2. **Paste the Facebook link** into the *"Facebook Reel / Video Link"* box.
3. *(Optional)* Type a short title or caption (e.g., *"Live music in the bar tonight!"* or *"Sunday Roast fresh out of the kitchen"*).
4. *(Optional)* Choose where it should appear (e.g., *Gallery*, *News & Events*, or *Both*).
5. Tap **"Publish Reel"**.

#### Step 4: Removing an Old Reel (When Needed)
1. Scroll down to the **"Current Website Reels"** list on the same `/admin/reels` page.
2. Tap the **🗑️ Delete** button next to any Reel they want to take down.

> **Bonus for News & Events:** If we also enable auto-embedding in `/news-events`, the customer can paste a Facebook Reel link directly into the body of any News or Event post in Outstatic CMS, and it will automatically turn into a playable video inside that article.

---

## Option B: Automatic Facebook Feed Sync (Third-Party Widget)

If the customer does not want to copy and paste links at all, we can embed an automated social feed widget (such as **Curator.io**, **Behold**, **Elfsight**, or **SociableKIT**) on the website.

### What the Customer Needs to Do (Step-by-Step)

#### One-Time Setup (Takes ~2 Minutes)
1. You send the customer an invitation link to connect their Facebook account to the feed tool.
2. The customer clicks **"Continue with Facebook"** (must be logged into the Facebook account that manages *The Ship Inn Porlock Weir* page).
3. Facebook asks: *"Choose what Pages you allow [Widget] to access"* → They tick **The Ship Inn Porlock Weir** and click **Save**.

#### Day-to-Day Routine
* **Nothing on the website.**
* Whenever they post a Reel to The Ship Inn's Facebook Page from their phone, the widget automatically detects it and adds it to the website within 15–60 minutes.
* If they delete a Reel from Facebook, it automatically disappears from the website.

#### Occasional Maintenance (~Once a Year)
* **If the customer changes their personal Facebook password**, Facebook security automatically disconnects third-party apps. If that happens, the customer simply receives an email link to click *"Reconnect Facebook"* (takes 30 seconds).

---

## Side-by-Side Comparison for the Customer

| Feature / Requirement | Option A: Built-in `/admin/reels` (Copy & Paste) | Option B: Automatic Sync Widget |
| :--- | :--- | :--- |
| **Customer's Daily Effort** | Copy link from Facebook → Paste on `/admin/reels` (~20 secs) | **Zero** (Just post to Facebook as normal) |
| **Works from a Mobile Phone?** | ✅ Yes (100% mobile-friendly) | ✅ Yes (They only use the Facebook app) |
| **Needs GitHub / CMS Login?** | ❌ No | ❌ No |
| **Needs HTML / Embed Codes?** | ❌ No (Plain share links work automatically) | ❌ No |
| **Select Which Reels Appear?** | ✅ Yes (Only Reels they paste go on the website) | ⚠️ All Reels go on site (unless moderated in widget dashboard) |
| **Ongoing Running Cost** | **£0 / month** (Built into website) | **£0 / month** (Free tier with view limits/badge) or **~£5 / month** (Pro tier) |
| **Password Change Issue?** | ✅ Never disconnects if they change their FB password | ⚠️ Must click "Reconnect" if they change their FB password |

---

## Important Facebook Rules the Customer Must Know (Applies to Both Options)

Regardless of which option is chosen, Facebook enforces three rules on embedded Reels that should be explained to the customer:

1. **The Reel Must Be Set to "Public" (`🌐`):**  
   Reels posted to a Facebook Business Page (*The Ship Inn Porlock Weir*) are Public by default. However, if the customer posts a Reel to their *personal* Facebook profile with privacy set to *"Friends Only"*, Facebook will block it from showing on the website.
2. **Copyrighted Chart Music May Be Muted Outside Facebook:**  
   Original audio (talking, live band in the pub, ambient harbour sounds, or royalty-free music) plays with full sound on the website. However, if the customer adds commercial chart music from Facebook's music sticker library (e.g., Ed Sheeran), music licensing rules sometimes cause Facebook to mute the audio when played on an external website until the visitor clicks *"Watch on Facebook"*.
3. **"Allow Embedding" Must Stay Enabled on Their Facebook Page:**  
   This is turned **On** by default for all Facebook Business Pages, so they don't need to touch it unless someone previously turned it off in Facebook Page Settings.

---

## Technical Implementation Checklist (For Future Build)

When ready to implement **Option A**:
1. **Create `<FacebookReelEmbed />` (`src/components/FacebookReelEmbed.tsx`):** Responsive 9:16 vertical container (`https://www.facebook.com/plugins/video.php?href=...&show_text=false`) with `loading="lazy"` and a fallback *"Watch on Facebook"* link.
2. **Create URL Resolver (`src/lib/facebookUtils.ts`):** Normalizes `facebook.com/reel/...`, `facebook.com/.../videos/...`, `fb.watch/...`, and resolves `facebook.com/share/r/...` mobile share redirects server-side.
3. **Create Admin Page & API (`src/app/(website)/admin/reels/page.tsx` + `src/app/api/reels/route.ts`):** Matches `/admin/gallery` and commits new/deleted Reel markdown items directly to `outstatic/content/reels/` and GitHub.
4. **Auto-Embed in News & Events (`src/app/(website)/news-events/[slug]/page.tsx` & `events/[slug]/page.tsx`):** Automatically converts standalone Facebook Reel/video links in Markdown into embedded players.
5. **Display on Public Pages:** Add Reels section to `/news-events` and/or `/gallery`.

