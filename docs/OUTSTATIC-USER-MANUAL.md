# THE SHIP INN
## The Ship Inn Porlock Weir — Website & Content Management Guide
**System:** Dedicated Staff Mobile Studio (PWA), Fast Admin Tools, Automatic Optimization | **Version 4.1 (12 November 2026)**

> ### ⚡ Fast Track: Which Tool to Use?
> - **To Post Events, Gigs, Blackboard Specials, or Videos:** Use the **Staff Mobile Studio** — https://theshipinnporlockweir.co.uk/staff (PIN: `1572` or `7924`)
> - **To Upload or Update PDF Menus:** Use the **Menu Manager** — https://theshipinnporlockweir.co.uk/admin/menus
> - **To Add or Remove Gallery Photos:** Use the **Gallery Manager** — https://theshipinnporlockweir.co.uk/admin/gallery
> - **To Manage Customer Reviews & Testimonials:** Use the **Testimonials Manager** — https://theshipinnporlockweir.co.uk/admin/testimonials
> - **To Edit Page Text, Hours, or Contact Info:** Use **Outstatic CMS** (Webmaster Mode) — https://theshipinnporlockweir.co.uk/outstatic

---

## 1. Staff Mobile Studio & Social Syndication Pipeline (/staff)

Pub staff can post upcoming gigs, blackboard dinner specials, weather notices, and phone video clips in under 60 seconds directly from their phone—with zero passwords, zero wait time, and £0 in build costs.

### 1.1 How to Post in 60 Seconds:
1. **Open on Phone:** Open Safari (iPhone) or Chrome (Android) and go to: https://theshipinnporlockweir.co.uk/staff
2. **Install to Home Screen (Recommended):** Tap the Share button in Safari and tap **"Add to Home Screen"** to install The Ship Inn app icon directly on your phone.
3. **Enter Staff PIN:** Enter the 4-digit pub passcode `1572` (or `7924`).
4. **Choose Post Type:**
   - 📅 **Scheduled Event:** For live music, quiz nights, Sunday lunches (set date, time, and optional table booking prompt).
   - 📰 **Pub News / Special:** For chalkboard specials, fresh catch, seasonal ales, or harbour updates.
5. **Enter Title & Description:** Type your headline and brief description.
6. **Choose Media:**
   - 🎥 **Phone Camera Roll Video:** Select any MP4 or MOV clip straight from your camera roll. The studio **automatically captures a crisp video frame** for your Facebook & WhatsApp preview card! Keep "Silent Video Mode" switched ON for ambient website playback without copyright audio issues.
   - 🖼️ **Photo / Flyer:** Choose an event flyer or food photo. It optimizes in your phone browser in 0.5 seconds.
   - 🔗 **Social Link:** Paste a public Facebook Reel, Instagram Reel, or YouTube Shorts link.
7. **Attach PDF Menu or Document (Optional):** Tap **"Choose PDF Document"** to attach seasonal food menus, Christmas menus, or wine lists directly to the post.
8. **Button Link to Website (Optional CTA):** Choose a high-converting button link (*"Reserve Table"*, *"Festive & Christmas"*, *"View Rooms & Stay"*, *"Explore Food & Drink"*, or a custom label).
9. **Live Social Card Preview:** Right above the publish button, inspect the live card preview showing the exact image, headline, and domain (`THESHIPINNPORLOCKWEIR.CO.UK`) that Facebook, Instagram, and WhatsApp will display.
10. **Publish in 1-Click:** Tap **"Publish to The Ship Inn"**. Your post goes live instantly with zero build wait time and £0 in Vercel build minute costs.

