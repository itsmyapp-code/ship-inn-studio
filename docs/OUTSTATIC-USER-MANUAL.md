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

## 3. How to Upload Images (IMPORTANT — Read This First)

Image uploading in Outstatic is a two-step process. You must upload the image first, then paste the path into the correct field.

### Step 1: Upload the image
1. In the left sidebar, click **Media Library**.
2. Click the upload button and select your image from your computer.
3. The image will appear in the library with a filename (e.g., `my-photo-xY3k.jpg`).
4. **Remember or write down that filename.**

### Step 2: Paste the path into the correct field
1. Go to the page you want to edit (e.g., **Pages → Home**).
2. In the right sidebar, find the **Cover Image** box (it is a text box).
3. Type the path: `/images/` followed by the exact filename.
   - Example: `/images/my-photo-xY3k.jpg`
4. Click **Save**.

> **The path is ALWAYS `/images/` followed by the filename you see in the Media Library.**

---

## 4. How to Edit and Save Any Page

1. In the left sidebar, click **Pages**, then click the page name you want to edit.
2. The editor opens with two areas:
   - **Centre screen:** A text editor (only used for News/Events articles — ignore this for Pages).
   - **Right sidebar:** All the important fields that control the live website layout.
3. Scroll down the right sidebar to find the field you want to change.
4. If a field shows **`+ Create`**, click it to open the input box, then type your value.
5. If a field already has text, click into it and edit directly.
6. Ensure **Status** says **"Published"** (not Draft).
7. Click the black **Save** button (top-right).
8. Wait 1–2 minutes, then refresh the live website to see your changes.

> **Note:** The big text area in the centre of the screen is NOT used for Pages. All page content is controlled by the fields in the right sidebar. You can ignore the centre text completely.

---

## 5. What Each Field Changes — Page by Page

Imagine you are scrolling down the live website from top to bottom. Here is exactly what each Outstatic field controls.

---

### 🏠 THE HOMEPAGE (`Pages` → `Home`)

As you scroll down [theshipinnporlockweir.co.uk](https://theshipinnporlockweir.co.uk):

| What you see on the live website | Field to edit in Outstatic |
|---|---|
| **The giant background photo at the very top** (rotates between up to 3 images) | **Cover Image** (Image 1), **Hero Image 2**, **Hero Image 3** |
| **The italic text below the logo** (*"Historic charm meets modern comfort"*) | **Strapline** |
| **The 5 paragraphs of text in the middle** | **Intro Paragraph 1** through **Intro Paragraph 5** |
| **Left card at the bottom** (Accommodation) | **Feature 1 Title** and **Feature 1 Description** |
| **Centre card at the bottom** (Pub & Restaurant) | **Feature 2 Title** and **Feature 2 Description** |
| **Right card at the bottom** (Location) | **Feature 3 Title** and **Feature 3 Description** |

**How to change the rotating hero images:**
1. Upload up to 3 images via the **Media Library** (see Section 3).
2. Go to **Pages → Home**.
3. In the right sidebar:
   - Paste the first image path into **Cover Image** (e.g., `/images/exterior-view.jpg`)
   - Paste the second image path into **Hero Image 2** (e.g., `/images/harbour-view.jpg`)
   - Paste the third image path into **Hero Image 3** (e.g., `/images/sunset-view.jpg`)
4. Click **Save**. The homepage will automatically crossfade between all uploaded images.
5. If you only want 1 or 2 images, just leave the other fields empty.

---

### 🍷 THE FOOD & DRINK PAGE (`Pages` → `Food & Drink`)

As you scroll down the Food & Drink page:

| What you see on the live website | Field to edit in Outstatic |
|---|---|
| **The wide banner photo at the top** | **Cover Image** |
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

| What you see on the live website | Field to edit in Outstatic |
|---|---|
| **Banner photo at the top** | **Cover Image** |
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

| What you see on the live website | Field to edit in Outstatic |
|---|---|
| **The banner photo at the top of the page** | **Cover Image** |

To change it: upload an image to the Media Library, then paste the path (e.g., `/images/rooms-header.jpg`) into the **Cover Image** text box.

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

Examples:
- `/images/ship-inn-front-view-c2Nj.png`
- `/images/harbour-sunset.jpg`
- `/images/food-platter-xK9m.jpeg`

---

*End of Manual*
