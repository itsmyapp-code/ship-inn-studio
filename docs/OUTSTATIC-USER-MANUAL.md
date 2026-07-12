# The Ship Inn Porlock Weir: Website CMS Manual
System: **Outstatic CMS**

This manual provides simple, detailed, and accurate step-by-step instructions for editing the text, phone numbers, email addresses, opening hours, and banner images across your entire website.

---

## 🚀 Part 1: How to Log In

1. Open your web browser and go to:
   **[theshipinnporlockweir.co.uk/outstatic](https://theshipinnporlockweir.co.uk/outstatic)**
2. Click the black button: **"Sign in with GitHub"**.
3. Enter your login credentials:
   - **Username / Email:** `hello@theshipinnporlockweir.co.uk`
   - **Password:** `theshipinnta248pb!`
4. If this is your first time logging in, click **"Authorize"** if prompted. You are now on the dashboard!

---

## ⚡ Part 2: The Core Workflow

Whenever you edit *any* page or post on the website, you will follow these exact 4 steps:

1. **Select the Content Type** in the left sidebar menu (either **Pages**, **Events**, or **News**).
2. **Open the Document** you want to change from the list (or click **"New"** to create a News post or Event).
3. **Locate the Fields:**
   - Standard content (Title, main description body) is edited in the **center editor**.
   - Custom fields (like `Cover Image`, `Phone`, `Email`, `Opening Hours`, `Strapline`, etc.) are located in the **right sidebar** under the `Slug*` field.
4. **Edit Custom Fields using `+ Create` or text boxes:**
   - In the right sidebar, any custom fields that are currently empty will display a **`+ Create`** button. Click it to open the input widget.
   - **Important for Images:** If a field like **Cover Image** already has an image set, it will display a text box with the image path (e.g., `/images/exterior/...`). **To upload a new image, delete all the text in that box.** Once the box is empty, the "Upload" button will appear!
5. **Publish your changes:**
   - In the right-hand sidebar, ensure the **Status** is set to **"Published"** (not Draft).
   - Click the black **"Save"** button in the top-right corner.
   - **Wait 1–2 minutes** for the website to automatically rebuild in the background.
   - Go to your live website and reload the page (`Ctrl + F5` or `Cmd + Shift + R`) to verify your edits.

---

## 🏠 Part 3: Visual Top-to-Bottom Guide for the "Pages" Collection

The **Pages** collection controls the core structure and layout of the site. Below is the exact mapping of what each field controls as you scroll down the live website from top to bottom.

### 1. The Homepage (`Pages` -> `home`)

As you scroll down the live [Homepage](https://theshipinnporlockweir.co.uk):

1. **The giant background photo at the very top:**
   ➔ Edit field: **`Cover Image`** (Right sidebar)
2. **The text "*Historic charm meets modern comfort*" below the logo:**
   ➔ Edit field: **`Strapline`**
3. **The 5 paragraphs of text in the middle of the page:**
   ➔ Edit fields: **`Intro Paragraph 1`** through **`Intro Paragraph 5`**
4. **The 3 Information Cards at the very bottom of the page:**
   - **Left Card** (Accommodation): ➔ Edit fields: **`Feature 1 Title`** and **`Feature 1 Description`**
   - **Center Card** (Pub & Restaurant): ➔ Edit fields: **`Feature 2 Title`** and **`Feature 2 Description`**
   - **Right Card** (Location/Exmoor): ➔ Edit fields: **`Feature 3 Title`** and **`Feature 3 Description`**

*(Note: If you don't want to use all 5 intro paragraphs, just leave the boxes for Paragraph 4 and 5 completely empty, and they simply won't show up on the website).*

---

### 2. The Food & Drink Page (`Pages` -> `food-drink`)

As you scroll down the live Food & Drink page:

1. **The wide background photo at the very top banner:**
   ➔ Edit field: **`Cover Image`** (Right sidebar)
2. **The two columns of text at the top describing the restaurant:**
   ➔ Edit fields: **`Food & Drink Intro Para 1`** (Left side) and **`Food & Drink Intro Para 2`** (Right side)
3. **The Drinks Menu section (The lists of beers):**
   ➔ Edit fields: **`Lagers List`**, **`Ciders List`**, and **`Ales List`**
   *(Crucial: You must type these separated by commas in the box, for example: `Estrella, Carlsberg, Peroni`)*
4. **The Breakfast section at the bottom:**
   ➔ Edit field: **`Breakfast Description`** (The paragraph text)
   ➔ Edit field: **`Breakfast Times`** (The hours, e.g. "8am - 10am")

---

### 3. Contact Details & Hours (`Pages` -> `contact`)

**CRITICAL:** Editing this specific page in Outstatic acts as the "Master Control" for the whole website's contact info.

1. **The wide background photo at the very top of the Contact Page:**
   ➔ Edit field: **`Cover Image`** (Right sidebar)
2. **The Phone Number & Email Address (Changes everywhere automatically):**
   ➔ Edit fields: **`Phone Number`** and **`Email Address`**
3. **The physical address shown in the black Footer:**
   ➔ Edit fields: **`Address Line 1`**, **`Address Line 2`**, **`Town`**, and **`Postcode`**
4. **The Opening Hours table on the Contact page:**
   ➔ Edit fields: **`Opening Hours (Monday)`** through **`Opening Hours (Sunday)`**
5. **The Food Service hours shown in the black Footer:**
   ➔ Edit field: **`Kitchen Close Info`** (e.g. "Food served: 12pm - 9pm")
6. **The little italic warning note below the opening hours:**
   ➔ Edit field: **`Seasonal Note`**

---

### 4. Header Photos on Other Pages (`Pages` -> `rooms`, `gallery`, `things-to-do`, `news-events`)

To change the top background banner image for the remaining pages:

1. Click **Pages** in the sidebar.
2. Select the page you want to update from the list (`rooms`, `gallery`, `things-to-do`, or `news-events`).
3. Edit field: **`Cover Image`** (Right sidebar). Delete any existing text path to reveal the upload button.
4. Click **Save** in the top-right corner.

---

## 📅 Part 4: How to Create/Edit News & Events

### How to add a new Event or News post:
1. Select **Events** or **News** in the sidebar.
2. Click the **"New"** button in the top right.
3. Fill in the fields:
   - **Title:** The headline (e.g., *Sunday Roast Special*).
   - **Date (Right sidebar):** The publication/display date.
   - **Cover Image (Right sidebar):** The card photo.
   - **Description:** A short 2-sentence hook shown on the list page.
   - **Main Text Area (Center):** Write your full article text. Use the toolbar to add headings or upload inline photos.
4. Set the **Status** to **"Published"** and click **Save** (top-right).

---

## 🎨 Part 5: Image Optimization Requirements

To ensure the website loads quickly for guests on mobile phones, always follow these rules before uploading any photo:

* **Format:** Always upload **`.jpg`** (or `.jpeg`) for photos. Use **`.png`** only for graphic designs or logos.
* **Orientation:** Hero banners and cover images must be **horizontal (landscape)**.
* **File Size:** Keep files **under 1MB** if possible. Never upload photos larger than **5MB** (the system will reject them).
* **Dimensions:** Aim for **1200px to 1920px wide** for header banners.

---

## 🛠️ Part 6: Troubleshooting

### "My changes are not showing on the live website"
1. **Wait:** The site takes 1 to 2 minutes to compile and redeploy.
2. **Hard Refresh:** Clear your browser's cached files by pressing:
   - **Windows:** `Ctrl + F5` or `Ctrl + Shift + R`
   - **Mac:** `Cmd + Shift + R`
3. **Check Status:** Verify that you changed the **Status** field from "Draft" to **"Published"** in the sidebar before clicking Save.

### "I cannot log in"
1. Open your browser in Private/Incognito mode and try logging in.
2. Clear your browser cookies and cache.
3. Ensure you are signed in to the correct GitHub account in another tab.

---

*Manual Version 1.3 - Updated July 2026*  
*Maintained by [itsmyapp.co.uk](https://itsmyapp.co.uk) — hello@itsmyapp.co.uk*
