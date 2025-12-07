# Image Management for The Ship Inn Website

## 📁 Where to Place Your Images

### Local Images (Static)
Place your images in the `public/images/` folder:

```
public/
  images/
    rooms/          - Room photos
    gallery/        - Gallery images
    food/          - Food & restaurant photos
    exterior/      - Building exterior shots
    location/      - Porlock Weir area photos
```

### How to Reference Images in Code

**In JSX/TSX files:**
```jsx
// For images in public/images/
<img src="/images/rooms/harbour-room.jpg" alt="Harbour Room" />

// Using Next.js Image component (recommended)
import Image from 'next/image'
<Image 
  src="/images/rooms/harbour-room.jpg" 
  alt="Harbour Room"
  width={800}
  height={600}
/>
```

### Image Best Practices

1. **File Naming:**
   - Use lowercase with hyphens: `harbour-room-bed.jpg`
   - Be descriptive: `ship-inn-exterior-sunset.jpg`

2. **File Formats:**
   - Use `.jpg` for photos
   - Use `.png` for logos/graphics with transparency
   - Use `.webp` for better compression (modern browsers)

3. **Image Sizes:**
   - Hero images: 1920x1080px or larger
   - Room photos: 800x600px minimum
   - Gallery thumbnails: 400x300px
   - Optimize file sizes (under 500KB for web)

## 🌐 External Image Options

### Current Setup (Unsplash)
- Hero background uses Unsplash CDN
- Free, high-quality images
- Automatic optimization
- Example: `https://images.unsplash.com/photo-...`

### Other CDN Options
1. **Cloudinary** - Advanced image optimization
2. **AWS S3 + CloudFront** - Scalable storage
3. **Vercel Image Optimization** - Automatic with deployment

## 🔄 Newsletter Integration Options

### Current Setup
- Basic HTML form (needs backend integration)

### Integration Options
1. **Mailchimp** - Popular email marketing
2. **ConvertKit** - Creator-focused platform  
3. **EmailJS** - Client-side email sending
4. **Netlify Forms** - Simple form handling

### Quick Mailchimp Setup
1. Create Mailchimp account
2. Get embed code
3. Replace form in `NewsletterSignup.tsx`

Would you like me to:
1. Set up a specific newsletter service?
2. Add sample images to demonstrate?
3. Create an image upload system?