# The Ship Inn Website - Project Status

**Last Updated:** December 14, 2025

---

## 🎯 Current Status: LIVE & FUNCTIONAL

The website is deployed and live on Vercel with a working CMS system.

### Live URLs
- **Website:** https://ship-inn-website.vercel.app
- **CMS Dashboard:** https://ship-inn-website.vercel.app/outstatic
- **RSS Feed:** https://ship-inn-website.vercel.app/feed.xml

---

## ✅ What's Working

### Website Pages
| Page | URL | Status |
|------|-----|--------|
| Home | `/` | ✅ Live |
| Our Rooms | `/rooms` | ✅ Live |
| Food & Drink | `/food-drink` | ✅ Live |
| Things to Do | `/things-to-do` | ✅ Live |
| News & Events | `/news-events` | ✅ Live - Pulls from CMS |
| Gallery | `/gallery` | ✅ Live |
| Contact | `/contact` | ✅ Live |
| Legal | `/legal` | ✅ Live |

### CMS System (Outstatic)
- **Version:** 1.4.14
- **Authentication:** GitHub OAuth
- **Content Storage:** Git-based (commits to repository)
- **Collections:**
  - **News** - Blog posts and announcements
  - **Events** - Upcoming events with dates

### Technical Stack
| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js | 14.2.15 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS | 3.4.18 |
| CMS | Outstatic | 1.4.14 |
| Hosting | Vercel | - |
| Repository | GitHub | itsmyapp-code/ship-inn-studio |

### Environment Variables (Vercel)
All configured and working:
- `OST_GITHUB_ID` - GitHub OAuth Client ID
- `OST_GITHUB_SECRET` - GitHub OAuth Secret
- `OST_TOKEN_SECRET` - Session encryption key
- `OST_REPO_SLUG` - Repository name (ship-inn-studio)
- `OST_REPO_OWNER` - GitHub owner (itsmyapp-code)
- `OST_REPO_BRANCH` - Branch (main)

---

## 🔧 What Needs Work

### 1. RSS Feed Integration with Mailerlite
**Priority:** High  
**Status:** Partially implemented

The RSS feed exists but currently shows placeholder content. Needs to:
- Pull actual events and news from Outstatic
- Format correctly for Mailerlite consumption
- Include proper item structure (title, description, date, link, image)

### 2. Newsletter Signup
**Priority:** Medium  
**Status:** Form exists, backend needs Mailerlite API integration

The newsletter form on the News & Events page needs to connect to Mailerlite.

### 3. Custom Fields in Outstatic
**Priority:** Low  
**Status:** Schema created but not visible in UI

Outstatic v1.4.14 doesn't auto-generate custom field inputs. The Events collection has these optional fields defined but they need manual setup:
- `eventDate` - Specific event date
- `eventTime` - Event time
- `location` - Event location

**Workaround:** Use the Description field for time/location info, or upgrade to Outstatic v2 when Tailwind v4 is supported.

### 4. Production Domain
**Priority:** High  
**Status:** Not configured

The site is on Vercel's default domain. Needs:
- Custom domain configuration (shipinnporlockweir.com)
- SSL certificate (automatic with Vercel)
- Update RSS feed URLs

---

## 📁 Project Structure

```
Ship-Inn-Website/
├── src/
│   ├── app/
│   │   ├── (website)/          # Public pages
│   │   │   ├── page.tsx        # Home
│   │   │   ├── rooms/
│   │   │   ├── food-drink/
│   │   │   ├── things-to-do/
│   │   │   ├── news-events/    # News & Events listing
│   │   │   │   └── [slug]/     # Individual news articles
│   │   │   ├── events/
│   │   │   │   └── [slug]/     # Individual event pages
│   │   │   ├── gallery/
│   │   │   ├── contact/
│   │   │   └── legal/
│   │   ├── api/
│   │   │   ├── outstatic/      # CMS API routes
│   │   │   └── newsletter/     # Newsletter signup
│   │   ├── outstatic/          # CMS dashboard UI
│   │   └── feed.xml/           # RSS feed route
│   └── components/             # Reusable components
├── outstatic/
│   └── content/
│       ├── collections.json    # Collection definitions
│       ├── news/               # News articles (.md files)
│       └── events/             # Event posts (.md files)
├── public/
│   └── images/                 # Uploaded images
└── docs/
    ├── PROJECT-STATUS.md       # This file
    └── OUTSTATIC-USER-MANUAL.md
```

---

## 🚀 Next Steps (Priority Order)

1. **Fix RSS Feed** - Connect to Outstatic content for Mailerlite
2. **Mailerlite Integration** - Connect newsletter form to API
3. **Custom Domain** - Set up shipinnporlockweir.com
4. **Content Entry** - Add real events and news
5. **SEO Optimization** - Meta tags, Open Graph, structured data

---

## 📝 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Pull latest content changes
git pull
```

---

## 🔐 Access & Credentials

### GitHub OAuth App
- **Client ID:** Ov23liJWu8geK8HsiyH0
- **Authorized callback:** https://ship-inn-website.vercel.app/api/outstatic/callback

### Vercel Project
- **Project:** ship-inn-website
- **Team/Account:** (your Vercel account)

---

## 📞 Support Notes

- Content changes made in Outstatic are committed to GitHub and trigger automatic Vercel rebuilds
- Images uploaded through Outstatic are stored in `/public/images/`
- The site uses Static Site Generation (SSG) for fast performance