### 1.2 Sharing to Facebook, WhatsApp & Instagram Stories:
Once published, the success window provides one-tap social sharing tools:
- **`📋 Copy Facebook Post (with Menu & CTA)`:** Copies the complete pre-formatted post with headline, description, video link, and direct links to the menu and reservations. Just open Facebook, tap Paste, and hit Post!
- **`🔗 Copy Link Only`:** Copies just the direct post URL.
- **`🔍 Test in Facebook Debugger`:** Opens Meta's official tool to verify how Facebook renders the card without posting publicly.
- **WhatsApp:** Paste the copied link into any local chat or community group; wait 1 second for WhatsApp to generate the preview card, and send.
- **Instagram Stories:** Add a photo/video in Instagram Stories, tap the Stickers icon, tap "Link", paste your copied link, and post!

---

## 2. Dedicated Fast Admin Tools (1-Minute Updates)

### 2.1 Menu Manager & PDF Uploader
Use this dedicated tool whenever you have a new season or updated menu PDF:
1. Open your browser and go to: https://theshipinnporlockweir.co.uk/admin/menus
2. Click the menu you want to update (**Breakfast Menu**, **Lunch Menu**, **Evening Menu**, **Sunday Lunch Menu**, or **Custom Menu**).
3. Enter the **Season / Subtitle** (e.g. `"Autumn/Winter 2026"` or `"Served 12:00 PM - 3:00 PM"`).
4. Click **"Browse PDF file"** and choose your `.pdf` file.
5. Click **"Upload & Publish Menu"**. The live website and Outstatic update automatically in 1–2 minutes!

### 2.2 Gallery Manager & Photo Uploader (with Auto-AVIF & WebP Conversion)
Use this dedicated tool to upload new photos to the gallery or delete old ones without having to manually resize images or copy file links:
1. Open your browser and go to: https://theshipinnporlockweir.co.uk/admin/gallery
2. Choose your upload mode:
   - **Single Photo Upload:** Add an individual photo with a custom title and caption.
   - **Batch Upload:** Upload 3–10+ photos at once into a chosen category.
