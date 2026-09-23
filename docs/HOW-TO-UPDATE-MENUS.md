# How to Manage & Update Menus in Outstatic CMS

This guide explains how to update, replace, and add menus on **The Ship Inn** website using the Outstatic CMS dashboard.

---

> [!IMPORTANT]
> ### File Format Requirement
> **Only `.pdf` files are supported for downloadable menus.**
> Word documents (`.docx`), images (`.jpg`/`.png`), or other file formats cannot be used as downloadable menus. Please save or export your menu as a PDF before uploading.

---

## 1. Accessing Menus in Outstatic

1. Open your Outstatic dashboard (e.g. `https://your-domain/outstatic` or local dev).
2. In the left navigation menu, click **Menus**.
3. You will see all current menus:
   - **Breakfast Menu**
   - **Lunch Menu**
   - **Evening Menu**
   - **Sunday Lunch Menu**

---

## 2. How to Update an Existing Menu (e.g. New Seasonal Menu)

When you have a new version of a menu (e.g., Autumn / Winter or a new month):

1. **Prepare your file**: Ensure your new menu is saved as a **`.pdf`** file (e.g. `Lunch Menu - Autumn 2026.pdf`).
2. In Outstatic under **Menus**, click on the menu you wish to update (e.g. **Lunch Menu**).
3. In the right-hand sidebar:
   - **Subtitle / Season / Serving Times**: Update the season or times (e.g. `Autumn 2026` or `Served 12:00 PM – 3:00 PM`).
   - **PDF File URL / Path**: 
     - Enter the path to your PDF (e.g. `/menus/Lunch Menu - Sept 2026.pdf` or paste the URL of your uploaded PDF).
     - *Remember: Only `.pdf` files are valid.*
   - **Status**: Ensure it is set to **Published**.
4. Click the black **Save** button in the top right.
5. Wait **1–2 minutes** for the website to automatically redeploy with the new menu!

---

## 3. How to Upload a PDF File

You can upload a new PDF in Outstatic:

1. Click on **Media** (or inside any document editor's upload prompt).
2. Upload your **`.pdf`** file.
3. Copy the path / URL (e.g. `/menus/filename.pdf` or `/images/filename.pdf`).
4. Paste this path into the **PDF File URL / Path** field in your menu entry.

---

## 4. How to Add a New Seasonal or Event Menu

To add a special menu (such as a *Christmas Party Menu*, *Valentine's Day Dinner*, or *Bank Holiday BBQ*):

1. In the left sidebar, click **Menus**.
2. Click the **+ New Entry** (or **Add Menu**) button.
3. Enter the **Title** (e.g. `Christmas Festive Menu`).
4. In the right sidebar:
   - **Subtitle / Season**: e.g. `December 2026` or `Bookings Only`.
   - **PDF File URL / Path**: Enter the path to your uploaded `.pdf` file (e.g. `/menus/Christmas-Menu-2026.pdf`).
   - **Display Order**: Enter a number for where it should appear (e.g. `5`).
   - **Status**: Set to **Published** (or leave as **Draft** if you are preparing it ahead of time).
5. Click **Save**.

---

## 5. How to Temporarily Hide or Remove a Menu

If a seasonal menu is no longer active:
- **To temporarily hide it**: Open the menu and change the **Status** from `Published` to `Draft`, then click **Save**. It will immediately be hidden from the website while preserving your settings.
- **To permanently remove it**: Open the menu and click the **Delete** button.

---

## Quick Reference Summary

| Field | What to enter | Example |
| :--- | :--- | :--- |
| **Title** | The name of the menu shown in bold | `Evening Menu` |
| **Subtitle** | Optional season date or serving hours | `Sept 2026` or `Served 5:30 PM - 9:00 PM` |
| **PDF File URL** | Path to the PDF (**Must end in `.pdf`**) | `/menus/Evening Menu - Sept 2026.pdf` |
| **Display Order** | Numerical sort order | `1` (Breakfast), `2` (Lunch), `3` (Evening), `4` (Sunday) |
| **Status** | `Published` to display on website, `Draft` to hide | `Published` |
