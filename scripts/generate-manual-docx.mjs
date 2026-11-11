import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  ExternalHyperlink,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType
} from 'docx'

function createLinkedRuns(text, baseColor = '334155', baseSize = 21, isBold = false) {
  const urlRegex = /(https?:\/\/[^\s)]+)/g
  const parts = text.split(urlRegex)
  const children = []

  for (const part of parts) {
    if (!part) continue
    if (/^https?:\/\//.test(part)) {
      children.push(
        new ExternalHyperlink({
          link: part,
          children: [
            new TextRun({
              text: part,
              color: '2563EB',
              underline: {},
              bold: true,
              size: baseSize
            })
          ]
        })
      )
    } else {
      children.push(
        new TextRun({
          text: part,
          color: baseColor,
          bold: isBold,
          size: baseSize
        })
      )
    }
  }
  return children
}

async function generateDocx() {
  const shipLogoPng = await sharp(path.join(process.cwd(), 'public', 'images', 'the_ship_inn2.webp'))
    .resize(160, 160, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer()

  const itsmyappLogoPng = await sharp(path.join(process.cwd(), 'public', 'images', 'itsmyapp_logo.webp'))
    .resize(140, 44, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer()

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Segoe UI',
            size: 22, // 11pt
            color: '334155'
          },
          paragraph: {
            spacing: {
              after: 140,
              line: 276
            }
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1080,
              bottom: 1080,
              left: 1200,
              right: 1200
            }
          }
        },
        children: [
          // Logo & Document Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new ImageRun({
                data: shipLogoPng,
                transformation: { width: 95, height: 95 },
                type: 'png'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'THE SHIP INN',
                bold: true,
                size: 26,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'The Ship Inn Porlock Weir — Website & Content Management Guide',
                bold: true,
                size: 36, // 18pt
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'System: ',
                bold: true,
                size: 21
              }),
              new TextRun({
                text: 'Dedicated Admin Tools, Outstatic CMS, Auto AVIF/WebP & PWA | Version 3.1 (11 November 2026)',
                bold: true,
                color: 'D97706',
                size: 21
              })
            ]
          }),

          // Fast Track Callout Box
          createCalloutBox(
            '⚡ Fast Track: Which Tool to Use?',
            [
              '• To Upload or Update PDF Menus: Use the Menu Manager — https://theshipinnporlockweir.co.uk/admin/menus',
              '• To Add or Remove Gallery Photos: Use the Gallery Manager — https://theshipinnporlockweir.co.uk/admin/gallery',
              '• To Manage Customer Reviews & Testimonials: Use the Testimonials Manager — https://theshipinnporlockweir.co.uk/admin/testimonials',
              '• To Edit Page Text, Hours, Contact Info, News, or Events: Use Outstatic CMS — https://theshipinnporlockweir.co.uk/outstatic'
            ]
          ),

          // Section 1: Dedicated Fast Admin Tools
          createHeading('1. Dedicated Fast Admin Tools (1-Minute Updates)'),

          new Paragraph({
            children: [
              new TextRun({ text: '1.1 Menu Manager & PDF Uploader', bold: true, size: 24, color: '1E3A8A' })
            ]
          }),
          new Paragraph({
            text: 'Use this dedicated tool whenever you have a new season or updated menu PDF:'
          }),
          createStepBox([
            '1. Open your browser and go to: https://theshipinnporlockweir.co.uk/admin/menus',
            '2. Click the menu you want to update (Breakfast Menu, Lunch Menu, Evening Menu, Sunday Lunch Menu, or Custom Menu).',
            '3. Enter the Season / Subtitle (e.g. "Autumn/Winter 2026" or "Served 12:00 PM – 3:00 PM").',
            '4. Click "Browse PDF file" and choose your .pdf file.',
            '5. Click "Upload & Publish Menu". The live website and Outstatic update automatically in 1–2 minutes!'
          ]),

          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({ text: '1.2 Gallery Manager & Photo Uploader (with Auto-AVIF & WebP Conversion)', bold: true, size: 24, color: '1E3A8A' })
            ]
          }),
          new Paragraph({
            text: 'Use this dedicated tool to upload new photos to the gallery or delete old ones without having to manually resize images or copy file links:'
          }),
          createStepBox([
            '1. Open your browser and go to: https://theshipinnporlockweir.co.uk/admin/gallery',
            '2. Choose your upload mode:',
            '   • Single Photo Upload: Add an individual photo with a custom title and caption.',
            '   • Batch Upload: Upload 3–10+ photos at once into a chosen category.',
            '3. Click the matching category button (Food & Drink, Interior & Bar, Exterior & Garden, Rooms & Cabins, Surroundings & Exmoor, or Custom).',
            '4. Click "Browse Image" to select your photo (.jpg, .jpeg, .png, .webp, .avif, .jfif, .gif up to 20MB) and verify the instant preview thumbnail.',
            '5. Enter a descriptive Photo Title / Alt Text and optional Caption.',
            '6. Click "Upload & Publish Image". Your photo is automatically converted into both .avif and .webp, goes live immediately, and syncs with Outstatic CMS!',
            '7. Deleting or Editing Existing Photos: Scroll down to the "Current Gallery Photos" section at the bottom of /admin/gallery to filter by category, click "Delete" to remove a photo, or click "Edit in Outstatic".'
          ]),

          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({ text: '1.3 Testimonials & Customer Reviews Manager', bold: true, size: 24, color: '1E3A8A' })
            ]
          }),
          new Paragraph({
            text: 'Use this dedicated tool to approve customer submissions from the website, manually transcribe reviews from Google or TripAdvisor, and manage what reviews appear on the homepage:'
          }),
          createStepBox([
            '1. Open your browser and go to: https://theshipinnporlockweir.co.uk/admin/testimonials',
            '2. Live Stats & Tabs: The dashboard displays live counts (Total Reviews, Average Star Rating, Pending Approvals, Published Reviews) and tabbed filters (All, Pending, Published, Archived).',
            '3. Approving Guest Submissions: When guests leave a review via the website modal, it lands in "Pending" status. Click the green "Approve & Publish" button to immediately make it live on the homepage.',
            '4. Manually Adding Reviews: Click the "+ Add New Review" button in the header. Enter the guest\'s name, rating (1–5 stars), visit date, source (Google, TripAdvisor, In Person / Guestbook, or Direct), review text, and optional verified stay badge. Click "Save & Publish".',
            '5. Editing or Archiving: Click "Edit" on any review card to update wording or rating. Click "Archive / Hide" to remove a review from the homepage without permanently deleting it, or click "Delete" to remove it permanently.'
          ]),

          // Section 2: Outstatic CMS Login
          createHeading('2. How to Log In to Outstatic CMS'),
          new Paragraph({
            text: 'Use Outstatic CMS when you need to edit written text across website pages, change opening hours, post news stories, or add events:'
          }),
          createStepBox([
            '1. In your browser, go to: https://theshipinnporlockweir.co.uk/outstatic',
            '2. Click "Sign in with GitHub".',
            '3. Enter Username: hello@theshipinnporlockweir.co.uk and Password: theshipinnta248pb!',
            '4. If prompted on screen, click "Authorize".'
          ]),

          // Section 3: Understanding the Dashboard
          createHeading('3. Understanding the Outstatic Dashboard'),
          new Paragraph({
            text: 'The left sidebar of your Outstatic dashboard provides access to all content sections:'
          }),
          createBullet('Pages — Controls text and banners on core website pages (Home, Food & Drink, Contact, Rooms, Things to Do, Gallery, News & Events).'),
          createBullet('Menus — Shows all uploaded menus (where you can toggle Draft/Published to temporarily hide a menu).'),
          createBullet('Gallery — Shows your photo collection (where you can edit captions or toggle Draft/Published).'),
          createBullet('Events — Add upcoming live music, pub quizzes, and seasonal celebrations.'),
          createBullet('News — Post articles and announcements.'),
          createBullet('Media Library — Central repository for all images used on website pages.'),

          // Section 4: How to Edit and Save Any Page
          createHeading('4. How to Edit and Save Any Page in Outstatic'),
          createStepBox([
            '1. In the left sidebar, click Pages, then click the page you want to update.',
            '2. Focus on the Right Sidebar fields. (The large center editor is not used for page layouts).',
            '3. If a field shows "+ Create", click it to open the text input box.',
            '4. Ensure Status is set to "Published" (not Draft).',
            '5. Click the black "Save" button in the top-right corner.',
            '6. Wait 1–2 minutes, then refresh your live website to see changes.'
          ]),

          // Section 5: Page-by-Page Editing Guide
          createHeading('5. Page-by-Page Field Reference'),

          new Paragraph({
            children: [
              new TextRun({ text: '🏠 The Homepage (home)', bold: true, size: 24, color: '1E3A8A' })
            ]
          }),
          createBullet('Hero Image One, Two, Three: Giant rotating background photos behind the main welcome text.'),
          createBullet('Strapline: The subtitle text directly below the logo ("Historic charm meets modern comfort").'),
          createBullet('Intro Paragraphs 1 to 5: The core welcoming text in the middle section of the home page.'),
          createBullet('Feature Cards 1, 2, 3 (Title & Desc): The three promotional cards at the bottom (Rooms, Pub & Restaurant, Location).'),

          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({ text: '🍷 Food & Drink Page (food-drink)', bold: true, size: 24, color: '1E3A8A' })
            ]
          }),
          createTable(
            ['What you see on the website', 'Field to edit in Outstatic (Right Sidebar)'],
            [
              ['Wide banner photo at the top', 'Cover Image (click to choose from Media Library)'],
              ['Left column introductory text', 'Food & Drink Intro One & Food & Drink Intro Two'],
              ['Lagers, Ciders, Ales beer lists', 'Lagers, Ciders, Ales (comma-separated lists)'],
              ['Breakfast serving details', 'Breakfast Description & Breakfast Times'],
              ['Downloadable PDF Menus', 'Managed via https://theshipinnporlockweir.co.uk/admin/menus']
            ]
          ),

          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({ text: '📞 Contact Page (contact — Global Information)', bold: true, size: 24, color: '1E3A8A' })
            ]
          }),
          new Paragraph({
            text: 'Note: Editing the Contact page automatically updates contact details across the ENTIRE site (Footer, Header, Booking CTAs, Legal):'
          }),
          createTable(
            ['What you see on the website', 'Field to edit in Outstatic (Right Sidebar)'],
            [
              ['Phone & Email everywhere', 'Phone Number, Email Address'],
              ['Address in Footer & Header', 'Address Line One, Two, Town, Postcode'],
              ['Daily opening hours', 'Opening Hours (Monday - Sunday)'],
              ['Food serving times in Footer', 'Kitchen Close Info'],
              ['Resident breakfast & seasonal notes', 'Breakfast Times, Seasonal Note']
            ]
          ),

          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({ text: '🛏️ Other Core Pages (rooms, things-to-do, gallery, news-events)', bold: true, size: 24, color: '1E3A8A' })
            ]
          }),
          createTable(
            ['Page', 'Fields to edit in Outstatic (Right Sidebar)'],
            [
              ['From the Cabins (rooms)', 'Cover Image (top hero banner) & Hero Alt'],
              ['Things to Do (things-to-do)', 'Cover Image (top hero banner) & Hero Alt'],
              ['Gallery (gallery)', 'Cover Image (top hero banner) & Hero Alt (photos managed via /admin/gallery)'],
              ['News & Events (news-events)', 'Cover Image (top hero banner) & Hero Alt']
            ]
          ),

          // Section 6: Events and News
          createHeading('6. How to Add a New Event or News Article'),
          createStepBox([
            '1. Click Events or News in the left sidebar of Outstatic.',
            '2. Click the black "New" button in the top right.',
            '3. In the centre screen: Type your headline in the Title box and write your story or event description below it.',
            '4. In the right sidebar (Events): Enter eventDate (e.g. 2026-12-31), eventTime (e.g. 8:00 PM), location (e.g. The Ship Inn Bar), upload an image under Upload image / Cover Image, and enter a short Description. (Past events hide automatically once their date passes!)',
            '5. In the right sidebar (News): Select Published At date, upload a Cover Image, and enter a short Description.',
            '6. Set Status to "Published" and click Save.'
          ]),

          // Section 7: Automatic Image Optimization
          createHeading('7. Automatic Image Optimization (.avif & .webp) — Zero Effort Required'),
          new Paragraph({
            text: 'You never need to convert or compress photos before uploading them to the website:'
          }),
          createBullet('Via the Gallery Manager (/admin/gallery): Any .jpg, .png, or .webp photo you upload is automatically resized (max 2000px) and converted on the server into both an ultra-fast .avif file and a .webp fallback.'),
          createBullet('Via Outstatic CMS (/outstatic): Any .jpg or .png photo you choose inside Outstatic is automatically converted in your browser into .webp before saving, and the website build automatically generates its matching .avif companion.'),
          createBullet('Live Website Delivery: Every image across the entire website is served inside a smart <picture> element that delivers .avif first with an automatic .webp fallback.'),

          // Section 8: Progressive Web App (PWA) & Offline Support
          createHeading('8. Progressive Web App (PWA) & Offline Coastal Mode'),
          new Paragraph({
            text: 'The Ship Inn website is an installable Progressive Web App (PWA) built for Porlock Weir and the Exmoor coast:'
          }),
          createBullet('Installable App: Guests can tap "Add to Home Screen" (iPhone/iPad) or "Install App" (Android/Desktop) to install The Ship Inn on their device.'),
          createBullet('Quick App Shortcuts: Long-pressing the installed app icon provides 1-tap shortcuts to Menus & Dining, From the Cabins, and Contact & Directions.'),
          createBullet('Offline Caching: Visited pages, photos, and downloadable PDF menus (/menus/*.pdf) are cached automatically so guests can still read menus when coastal mobile signal drops.'),
          createBullet('Offline Coastal Card: If a guest is offline and opens an uncached page, a branded offline card displays your telephone number (01643 863288), address (Porlock Weir, TA24 8PB), and bar/food serving hours.'),

          // Section 9: Quick Summary Table
          createHeading('9. Summary: Which Tool Should I Use?'),
          createTable(
            ['Task', 'Recommended Tool', 'Web Link'],
            [
              ['Upload a new PDF food menu', 'Menu Manager', 'https://theshipinnporlockweir.co.uk/admin/menus'],
              ['Add or delete photos in the gallery', 'Gallery Manager (auto-AVIF/WebP)', 'https://theshipinnporlockweir.co.uk/admin/gallery'],
              ['Approve guest reviews or add Google/TripAdvisor reviews', 'Testimonials Manager', 'https://theshipinnporlockweir.co.uk/admin/testimonials'],
              ['Temporarily hide a menu or photo', 'Outstatic (Switch to Draft)', 'https://theshipinnporlockweir.co.uk/outstatic'],
              ['Edit phone number, address, or hours', 'Outstatic Pages (Contact)', 'https://theshipinnporlockweir.co.uk/outstatic'],
              ['Add an upcoming live music event', 'Outstatic Events', 'https://theshipinnporlockweir.co.uk/outstatic'],
              ['Publish a news story or announcement', 'Outstatic News', 'https://theshipinnporlockweir.co.uk/outstatic']
            ]
          ),

          // Footer
          new Paragraph({
            spacing: { before: 360, after: 80 },
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: itsmyappLogoPng,
                transformation: { width: 110, height: 34 },
                type: 'png'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'The Ship Inn, Porlock Weir — TA24 8PB\n',
                bold: true,
                size: 20
              }),
              new TextRun({
                text: 'Website & CMS Managed by itsmyapp (https://itsmyapp.co.uk)\n',
                color: '64748B',
                size: 18
              }),
              new TextRun({
                text: 'Manual Version 3.1 • Updated 11 November 2026',
                italics: true,
                color: '94A3B8',
                size: 18
              })
            ]
          })
        ]
      }
    ]
  })

  const buffer = await Packer.toBuffer(doc)
  const rootDir = process.cwd()
  const docsDir = path.join(rootDir, 'docs')
  const publicDocsDir = path.join(rootDir, 'public', 'docs')
  const manualsDir = path.join(rootDir, '..', 'Manuals')

  if (!fs.existsSync(publicDocsDir)) {
    fs.mkdirSync(publicDocsDir, { recursive: true })
  }

  const targets = [
    path.join(manualsDir, 'The-Ship-Inn-Website-Management-Guide 20261111.docx'),
    path.join(manualsDir, 'The-Ship-Inn-Website-Management-Guide 20261108.docx'),
    path.join(manualsDir, 'The-Ship-Inn-Website-Management-Guide.docx'),
    path.join(rootDir, 'The-Ship-Inn-Website-Management-Guide.docx'),
    path.join(docsDir, 'The-Ship-Inn-Website-Management-Guide.docx'),
    path.join(docsDir, 'The-Ship-Inn-CMS-User-Manual.docx'),
    path.join(publicDocsDir, 'The-Ship-Inn-Website-Management-Guide.docx'),
    path.join(publicDocsDir, 'The-Ship-Inn-CMS-User-Manual.docx')
  ]

  for (const target of targets) {
    try {
      fs.writeFileSync(target, buffer)
      console.log(`Saved: ${path.relative(rootDir, target)}`)
    } catch (e) {
      console.log(`Could not write ${target} (file may be open in Word):`, e.message)
    }
  }
}