3. Click the matching category button (**Food & Drink**, **Interior & Bar**, **Exterior & Garden**, **Rooms & Cabins**, **Surroundings & Exmoor**, or **Custom**).
4. Click **"Browse Image"** to select your photo (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.jfif`, `.gif` up to 20MB) and verify the instant preview thumbnail.
5. Enter a descriptive **Photo Title / Alt Text** and optional **Caption**.
6. Click **"Upload & Publish Image"**. Your photo is **automatically converted into both `.avif` and `.webp`**, goes live immediately, and syncs with Outstatic CMS!
7. **Deleting or Editing Existing Photos:** Scroll down to the **Current Gallery Photos** section at the bottom of `/admin/gallery` to filter by category, click **🗑️ Delete** to remove a photo immediately, or click **✏️ Edit in Outstatic**.

### 2.3 Testimonials & Customer Reviews Manager
Use this dedicated tool to approve customer submissions from the website, manually transcribe reviews from Google or TripAdvisor, and manage what reviews appear on the homepage:
1. Open your browser and go to: https://theshipinnporlockweir.co.uk/admin/testimonials
2. **Enter Admin Passcode:** When prompted, enter the pub passcode `theshipinnta248pb!` to unlock the manager. (No GitHub account, sign-in, or token is required for staff or clients; all authorized edits sync automatically).
3. **Live Stats & Tabs:** The dashboard displays live counts (Total Reviews, Average Star Rating, Pending Approvals, Published Reviews) and tabbed filters (All, Pending, Published, Archived).
4. **Approving Guest Submissions:** When guests leave a review via the website modal, it lands in "Pending" status. Click the green **"Approve & Publish"** button to immediately make it live on the homepage.
5. **Manually Adding Reviews:** Click the **"+ Add Review Manually"** button in the header. Enter the guest's name, rating (1–5 stars), visit date, source (Google, TripAdvisor, In Person / Guestbook, or Direct), review text, and optional verified stay badge. Click **"Save & Publish"**.
6. **Editing, Archiving & Deleting:** Click **"Edit"** on any review card to update wording or rating. Click **"Archive"** to remove a review from the homepage without permanently deleting it, or click **"Delete"** to remove it permanently.

---

## 3. How to Log In to Outstatic CMS
Use Outstatic CMS when you need to edit written text across website pages, change opening hours, post news stories, or add events:
1. In your browser, go to: https://theshipinnporlockweir.co.uk/outstatic
2. Click **"Sign in with GitHub"**.
3. Enter Username: `hello@theshipinnporlockweir.co.uk` and Password: `theshipinnta248pb!`
4. If prompted on screen, click **"Authorize"**.

---

## 4. Understanding the Outstatic Dashboard
The left sidebar of your Outstatic dashboard provides access to all content sections:
- **Pages:** Controls text and banners on core website pages (Home, Food & Drink, Contact, Rooms, Things to Do, Gallery, News & Events).
- **Menus:** Shows all uploaded menus (where you can toggle Draft/Published to temporarily hide a menu).
- **Gallery:** Shows your photo collection (where you can edit captions or toggle Draft/Published).
- **Events:** Add upcoming live music, pub quizzes, and seasonal celebrations.
- **News:** Post articles and announcements.
- **Media Library:** Central repository for all images used on website pages.

---

## 5. How to Edit and Save Any Page in Outstatic
1. In the left sidebar, click **Pages**, then click the page you want to update.
2. Focus on the **Right Sidebar** fields. *(The large center editor is not used for page layouts).*
3. If a field shows **"+ Create"**, click it to open the text input box.
4. Ensure **Status** is set to **"Published"** (not Draft).
5. Click the black **"Save"** button in the top-right corner.
6. Wait 1–2 minutes, then refresh your live website to see changes.

---

## 6. Page-by-Page Field Reference

### 🏠 The Homepage (`home`)
- **Hero Image One, Two, Three:** Giant rotating background photos behind the main welcome text.
- **Strapline:** The subtitle text directly below the logo (*"Historic charm meets modern comfort"*).
- **Intro Paragraphs 1 to 5:** The core welcoming text in the middle section of the home page.
- **Feature Cards 1, 2, 3 (Title & Desc):** The three promotional cards at the bottom (Rooms, Pub & Restaurant, Location).

### 🍷 Food & Drink Page (`food-drink`)
| What you see on the website | Field to edit in Outstatic (Right Sidebar) |
| :--- | :--- |
| Wide banner photo at the top | **Cover Image** (click to choose from Media Library) |
| Left column introductory text | **Food & Drink Intro One** & **Food & Drink Intro Two** |
| Lagers, Ciders, Ales beer lists | **Lagers**, **Ciders**, **Ales** (comma-separated lists) |
| Breakfast serving details | **Breakfast Description** & **Breakfast Times** |
| Downloadable PDF Menus | Managed via https://theshipinnporlockweir.co.uk/admin/menus |

### 📞 Contact Page (`contact` — Global Information)
*Note: Editing the Contact page automatically updates contact details across the ENTIRE site (Footer, Header, Booking CTAs, Legal):*

| What you see on the website | Field to edit in Outstatic (Right Sidebar) |
| :--- | :--- |
| Phone & Email everywhere | **Phone Number**, **Email Address** |
| Address in Footer & Header | **Address Line One**, **Two**, **Town**, **Postcode** |
| Daily opening hours | **Opening Hours (Monday - Sunday)** |
| Food serving times in Footer | **Kitchen Close Info** |
| Resident breakfast & seasonal notes | **Breakfast Times**, **Seasonal Note** |

### 🛏️ Other Core Pages (`rooms`, `things-to-do`, `gallery`, `news-events`)
| Page | Fields to edit in Outstatic (Right Sidebar) |
| :--- | :--- |
| **From the Cabins (`rooms`)** | **Cover Image** (top hero banner) & **Hero Alt** |
| **Things to Do (`things-to-do`)** | **Cover Image** (top hero banner) & **Hero Alt** |
| **Gallery (`gallery`)** | **Cover Image** (top hero banner) & **Hero Alt** (photos managed via `/admin/gallery`) |
| **News & Events (`news-events`)** | **Cover Image** (top hero banner) & **Hero Alt** |

---

## 7. How to Add a New Event or News Article
1. Click **Events** or **News** in the left sidebar of Outstatic.
2. Click the black **"New"** button in the top right.
3. **In the centre screen:** Type your headline in the **Title** box and write your story or event description below it.
4. **In the right sidebar (Events):** Enter **eventDate** (e.g. `2026-12-31`), **eventTime** (e.g. `8:00 PM`), **location** (e.g. `The Ship Inn Bar`), upload an image under **Upload image** (or Cover Image), and enter a short **Description**. *(Note: Past events hide automatically once their date passes!)*
5. **In the right sidebar (News):** Select **Published At** date, upload a **Cover Image**, and enter a short **Description**.
6. Set **Status** to **"Published"** and click **Save**.

---

## 8. Automatic Image Optimization (`.avif` & `.webp`) — Zero Effort Required
You never need to convert or compress photos before uploading them to the website:
- **Via the Gallery Manager (`/admin/gallery`):** Any `.jpg`, `.png`, or `.webp` photo you upload is automatically resized (max 2000px) and converted on the server into both an ultra-fast **`.avif`** file and a **`.webp`** fallback.
- **Via Outstatic CMS (`/outstatic`):** Any `.jpg` or `.png` photo you choose inside Outstatic is automatically converted in your browser into **`.webp`** before saving, and the website build automatically generates its matching **`.avif`** companion.
- **Live Website Delivery:** Every image across the entire website is served inside a smart `<picture>` element that delivers `.avif` first with an automatic `.webp` fallback.

---

## 9. Progressive Web App (PWA) & Offline Coastal Mode
The Ship Inn website is an installable **Progressive Web App (PWA)** built for Porlock Weir and the Exmoor coast:
- **Installable App:** Guests can tap **"Add to Home Screen"** (iPhone/iPad) or **"Install App"** (Android/Desktop) to install The Ship Inn on their device.
- **Quick App Shortcuts:** Long-pressing the installed app icon provides 1-tap shortcuts to **Menus & Dining**, **From the Cabins**, and **Contact & Directions**.
- **Offline Caching:** Visited pages, photos, and downloadable PDF menus (`/menus/*.pdf`) are cached automatically so guests can still read menus when coastal mobile signal drops.
- **Offline Coastal Card:** If a guest is offline and opens an uncached page, a branded offline card displays your telephone number (**01643 863288**), address (**Porlock Weir, TA24 8PB**), and bar/food serving hours.

---

## 10. Summary: Which Tool Should I Use?
| Task | Recommended Tool | Web Link |
| :--- | :--- | :--- |
| Post events, gigs, specials, or phone videos | **Staff Mobile Studio** | https://theshipinnporlockweir.co.uk/staff (PIN: `1572`) |
| Upload a new PDF food menu | **Menu Manager** | https://theshipinnporlockweir.co.uk/admin/menus |
| Add or delete photos in the gallery | **Gallery Manager** (auto-AVIF/WebP) | https://theshipinnporlockweir.co.uk/admin/gallery |
| Approve guest reviews or add Google/TripAdvisor reviews | **Testimonials Manager** | https://theshipinnporlockweir.co.uk/admin/testimonials |
| Temporarily hide a menu or photo | **Outstatic** (Switch to Draft) | https://theshipinnporlockweir.co.uk/outstatic |
| Edit phone number, address, or hours | **Outstatic Pages** (Contact) | https://theshipinnporlockweir.co.uk/outstatic |
| Add an upcoming live music event (Full Desktop Editor) | **Outstatic Events** | https://theshipinnporlockweir.co.uk/outstatic |
| Publish a news story or announcement (Full Desktop Editor) | **Outstatic News** | https://theshipinnporlockweir.co.uk/outstatic |

---

**The Ship Inn, Porlock Weir — TA24 8PB**  
Website & CMS Managed by itsmyapp (https://itsmyapp.co.uk)  
*Manual Version 3.1 • Updated 11 November 2026*

