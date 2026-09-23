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
  ShadingType
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
          // Document Header
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
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: 'Website & Content Management Guide',
                bold: true,
                size: 40, // 20pt
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
                size: 22
              }),
              new TextRun({
                text: 'Dedicated Admin Tools & Outstatic CMS',
                bold: true,
                color: 'D97706',
                size: 22
              })
            ]
          }),

          // Fast Track Callout Box
          createCalloutBox(
            '⚡ Fast Track: Which Tool to Use?',
            [
              '• To Upload or Update PDF Menus: Use the Menu Manager (https://theshipinnporlockweir.co.uk/admin/menus)',
              '• To Add or Remove Gallery Photos: Use the Gallery Manager (https://theshipinnporlockweir.co.uk/admin/gallery)',
              '• To Edit Page Text, Hours, Contact Info, News, or Events: Use Outstatic CMS (https://theshipinnporlockweir.co.uk/outstatic)'
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
            '3. Enter the Season / Subtitle (e.g. "Autumn 2026" or "Served 12:00 PM – 3:00 PM").',
            '4. Click "Browse PDF file" and choose your .pdf file.',
            '5. Click "Upload & Publish Menu". The live website and Outstatic update automatically in 1–2 minutes!'
          ]),

          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({ text: '1.2 Gallery Manager & Photo Uploader', bold: true, size: 24, color: '1E3A8A' })
            ]
          }),
          new Paragraph({
            text: 'Use this dedicated tool to upload new photos to the gallery without having to manually copy file links:'
          }),
          createStepBox([
            '1. Open your browser and go to: https://theshipinnporlockweir.co.uk/admin/gallery',
            '2. Choose your upload mode:',
            '   • Single Photo Upload: Add an individual photo with a custom title and caption.',
            '   • Batch Upload: Upload 3–10 photos at once into a chosen category.',
            '3. Click the matching category button (Food & Drink, Interior & Bar, Exterior & Garden, Rooms & Cabins, Surroundings, or Custom).',
            '4. Click "Browse Image" to select your photo (.webp, .jpg, .png, .avif) and verify the instant preview thumbnail.',
            '5. Enter a descriptive Photo Title and optional Caption.',
            '6. Click "Upload & Publish Image". The photo goes live immediately and syncs with Outstatic CMS!'
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
          createBullet('Pages — Controls text and banners on core website pages (Home, Food & Drink, Contact, Rooms, etc.).'),
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
              ['Wide banner photo at the top', 'Cover Image (click to choose from Media Library)'],
              ['Left column introductory text', 'Food & Drink Intro Para One'],
              ['Lagers, Ciders, Ales beer lists', 'Lagers List, Ciders List, Ales List'],
              ['Breakfast serving details', 'Breakfast Description & Times'],
              ['Downloadable PDF Menus', 'Managed via https://theshipinnporlockweir.co.uk/admin/menus']
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

          // Section 6: Events and News
          createHeading('6. How to Add a New Event or News Article'),
          createStepBox([
            '1. Click Events or News in the left sidebar of Outstatic.',
            '2. Click the black "New" button in the top right.',
            '3. In the centre screen: Type your headline in the Title box and write your story or event description below it.',
            '4. In the right sidebar: Select the Date, upload a Cover Image, and enter a short Description.',
            '5. Set Status to "Published" and click Save.'
          ]),

          // Section 7: Quick Summary Table
          createHeading('7. Summary: Which Tool Should I Use?'),
          createTable(
            ['Task', 'Recommended Tool', 'Web Link'],
            [
              ['Upload a new PDF food menu', 'Menu Manager', 'https://theshipinnporlockweir.co.uk/admin/menus'],
              ['Add new photos to the gallery', 'Gallery Manager', 'https://theshipinnporlockweir.co.uk/admin/gallery'],
              ['Temporarily hide a menu or photo', 'Outstatic (Switch to Draft)', 'https://theshipinnporlockweir.co.uk/outstatic'],
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
                text: 'Manual Version 2.0 — Updated 23 September 2026',
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

  const filename = 'The-Ship-Inn-CMS-User-Manual.docx'
  fs.writeFileSync(path.join(docsDir, filename), buffer)
  fs.writeFileSync(path.join(publicDocsDir, filename), buffer)

  console.log('Successfully regenerated Word Document (.docx) at docs/ and public/docs/')
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
                children: [
                  new TextRun({ text: l, size: 21, color: '1E3A8A' })
                ]
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
