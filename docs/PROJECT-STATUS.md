# The Ship Inn Website — Project Status & Documentation

**Last Updated:** September 23, 2026  
**Status:** 🚀 LIVE, OPTIMIZED & FULLY FUNCTIONAL

---

## 🎯 Production Overview

The official website for **The Ship Inn, Porlock Weir** is live, running on Next.js 16 (Turbopack) with custom admin tools and integrated Outstatic CMS.

### 🌐 Key Production URLs
* **Live Website:** [`https://www.theshipinnporlockweir.co.uk`](https://www.theshipinnporlockweir.co.uk)
* **Vercel Staging/Preview:** [`https://ship-inn-website.vercel.app`](https://ship-inn-website.vercel.app)
* **Outstatic CMS Dashboard:** [`https://www.theshipinnporlockweir.co.uk/outstatic`](https://www.theshipinnporlockweir.co.uk/outstatic)
* **Menu Manager & PDF Uploader:** [`https://www.theshipinnporlockweir.co.uk/admin/menus`](https://www.theshipinnporlockweir.co.uk/admin/menus)
* **Gallery Manager & Photo Uploader:** [`https://www.theshipinnporlockweir.co.uk/admin/gallery`](https://www.theshipinnporlockweir.co.uk/admin/gallery)
* **RSS Feed:** [`https://www.theshipinnporlockweir.co.uk/feed.xml`](https://www.theshipinnporlockweir.co.uk/feed.xml)

---

## 📚 Client User Guides & Documentation

| Document | Format | Description |
| :--- | :--- | :--- |
| **Complete Website & CMS Manual** | [HTML (`/docs/OUTSTATIC-USER-MANUAL.html`)](https://www.theshipinnporlockweir.co.uk/docs/OUTSTATIC-USER-MANUAL.html) | Version 2.0 comprehensive client guide |
| **Complete Website & CMS Manual** | [Word Doc (`.docx`)](https://www.theshipinnporlockweir.co.uk/docs/The-Ship-Inn-Website-Management-Guide.docx) | Distributable Word format for staff/owners |
| **Gallery Manager Quick Guide** | [HTML](https://www.theshipinnporlockweir.co.uk/docs/CLIENT-GALLERY-GUIDE.html) / [Markdown](https://www.theshipinnporlockweir.co.uk/docs/CLIENT-GALLERY-GUIDE.md) | 1-minute photo uploader guide |
| **Menu Manager Quick Guide** | [HTML](https://www.theshipinnporlockweir.co.uk/docs/CLIENT-MENU-GUIDE.html) / [Markdown](https://www.theshipinnporlockweir.co.uk/docs/CLIENT-MENU-GUIDE.md) | 1-minute PDF menu uploader guide |

---

## ✅ Implemented Features & Architecture

### 1. Website Pages
| Page Route | Description | CMS Integration |
| :--- | :--- | :--- |
| `/` | Homepage with hero slides, welcoming text, and feature cards | Outstatic `pages/home` |
| `/rooms` | Accommodation, cabin details, booking links | Dynamic + Outstatic |
| `/food-drink` | Pub dining, drink lists, live downloadable PDF menus | Outstatic `menus` + `/admin/menus` |
| `/gallery` | Interactive filterable image gallery with lightbox | Outstatic `gallery` + `/admin/gallery` |
| `/news-events` | News announcements, live events, tides, weather | Outstatic `events` + `news` |
| `/events/[slug]` | Individual event pages with flyer/poster hero display | Outstatic `events` |
| `/news-events/[slug]` | Individual news articles | Outstatic `news` |
| `/contact` | Global opening hours, phone, email, address | Outstatic `pages/contact` |
| `/accessibility` | Accessibility guide and information | Static + Outstatic |
| `/terms` & `/privacy` | Legal compliance pages | Static |

### 2. Dedicated 1-Minute Admin Tools
* **Menu Manager (`/admin/menus`)**:
  * Uploads `.pdf` menus directly into `/public/menus/`.
  * Creates and synchronizes markdown documents in `outstatic/content/menus/`.
  * Commits changes directly to GitHub via REST API (`/api/upload-menu`) for automated production deployments.
* **Gallery Manager (`/admin/gallery`)**:
  * Single or batch photo uploading with live preview and category preset buttons (🍽️ *Food & Drink*, 🪵 *Interior & Bar*, 🏡 *Exterior & Garden*, 🛏️ *Rooms & Cabins*, 🌿 *Surroundings*).
  * Creates Outstatic markdown documents in `outstatic/content/gallery/`.
  * Allows managing/deleting live gallery photos directly from the admin grid (`/api/upload-gallery`).
* **Cross-Navigation**:
  * Unified admin header linking between Menu Manager, Gallery Manager, Outstatic CMS, and the live site.

### 3. Outstatic CMS
* **Version:** 2.0.17
* **Authentication:** GitHub OAuth with session encryption.
* **Content Storage:** Git-backed Markdown (`outstatic/content/`), zero database overhead.
* **Collections:**
  * `pages` — Homepage, Food & Drink, Contact, Rooms, etc.
  * `menus` — Breakfast, Lunch, Evening, Sunday Lunch, and Specials.
  * `gallery` — Photos categorized for the gallery page.
  * `events` — Upcoming pub events with dates, times, and flyer image extraction.
  * `news` — Blog updates and pub announcements.

### 4. Interactive Conversion Tracking (Vercel Web Analytics + GA4)
* **Custom Event Tracking (`/src/lib/analytics.ts`)**:
  * 📞 **Click-to-Call Phone Numbers (`Phone Call Click`)**: Tracked across Footer, Contact page details, Contact CTA, Rooms booking CTA, and Food & Drink reservation CTA.
  * ✉️ **Direct Email Clicks (`Direct Email Click`)**: Tracked across Footer, Contact page details & CTA, Food & Drink CTA, Legal, Terms, Privacy, Cookies, and Accessibility pages.
  * 📝 **Form Submissions (`Form Submission`)**: Tracked on Contact Form submissions with enquiry category breakdown (`room-booking`, `restaurant-reservation`, `group-booking`, `general-enquiry`, etc.) and Newsletter subscriptions.
  * 🗺️ **Google Maps Directions (`Google Maps Directions Click`)**: Dedicated "Get Directions on Google Maps" button and map address links on the Contact page.
* **Dual Reporting Engine**: Simultaneously captures custom events in **Vercel Web Analytics** (zero cookies required) and **Google Analytics 4** (`gtag`).

---

## 🛠️ Technical Stack

| Layer | Technology | Version |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router, Turbopack) | `16.1.6` |
| **Runtime / UI** | React | `19.2.4` |
| **Language** | TypeScript | `5.9.3` |
| **Styling** | Tailwind CSS (v4) + PostCSS | `4.1.18` |
| **CMS Engine** | Outstatic | `2.0.17` |
| **Hosting & CI/CD** | Vercel (Production & Staging) | Live |
| **Code Repository** | GitHub | `itsmyapp-code/ship-inn-studio` (branch: `main`) |

---

## 🔐 Environment Variables (Configured in Vercel & `.env.local`)

* `OST_GITHUB_ID` — GitHub OAuth Client ID for Outstatic CMS login
* `OST_GITHUB_SECRET` — GitHub OAuth Client Secret
* `OST_TOKEN_SECRET` — JWT session encryption key
* `OST_REPO_SLUG` — Repository name (`ship-inn-studio`)
* `OST_REPO_OWNER` — Repository owner (`itsmyapp-code`)
* `OST_REPO_BRANCH` — Primary deployment branch (`main`)
* `GITHUB_TOKEN` / `OST_GITHUB_TOKEN` — GitHub Personal Access Token for headless API commits from `/api/upload-menu` and `/api/upload-gallery`.

---

## 💾 Backups

* **Latest Full Site Backup:** [`Ship-Inn-Website-Backup-2026-09-23.zip`](file:///c:/Users/mcozens/Documents/Websites_Apps/Websites/The%20Ship%20Inn%20Porlock%20Weir/Ship-Inn-Website/Ship-Inn-Website-Backup-2026-09-23.zip) (~140.6 MB)
* **Previous Backup:** `Ship-Inn-Website-Backup-2026-01-18.zip`

---

## 📝 Common Development & Maintenance Commands

```powershell
# Start local development server
npm run dev

# Run production build and type checking
npm run build

# Start production server locally
npm run start

# Regenerate Word Document user manual
node scripts/generate-manual-docx.mjs
```
