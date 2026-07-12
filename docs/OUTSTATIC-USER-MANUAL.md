# The Ship Inn: Website CMS Manual
System: Outstatic CMS

---

## 🚀 Quick Access & Login

| Destination | Link |
|-------------|------|
| **CMS Dashboard** | [theshipinnporlockweir.co.uk/outstatic](https://theshipinnporlockweir.co.uk/outstatic) |
| **Live Website**  | [theshipinnporlockweir.co.uk](https://theshipinnporlockweir.co.uk) |

### How to Log In:
1. Navigate to the **CMS Dashboard** link above.
2. Click **"Sign in with GitHub"**.
3. Use the following credentials:
   - **Username:** `hello@theshipinnporlockweir.co.uk`
   - **Password:** `theshipinnta248pb!`
4. If prompted, authorize the application.

---

## ⚡ Core Workflow: How to Update the Site

### Phase 1: Select Content Type
In the left sidebar, choose the type of content you want to edit:
- **Pages**: Controls core page layouts, hero images, contact info, opening hours, and static text.
- **Events**: Controls upcoming events listings.
- **News**: Controls news articles and updates.

### Phase 2: Create or Edit a Document
- **To edit existing content:** Click on the document title in the list (e.g., click `home` inside **Pages**).
- **To create new content (News/Events only):** Click the **"New"** button in the top right.

### Phase 3: Fill in standard fields
| Field | Requirement | Best Practice |
|-------|-------------|---------------|
| **Title** | ✅ Required | Keep it clear and descriptive (e.g., "Live Music Night"). |
| **Date** | ✅ Required | Determines the sorting order of News/Events on the website. |
| **Status** | ✅ Required | Keep as **"Draft"** while writing. Switch to **"Published"** only when ready to go live. |
| **Description** | Recommended | 2-3 sentences. Appears on the main listing card. |
| **Cover Image** | Recommended | Banner image. Horizontal/Landscape orientation works best. |

### Phase 4: Formatting & Images in the Editor
- **Rich Text Editor:** Highlight text to see options or use keyboard shortcuts:
  - **Bold:** `Ctrl+B` (Windows) / `Cmd+B` (Mac)
  - **Italic:** `Ctrl+I` (Windows) / `Cmd+I` (Mac)
  - **Headings:** Use the dropdown menu to structure long text blocks.
  - **Lists:** Use bullet points or numbers.
- **Image Constraints:**
  - **Format:** `JPG` for photos, `PNG` for logos.
  - **File Size:** Max 1MB recommended (5MB hard limit). Width of 1200px is ideal.
- **How to Upload Images:**
  - **For Cover/Hero Banners:** Use the **Cover Image** box in the right sidebar.
  - **For Inline Images:** Place cursor in the text box, press `/`, scroll down and click **Image**, then upload.

---

## 🗺️ Master Mapping: What Changes What?

The new **Pages** collection lets you edit content across the entire website by modifying specific fields in dedicated documents:

### 🏠 1. Homepage Configuration (`Pages` -> `home`)
Modify these fields to update [theshipinnporlockweir.co.uk](https://theshipinnporlockweir.co.uk):

| Field Name in CMS | Location on Live Website | What it Controls |
|:---|:---|:---|
| **Cover Image** | Top of Homepage | Full-screen background image of the main hero section. |
| **Hero Image Alt Text** | Under the hood | Screen reader description of the hero image (accessibility). |
| **Homepage Strapline** | Below Logo overlay | The welcome sub-headline (e.g., *Historic charm meets modern comfort*). |
| **Intro Paragraph 1 - 5** | "Your Coastal Retreat..." | The 5 intro copy paragraphs in the center of the homepage. |
| **Feature 1 Title & Desc** | Left Feature Card | Heading and text for the accommodation feature card (links to Cabins). |
| **Feature 2 Title & Desc** | Center Feature Card | Heading and text for the pub & restaurant feature card. |
| **Feature 3 Title & Desc** | Right Feature Card | Heading and text for the location/Exmoor feature card. |

---

### 🍷 2. Food & Drink Configuration (`Pages` -> `food-drink`)
Modify these fields to update the **From the Galley & Saloon** page:

| Field Name in CMS | Location on Live Website | What it Controls |
|:---|:---|:---|
| **Cover Image** | Top Banner | Background photo for the page header banner. |
| **Food & Drink Intro Para 1 & 2**| Below header | The intro text columns describing the restaurant/sourcing. |
| **Lagers List** | Drinks -> Lagers | Comma-separated list of lagers (e.g. *Estrella, Carlsberg, Peretti*). |
| **Ciders List** | Drinks -> Ciders | Comma-separated list of ciders (e.g. *Thatchers, Hawkstone*). |
| **Ales List** | Drinks -> Ales | Comma-separated list of cask/guest ales (e.g. *Otter Amber, Guinness*). |
| **Breakfast Description** | Breakfast section | Text block explaining breakfast offerings. |
| **Breakfast Times** | Breakfast section | Residents' breakfast hours (e.g. *8am - 10am (Residents Only)*). |

---

### 📞 3. Contact details & Hours (`Pages` -> `contact`)
**CRITICAL:** Changing fields in this document automatically updates the details globally across the **Contact Page, Footer, Rooms page, and reservation forms**:

| Field Name in CMS | Location on Live Website | What it Controls |
|:---|:---|:---|
| **Cover Image** | Top Banner & Contact Image | Background photo for the page header banner AND the image next to the contact form. |
| **Phone Number** | Global | Updates the telephone links in the **Footer**, **Rooms CTA**, **Food & Drink Reservation**, and **Contact Page**. |
| **Email Address** | Global | Updates the email links in the **Footer**, **Contact Page**, **Reservation forms**, and all **Legal Policies** (Privacy, Cookies, etc.). |
| **Address Line 1 & 2, Town, Postcode** | Footer & Contact Page | Updates the physical address text blocks. |
| **Opening Hours (Mon - Sun)** | Contact Page | Sets the daily Bar opening times listed on the Contact page. |
| **Kitchen Close Info** | Footer & Contact Page | Food serving hours (e.g. *Food served: 12:00 PM - 9:00 PM*). |
| **Breakfast Times** | Contact Page | Breakfast serving times listed on the Contact page. |
| **Opening Hours Seasonal Note** | Contact Page | Custom italic note shown at the bottom of the opening hours block. |

---

### 🛏️ 4. Header Banners (`Pages` -> `rooms`, `things-to-do`, `gallery`, `news-events`)
To update the top banner background images for other sections:

| Document Slug | Page Location | Field to Edit |
|:---|:---|:---|
| **`rooms`** | Accommodations page | Edit **Cover Image** to change the header photo. |
| **`things-to-do`**| Things to do page | Edit **Cover Image** to change the header photo. |
| **`gallery`** | Photo Gallery page | Edit **Cover Image** to change the header photo. |
| **`news-events`**| News & Events listing | Edit **Cover Image** to change the header photo. |

---

## 🟢 Going Live (Publishing)

This website is static, meaning it rebuilds itself securely in the background whenever you save your changes.

1. **Set Status:** Change status from **"Draft"** to **"Published"** in the right sidebar.
2. **Save:** Click the **"Save"** button in the top right.
3. **Wait:** The website takes **1-2 minutes** to build and push the new version live.
4. **Verify:** Open the live site to check the changes. If they don't appear immediately, wait another minute and perform a **"Hard Refresh"** (`Ctrl+Shift+R` on Windows, `Cmd+Shift+R` on Mac).

---

## 🛠️ Troubleshooting & Safety

### Common Issues
* **"Changes aren't showing"**: Wait 2-3 minutes for the rebuild to finish. Perform a hard refresh to clear browser cache.
* **"Images won't upload"**: Double-check that the file size is under 5MB (preferably under 1MB). Convert it to a `.jpg` or `.png` and try again.
* **"I can't log in"**: Clear browser cookies. Ensure you are logged into the correct GitHub account.

### Danger Zone 🗑️
* **Deleting Content:** Open the document and click the **trash icon** in the right sidebar.
* **Warning:** Deletion is permanent and cannot be undone.

---

## ✅ Pre-Flight Checklist
Before clicking **Save** on a published document:
- [ ] Is the publication **Date** correct?
- [ ] Is the **Cover Image** high quality and in landscape orientation?
- [ ] Did you use **Headings** (H2, H3) to structure any long text blocks?
- [ ] Is the **Status** set to **Published**?

---

*Manual Version 1.2 - Updated July 2026*  
*Provided by [itsmyapp.co.uk](https://itsmyapp.co.uk) — hello@itsmyapp.co.uk*
