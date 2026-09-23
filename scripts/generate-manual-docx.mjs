import fs from 'fs'
import path from 'path'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  ImageRun
} from 'docx'

async function generateDocx() {
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
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        children: [
          // Header / Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'The Ship Inn Porlock Weir',
                bold: true,
                size: 32, // 16pt
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'CMS User Manual & Client Guide',
                bold: true,
                size: 40, // 20pt
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'System: ',
                bold: true,
                size: 22
              }),
              new TextRun({
                text: 'Outstatic CMS & Admin Tools',
                bold: true,
                color: 'D97706',
                size: 22
              })
            ]
          }),

          // Intro
          new Paragraph({
            spacing: { after: 280 },
            children: [
              new TextRun({
                text: 'This is the definitive instruction manual for managing your website, updating downloadable menus, adding gallery photos, and editing pages on ',
                size: 22
              }),
              new TextRun({
                text: 'theshipinnporlockweir.co.uk',
                bold: true,
                color: '1E3A8A'
              }),
              new TextRun({
                text: '.'
              })
            ]
          }),

          // Section 1: How to Log In
          createHeading('1. How to Log In'),
          createStepBox([
            '1. In your web browser, go to: https://theshipinnporlockweir.co.uk/outstatic',
            '2. Click "Sign in with GitHub".',
            '3. Enter Username: hello@theshipinnporlockweir.co.uk and Password: theshipinnta248pb!',
            '4. If prompted on screen, click "Authorize".'
          ]),

          // Section 2: Understanding the Dashboard
          createHeading('2. Understanding the Dashboard'),
          new Paragraph({
            text: 'The left sidebar of your Outstatic dashboard gives you access to all key website sections:'
          }),
          createBullet('Pages — Controls core website content (Home, Food & Drink, Contact, Rooms, etc.).'),
          createBullet('Menus — Displays and manages all downloadable food & drink PDF menus.'),
          createBullet('Gallery — Controls all photos and categories shown on the Photo Gallery page.'),
          createBullet('Events — Displays and schedules upcoming live music, pub events, and promotions.'),
          createBullet('News — Controls articles and news updates.'),
          createBullet('Media Library — Central repository for all uploaded images.'),

          // Section 3: How to Upload & Use Images
          createHeading('3. How to Upload and Use Images in Outstatic'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Step 1: Uploading Images to the Media Library', bold: true, color: '1E3A8A' })
            ]
          }),
          createStepBox([
            '1. In the left sidebar, click Media Library.',
            '2. Click "Add Media" and choose the image from your computer (.webp, .jpg, .png).',
            '3. The photo will appear immediately in your media library.'
          ]),

          new Paragraph({
            children: [
              new TextRun({ text: 'Step 2: Assigning Images to Pages', bold: true, color: '1E3A8A' })
            ]
          }),
          createStepBox([
            '• Cover Images (Standard Pages): Click the Cover Image box in the right sidebar, pick your photo from the Media Library, and click Save.',
            '• Hero Rotating Images (Home Page): Copy the image path from the Media Library (e.g., /images/ship-inn.webp) and paste it into Hero Image 1, 2, or 3.'
          ]),

          // Section 4: How to Edit and Save Any Page
          createHeading('4. How to Edit and Save Any Page'),
          createStepBox([
            '1. In the left sidebar, click Pages, then click the page you want to update.',
            '2. Focus on the Right Sidebar fields. (The large center editor is for internal notes only).',
            '3. If a field shows "+ Create", click it to open the text input box.',
            '4. Ensure Status is set to "Published" (not Draft).',
            '5. Click the black "Save" button in the top-right corner.',
            '6. Wait 1–2 minutes, then refresh your live website to see changes.'
          ]),

          // Section 5: Page-by-Page Editing Guide
          createHeading('5. What Each Field Changes (Page by Page)'),
          
          new Paragraph({
            children: [
              new TextRun({ text: '🏠 The Homepage', bold: true, size: 24, color: '1E3A8A' })
            ]
          }),
          createBullet('Hero Image One, Two, Three: Giant rotating background photos behind the main welcome text.'),
          createBullet('Strapline: The italic text directly below the logo ("Historic charm meets modern comfort").'),
          createBullet('Intro Paragraphs 1 to 5: The core welcoming text in the middle section of the home page.'),
          createBullet('Feature Cards 1, 2, 3: The three promotional cards at the bottom (Rooms, Pub & Restaurant, Location).'),

          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({ text: '🍷 Food & Drink Page', bold: true, size: 24, color: '1E3A8A' })
            ]
          }),
          createTable(
            ['What you see on the website', 'Field to edit in Outstatic (Right Sidebar)'],
            [
              ['Wide banner photo at the top', 'Cover Image'],
              ['Left column introductory text', 'Food & Drink Intro Para One'],
              ['Lagers, Ciders, Ales beer lists', 'Lagers List, Ciders List, Ales List'],
              ['Breakfast serving details', 'Breakfast Description & Times']
            ]
          ),

          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({ text: '📞 Contact Page (Global Information)', bold: true, size: 24, color: '1E3A8A' })
            ]
          }),
          new Paragraph({
            text: 'Note: Editing the Contact page automatically updates contact details across the ENTIRE site (Footer, Header, Legal):'
          }),
          createTable(
            ['What you see on the website', 'Field to edit in Outstatic (Right Sidebar)'],
            [
              ['Phone & Email everywhere', 'Phone Number, Email Address'],
              ['Address in Footer & Header', 'Address Line One, Two, Town, Postcode'],
              ['Daily opening hours', 'Opening Hours (Monday - Sunday)'],
              ['Food serving times in Footer', 'Kitchen Close Info']
            ]
          ),

          // Section 6: How to Manage & Upload Menus
          createHeading('6. How to Manage & Upload Menus'),
          new Paragraph({
            children: [
              new TextRun({
                text: '⚠️ Requirement: ',
                bold: true,
                color: 'D97706'
              }),
              new TextRun({
                text: 'Menus must be in PDF format (.pdf). Word files or images should be exported/saved as PDF before uploading.'
              })
            ]
          }),

          createStepBox([
            'Method 1: One-Click Menu Manager (Recommended)',
            '1. Go to: https://theshipinnporlockweir.co.uk/admin/menus',
            '2. Select the menu (Breakfast Menu, Lunch Menu, Evening Menu, Sunday Lunch Menu, or Custom Menu).',
            '3. Enter the Season / Subtitle (e.g. "Autumn 2026" or "Served 12:00 PM – 3:00 PM").',
            '4. Click "Browse PDF file" and choose your .pdf file.',
            '5. Click "Upload & Publish Menu". Live website & Outstatic update automatically in 1–2 minutes!'
          ]),

          createStepBox([
            'Method 2: Managing via Outstatic Dashboard',
            '1. Click Menus in the left sidebar of Outstatic.',
            '2. Click any menu to edit its subtitle, display order, or toggle Status from Published to Draft (to temporarily hide a menu).',
            '3. Click Save.'
          ]),

          // Section 7: How to Manage the Gallery
          createHeading('7. How to Manage the Photo Gallery'),
          createStepBox([
            'Method 1: Dedicated Gallery Manager (Recommended)',
            '1. Go to: https://theshipinnporlockweir.co.uk/admin/gallery',
            '2. Choose Single Photo Upload or Batch Upload (for uploading multiple photos at once).',
            '3. Select Category: Food & Drink, Interior & Bar, Exterior & Garden, Rooms & Cabins, Surroundings, or Custom.',
            '4. Click "Browse Image" to pick your photo (.webp, .jpg, .png, .avif) and preview it.',
            '5. Enter a Photo Title / Alt Text and optional Caption.',
            '6. Click "Upload & Publish Image". The photo goes live and syncs with Outstatic!'
          ]),

          createStepBox([
            'Method 2: Managing via Outstatic Dashboard',
            '1. Click Gallery in the left sidebar.',
            '2. Click "New" to create a photo entry.',
            '3. Set Title, Cover Image, and Category in the right sidebar.',
            '4. Set Status to Published (or Draft to hide) and click Save.'
          ]),

          // Section 8: Events and News
          createHeading('8. How to Add a New Event or News Article'),
          createStepBox([
            '1. Click Events or News in the left sidebar of Outstatic.',
            '2. Click the "New" button in the top right.',
            '3. In the centre screen: Type your headline in the Title box and write your story/event text below it.',
            '4. In the right sidebar: Select the Date, upload a Cover Image, and enter a short Description.',
            '5. Set Status to "Published" and click Save.'
          ]),

          // Quick Summary Table
          createHeading('9. Quick Summary: Which Tool Should I Use?'),
          createTable(
            ['Task', 'Best Tool', 'Web Link'],
            [
              ['Upload a new PDF food menu', 'Menu Manager', 'https://theshipinnporlockweir.co.uk/admin/menus'],
              ['Upload new photos to the gallery', 'Gallery Manager', 'https://theshipinnporlockweir.co.uk/admin/gallery'],
              ['Edit phone number, address, or hours', 'Outstatic Pages (Contact)', 'https://theshipinnporlockweir.co.uk/outstatic'],
              ['Add an upcoming live music event', 'Outstatic Events', 'https://theshipinnporlockweir.co.uk/outstatic'],
              ['Publish a news story or announcement', 'Outstatic News', 'https://theshipinnporlockweir.co.uk/outstatic']
            ]
          ),

          // Footer
          new Paragraph({
            spacing: { before: 400 },
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
                text: 'Manual Version 1.5 — Updated 23 September 2026',
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
  const docsDir = path.join(process.cwd(), 'docs')
  const publicDocsDir = path.join(process.cwd(), 'public', 'docs')

  if (!fs.existsSync(publicDocsDir)) {
    fs.mkdirSync(publicDocsDir, { recursive: true })
  }

  const filename = 'The-Ship-Inn-CMS-User-Manual.docx'
  fs.writeFileSync(path.join(docsDir, filename), buffer)
  fs.writeFileSync(path.join(publicDocsDir, filename), buffer)

  console.log('Successfully generated Word Document (.docx) at docs/ and public/docs/')
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
    children: [
      new TextRun({
        text,
        size: 22
      })
    ]
  })
}

function createStepBox(steps) {
  const children = steps.map((step, idx) => {
    return new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: step,
          bold: idx === 0 && !step.startsWith('1.'),
          color: idx === 0 && !step.startsWith('1.') ? '1E3A8A' : '334155',
          size: 21
        })
      ]
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
          children: [
            new TextRun({
              text: c,
              size: 20
            })
          ]
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
