# The Ship Inn Porlock Weir: Complete CMS User Manual
System: **Outstatic CMS**

This is the definitive instruction manual for managing your website.

---

## 1. How to Log In

1. Go to: **[theshipinnporlockweir.co.uk/outstatic](https://theshipinnporlockweir.co.uk/outstatic)**
2. Click **"Sign in with GitHub"**.
3. Enter:
   - **Username:** `hello@theshipinnporlockweir.co.uk`
   - **Password:** `theshipinnta248pb!`
4. If prompted, click **"Authorize"**.

---

## 2. Understanding the Dashboard

The **left sidebar** has three sections:

**Content > Collections:**
- **Pages** — Controls the core website pages (Home, Food & Drink, Contact, etc.).
- **Events** — Controls upcoming events (live music, specials, etc.).
- **News** — Controls news articles.

**Libraries:**
- **Media Library** — Where you upload images.

---

## 3. How to Upload and Use Images

### Step 1: Upload the image
1. In the left sidebar, click **Media Library**.
2. Click **Add Media** and select your image from your computer.
3. The image will appear in the library.

### Step 2: Get the image path
Outstatic renames your file and truncates the display name, so you cannot always read the full filename in the Media Library.

**To get the full path:**
- Right-click the image thumbnail in the Media Library.
- Choose **"Open image in new tab"**.
- Look at the browser address bar — the filename will be at the end of the URL after `/images/`.
- Your image path is: `/images/` followed by that filename.
- Example: `/images/ship-inn-front-view-c2Nj.png`

### Step 3: Paste the path
1. Go to the page you want to edit (e.g., **Pages → Home**).
2. Find the image field in the right sidebar (e.g., **Hero Image One**).
3. If the field is empty, click **+ Create** to open it.
4. Type or paste the path (e.g., `/images/ship-inn-front-view-c2Nj.png`).
5. Click **Save**.

> **The path is ALWAYS `/images/` followed by the filename.**

---

## 4. How to Edit and Save Any Page

1. In the left sidebar, click **Pages**, then click the page you want to edit.
2. The editor opens with two areas:
   - **Centre screen:** A large text editor. **Ignore this for Pages** — it is not used on the live website.
   - **Right sidebar:** All the important fields that control the live website layout. Scroll down to find them.
3. If a field shows **+ Create**, click it to open the input box, then type your value.
4. If a field already has text, click into it and edit directly.
5. Ensure **Status** says **"Published"** (not Draft).
6. Click the black **Save** button (top-right).
7. Wait 1–2 minutes, then refresh the live website to see your changes.

> **Important:** The big text area in the centre of the screen does NOT appear anywhere on the live website for Pages. All page content is controlled by the fields in the right sidebar only. You can ignore the centre text completely.

---

## 5. What Each Field Changes — Page by Page

Imagine you are scrolling down the live website from top to bottom. Here is exactly what each Outstatic field controls.

---

### 🏠 THE HOMEPAGE (`Pages` → `Home`)

As you scroll down [theshipinnporlockweir.co.uk](https://theshipinnporlockweir.co.uk):

| What you see on the live website | Field to edit in Outstatic (right sidebar) |
|---|---|
| **The giant rotating background photos at the very top** | **Hero Image One**, **Hero Image Two**, **Hero Image Three** |
| **The italic text below the logo** (*"Historic charm meets modern comfort"*) | **Strapline** |
| **The 5 paragraphs of text in the middle** | **Intro Paragraph 1** through **Intro Paragraph 5** |
| **Left card at the bottom** (Accommodation) | **Feature 1 Title** and **Feature 1 Description** |
| **Centre card at the bottom** (Pub & Restaurant) | **Feature 2 Title** and **Feature 2 Description** |
| **Right card at the bottom** (Location) | **Feature 3 Title** and **Feature 3 Description** |

**How the rotating hero images work:**
- The homepage automatically crossfades between up to 3 images every 6 seconds.
- Upload up to 3 images via the Media Library (see Section 3), then paste the paths into:
  - **Hero Image One** — the first photo (required)
  - **Hero Image Two** — the second photo (optional, leave empty if not needed)
  - **Hero Image Three** — the third photo (optional, leave empty if not needed)
- If you only paste 1 image, it stays static. If you paste 2 or 3, they rotate automatically.

> **Note:** There is also a built-in "Cover Image" box near the top of the right sidebar. **Ignore it for the Home page** — it is not used. Use the three Hero Image fields instead.

---

### 🍷 THE FOOD & DRINK PAGE (`Pages` → `Food & Drink`)

As you scroll down the Food & Drink page:

| What you see on the live website | Field to edit in Outstatic (right sidebar) |
|---|---|
| **The wide banner photo at the top** | **Cover Image** (built-in, near top of right sidebar) |
| **Left column of intro text** | **Food & Drink Intro Para 1** |
| **Right column of intro text** | **Food & Drink Intro Para 2** |
| **Lagers list in the drinks menu** | **Lagers List** |
| **Ciders list in the drinks menu** | **Ciders List** |
| **Ales list in the drinks menu** | **Ales List** |
| **Breakfast description text** | **Breakfast Description** |
| **Breakfast times** | **Breakfast Times** |

> **Drinks lists must be typed separated by commas:** `Estrella, Carlsberg, Peroni, Birra Moretti`

---

### 📞 CONTACT PAGE (`Pages` → `Contact`)

**Editing this page changes contact info across the ENTIRE website** (Footer, Booking sections, Legal pages — everywhere).

| What you see on the live website | Field to edit in Outstatic (right sidebar) |
|---|---|
| **Banner photo at the top** | **Cover Image** (built-in, near top of right sidebar) |
| **Phone number (everywhere on the site)** | **Phone Number** |
| **Email address (everywhere on the site)** | **Email Address** |
| **Street address in the Footer** | **Address Line 1**, **Address Line 2**, **Town**, **Postcode** |
| **Monday opening hours** | **Opening Hours (Monday)** |
| **Tuesday opening hours** | **Opening Hours (Tuesday)** |
| **Wednesday opening hours** | **Opening Hours (Wednesday)** |
| **Thursday opening hours** | **Opening Hours (Thursday)** |
| **Friday opening hours** | **Opening Hours (Friday)** |
| **Saturday opening hours** | **Opening Hours (Saturday)** |
| **Sunday opening hours** | **Opening Hours (Sunday)** |
| **Food serving hours in the Footer** | **Kitchen Close Info** |
| **Italic note below opening hours** | **Seasonal Note** |

---

### 🛏️ OTHER PAGES (`Rooms`, `Gallery`, `Things to Do`, `News & Events`)

These pages only have one editable field:

| What you see on the live website | Field to edit in Outstatic (right sidebar) |
|---|---|
| **The banner photo at the top of the page** | **Cover Image** (built-in, near top of right sidebar) |

To change it: upload an image to the Media Library, get the path (see Section 3), then paste it into the **Cover Image** box.

---

## 6. How to Add a New Event or News Article

1. Click **Events** or **News** in the left sidebar.
2. Click the **"New"** button (top right).
3. **In the centre screen:** Type your headline in the **Title** box, then write the full article below it.
4. **In the right sidebar:**
   - Pick the **Date**.
   - Add a **Cover Image** (upload to Media Library first, then paste the `/images/filename` path).
   - Add a short **Description** (this is the preview text shown on the list page).
5. Change **Status** to **"Published"**.
6. Click **Save**.

---

## 7. How to Delete an Event or News Article

1. Click **Events** or **News** in the left sidebar.
2. Click the trash can icon (🗑️) next to the item you want to delete.
3. Confirm the deletion.

---

## 8. Quick Reference — Image Path Format

Every image path follows the same pattern:

```
/images/[exact-filename-from-media-library]
```

To find the filename: right-click the thumbnail in Media Library → "Open image in new tab" → read the filename from the browser address bar.

Examples:
- `/images/ship-inn-front-view-c2Nj.png`
- `/images/harbour-sunset.jpg`
- `/images/food-platter-xKm.jpeg`

---

*End of Manual*
