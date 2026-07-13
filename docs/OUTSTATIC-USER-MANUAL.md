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
- **Gallery** — Controls the photos shown on the Gallery page.

**Libraries:**
- **Media Library** — Where you upload images.

---

## 3. How to Upload and Use Images

### Step 1: Upload the image
1. In the left sidebar, click **Media Library**.
2. Click **Add Media** and select your image from your computer.
3. The image will appear in the library.

### Step 2: Use the image

**For the Cover Image field**:
1. Go to the page you want to edit (e.g., **Pages → Contact**).
2. Click the Cover Image field in the right sidebar.
3. It will open an image picker — select your image and click **Save**.

**For the Hero Images (Home Page only)**:
Due to a technical limitation, the three Hero Images on the Home page are text fields. You must paste the path.
1. Right-click your uploaded image in the Media Library.
2. Choose **"Open image in new tab"**.
3. Look at the browser address bar — your image path is `/images/` followed by the filename (e.g., `/images/ship-inn-front-view-c2Nj.png`).
4. Go to **Pages → Home**.
5. Paste that path into the **Hero Image One**, **Two**, or **Three** text field.
6. Click **Save**.

> **Image picker fields have a visual preview** — you'll see a thumbnail of the selected image, with a "Remove" button to clear it.

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
| **The 5 paragraphs of text in the middle** | **Intro Paragraph One** through **Intro Paragraph Five** |
| **Left card at the bottom** (Accommodation) | **Feature One Title** and **Feature One Description** |
| **Centre card at the bottom** (Pub & Restaurant) | **Feature Two Title** and **Feature Two Description** |
| **Right card at the bottom** (Location) | **Feature Three Title** and **Feature Three Description** |

**How the rotating hero images work:**
- The homepage automatically crossfades between up to 3 images every 6 seconds.
- These fields require you to **paste the image path** (see Section 3).
- Fill in:
  - **Hero Image One** — the first photo (required)
  - **Hero Image Two** — the second photo (optional, leave empty if not needed)
  - **Hero Image Three** — the third photo (optional, leave empty if not needed)
- If you only set 1 image, it stays static. If you set 2 or 3, they rotate automatically.

> **Note:** There is also a built-in "Cover Image" box near the top of the right sidebar. **Ignore it for the Home page** — it is not used. Use the three Hero Image fields instead.

---

### 🍷 THE FOOD & DRINK PAGE (`Pages` → `Food & Drink`)

As you scroll down the Food & Drink page:

| What you see on the live website | Field to edit in Outstatic (right sidebar) |
|---|---|
| **The wide banner photo at the top** | **Cover Image** (image picker, near top of right sidebar) |
| **Left column of intro text** | **Food & Drink Intro Para One** |
| **Right column of intro text** | **Food & Drink Intro Para Two** |
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
| **Banner photo at the top** | **Cover Image** (image picker, near top of right sidebar) |
| **Phone number (everywhere on the site)** | **Phone Number** |
| **Email address (everywhere on the site)** | **Email Address** |
| **Street address in the Footer** | **Address Line One**, **Address Line Two**, **Town**, **Postcode** |
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

### 🛏️ OTHER PAGES (`Rooms`, `Things to Do`, `News & Events`)

These pages only have one editable field:

| What you see on the live website | Field to edit in Outstatic (right sidebar) |
|---|---|
| **The banner photo at the top of the page** | **Cover Image** (image picker, near top of right sidebar) |

To change it: click the **Cover Image** field in the right sidebar and use the image picker to select or upload a new image.

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

## 8. How to Manage the Gallery

The Gallery page is now entirely controlled by the **Gallery Collection**.

**To Add a New Photo:**
1. Click **Gallery** under Collections in the left sidebar.
2. Click the **"New"** button (top right).
3. **Title:** Type a name for the photo (e.g., "Front Bar" or "Fish & Chips").
4. **Description:** Add an optional caption if desired.
5. **Cover Image:** Click this field to open the Media Library and select your photo.
6. **Category:** Choose a category (e.g., `Food & Drink`, `Exterior`, `Interior`, `Rooms`, or `Surroundings`). This determines where it appears on the gallery page filter.
7. Change **Status** to **"Published"**.
8. Click **Save**.

**To Edit or Delete a Photo:**
1. Click **Gallery** in the left sidebar to see all your photos.
2. Click on a photo to change its category or image.
3. Or click the trash can icon (🗑️) to delete it from the website.

---

## 9. Quick Reference — Image Path Format

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