// Helpers
function createHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 140 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28, // 14pt
        color: '1E3A8A'
      })
    ]
  })
}

function createBullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: createLinkedRuns(text, '334155', 22, false)
  })
}

function createCalloutBox(title, lines) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: 'EFF6FF' },
            borders: {
              left: { style: BorderStyle.SINGLE, size: 36, color: '1E3A8A' },
              top: { style: BorderStyle.SINGLE, size: 6, color: 'BFDBFE' },
              right: { style: BorderStyle.SINGLE, size: 6, color: 'BFDBFE' },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: 'BFDBFE' }
            },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
            children: [
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({ text: title, bold: true, size: 24, color: '1E3A8A' })
                ]
              }),
              ...lines.map(l => new Paragraph({
                spacing: { after: 60 },
                children: createLinkedRuns(l, '1E3A8A', 21, false)
              }))
            ]
          })
        ]
      })
    ]
  })
}

function createStepBox(steps) {
  const children = steps.map((step, idx) => {
    const isHeader = idx === 0 && !step.startsWith('1.')
    return new Paragraph({
      spacing: { after: 60 },
      children: createLinkedRuns(step, isHeader ? '1E3A8A' : '334155', 21, isHeader)
    })
  })

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
            borders: {
              left: { style: BorderStyle.SINGLE, size: 24, color: '1E3A8A' },
              top: { style: BorderStyle.SINGLE, size: 6, color: 'E2E8F0' },
              right: { style: BorderStyle.SINGLE, size: 6, color: 'E2E8F0' },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: 'E2E8F0' }
            },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
            children: children
          })
        ]
      })
    ]
  })
}

function createTable(headers, rows) {
  const headerRow = new TableRow({
    children: headers.map(h => new TableCell({
      shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: h,
              bold: true,
              color: 'FFFFFF',
              size: 20
            })
          ]
        })
      ]
    }))
  })

  const bodyRows = rows.map((r, rowIdx) => new TableRow({
    children: r.map(c => new TableCell({
      shading: { type: ShadingType.CLEAR, fill: rowIdx % 2 === 0 ? 'FFFFFF' : 'F8FAFC' },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
        left: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
        right: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' }
      },
      children: [
        new Paragraph({
          children: createLinkedRuns(c, '334155', 20, false)
        })
      ]
    }))
  }))

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows]
  })
}

generateDocx().catch(console.error)
