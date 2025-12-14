# Outstatic CMS User Manual
## The Ship Inn Website Content Management

---

## 📍 Getting Started

### Accessing the CMS

1. Go to: **https://ship-inn-website.vercel.app/outstatic**
2. Click **"Sign in with GitHub"**
3. Authorize the application (first time only)
4. You're now in the dashboard!

---

## 🏠 Dashboard Overview

When you log in, you'll see the sidebar with:

| Menu Item | What It Does |
|-----------|--------------|
| **Collections** | View all content types |
| **Events** | Manage upcoming events |
| **News** | Manage news articles |
| **Settings** | CMS configuration |

---

## 📝 Creating Content

### Adding a New Event

1. Click **"Events"** in the sidebar
2. Click the **"New Event"** button (top right)
3. Fill in the fields:

| Field | Required | Description |
|-------|----------|-------------|
| **Title** | ✅ Yes | Event name (e.g., "Live Music Night") |
| **Date** | ✅ Yes | When to publish (shows as event date) |
| **Status** | ✅ Yes | Set to "Published" to make visible |
| **Description** | Recommended | Short summary shown on listing page |
| **Cover Image** | Recommended | Click to upload or select image |
| **Content** | Optional | Full event details (supports formatting) |

4. Write your content in the editor
5. Click **"Save"** button

### Adding a News Article

1. Click **"News"** in the sidebar
2. Click **"New News"** button
3. Fill in the same fields as events
4. Click **"Save"**

---

## ✏️ Editing Content

### Using the Content Editor

The editor supports rich text formatting:

#### Text Formatting
- **Bold** - Select text and press `Ctrl+B` or click B button
- *Italic* - Select text and press `Ctrl+I` or click I button
- Headings - Use the heading dropdown

#### Adding Images
1. Place your cursor where you want the image
2. Click the image icon in the toolbar
3. Upload a new image or select from existing
4. The image will be inserted at your cursor

#### Adding Links
1. Select the text you want to link
2. Click the link icon
3. Enter the URL
4. Click Apply

#### Adding Lists
- Use the bullet list icon for unordered lists
- Use the numbered list icon for ordered lists

---

## 📸 Managing Images

### Uploading Images

**Method 1: In the Editor**
1. Click the image icon in the content editor
2. Click "Upload" and select your file
3. Image is added to your content

**Method 2: Cover Image**
1. Click on "Cover Image" in the right sidebar
2. Click to upload or drag and drop
3. Select your image file

### Image Tips
- Use JPG for photos (smaller file size)
- Use PNG for logos/graphics with transparency
- Recommended size: 1200px wide for cover images
- Keep file sizes under 1MB for fast loading

---

## 📤 Publishing Content

### Status Options

| Status | What It Means |
|--------|---------------|
| **Draft** | Only visible in CMS, not on website |
| **Published** | Visible on the public website |

### To Publish:
1. Set **Status** to "Published" in the right sidebar
2. Click **Save**
3. Wait 1-2 minutes for the website to rebuild
4. Your content is now live!

### To Unpublish:
1. Change **Status** to "Draft"
2. Click **Save**
3. Content will be removed from the website

---

## 🗑️ Deleting Content

1. Open the content item you want to delete
2. Click the **trash icon** 🗑️ in the right sidebar
3. Confirm deletion
4. The content is permanently removed

⚠️ **Warning:** Deletion cannot be undone!

---

## 🔄 How Changes Go Live

When you save content in Outstatic:

1. ✅ Your changes are saved to GitHub
2. ✅ Vercel detects the change
3. ✅ Website automatically rebuilds (1-2 minutes)
4. ✅ New content appears on the live site

**No manual deployment needed!**

---

## 📋 Content Best Practices

### For Events
- ✅ Use clear, descriptive titles
- ✅ Set the correct date
- ✅ Add an eye-catching cover image
- ✅ Include key details: time, location, price
- ✅ Keep descriptions concise (2-3 sentences)

### For News
- ✅ Write engaging headlines
- ✅ Lead with the most important information
- ✅ Use images to break up text
- ✅ Keep articles focused on one topic

### Image Guidelines
- ✅ Use high-quality, well-lit photos
- ✅ Horizontal/landscape orientation works best
- ✅ Show people and atmosphere when possible
- ✅ Avoid text-heavy images

---

## ❓ Troubleshooting

### "I can't log in"
- Make sure you're using the correct GitHub account
- Clear your browser cookies and try again
- Check if you're connected to the internet

### "My changes aren't showing on the website"
- Wait 2-3 minutes for the rebuild to complete
- Hard refresh the page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check that Status is set to "Published"

### "Images aren't uploading"
- Check file size (max recommended: 5MB)
- Try a different image format (JPG or PNG)
- Refresh the page and try again

### "I accidentally deleted something"
- Content can be recovered from GitHub history
- Contact your developer for assistance

---

## 🔗 Quick Links

| What | URL |
|------|-----|
| CMS Dashboard | https://ship-inn-website.vercel.app/outstatic |
| Live Website | https://ship-inn-website.vercel.app |
| News & Events Page | https://ship-inn-website.vercel.app/news-events |

---

## 📞 Need Help?

If you encounter issues not covered in this manual:
1. Take a screenshot of any error messages
2. Note what you were trying to do
3. Contact your website administrator

---

*Manual Version 1.0 - December 2025*
