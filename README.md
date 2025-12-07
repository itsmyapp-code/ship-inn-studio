# The Ship Inn Porlock Weir - Website

A modern, responsive website for The Ship Inn, a historic B&B with pub and restaurant in Porlock Weir, Somerset.

## Features

- **Modern Design**: Inspired by boutique accommodation websites with maritime/countryside theming
- **8 Core Pages**: Home, Rooms, Food & Drink, Things to Do, Events & News, Gallery, Contact, Legal
- **Responsive**: Mobile-first design that works on all devices
- **SEO Optimized**: Meta tags, structured data, and optimized images
- **CMS Ready**: Sanity.io integration for blog/news content management
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **CMS**: Sanity.io for content management
- **Deployment**: Vercel-ready configuration

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ship-inn-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Sanity project details
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── contact/           # Contact & Find Us page
│   ├── events-news/       # Events & News (Sanity CMS)
│   ├── food-drink/        # Food & Drink menu
│   ├── gallery/           # Photo gallery
│   ├── legal/             # Privacy, Terms, etc.
│   ├── rooms/             # Room listings
│   ├── things-to-do/      # Local attractions guide
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── Navigation.tsx     # Main navigation
│   └── Footer.tsx         # Site footer
└── lib/                   # Utility functions
    └── sanity.ts          # Sanity CMS configuration
```

## Content Management

The Events & News section is powered by Sanity.io. To set up:

1. Create a Sanity project at [sanity.io](https://sanity.io)
2. Add your project ID to `.env.local`
3. Configure schemas for blog posts and events
4. Deploy your Sanity Studio

## Customization

### Theme Colors
The design uses a maritime-inspired color palette defined in `tailwind.config.js`:
- Ship Blue: Primary brand color
- Ship Gold: Accent color for highlights  
- Ship Green: Nature/outdoor themed sections

### Content
- Replace placeholder images with professional photography
- Update contact details and business information
- Customize room descriptions and pricing
- Add actual menu items and local area information

## Deployment

The site is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Performance

- Static site generation where possible
- Optimized images with Next.js Image component
- Minimal JavaScript for fast loading
- Excellent Core Web Vitals scores

## SEO Features

- Structured data for local business
- OpenGraph and Twitter Card meta tags
- Semantic HTML markup
- Sitemap generation
- Robot.txt configuration

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader optimized
- High contrast ratios
- Focus indicators

## Support

For technical support or customization requests, please contact the development team.

## License

This project is proprietary software created for The Ship Inn Porlock Weir.