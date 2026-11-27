import fs from 'fs'
import path from 'path'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
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

const BRAND_NAVY = '0A192F'
const BRAND_AMBER = 'D97706'
const BRAND_GOLD = 'B45309'
const BRAND_BLUE = '1E3A8A'
const TEXT_DARK = '1E293B'
const TEXT_MUTED = '64748B'
const BG_LIGHT = 'F8FAFC'
const BORDER_COLOR = 'CBD5E1'

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 150 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32,
        color: BRAND_NAVY,
        font: 'Georgia'
      })
    ]
  })
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26,
        color: BRAND_GOLD,
        font: 'Georgia'
      })
    ]
  })
}

function createHeading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22,
        color: BRAND_NAVY,
        font: 'Arial'
      })
    ]
  })
}

function createParagraph(text, options = {}) {
  const { bold = false, italic = false, color = TEXT_DARK, size = 21, spaceAfter = 140 } = options
  return new Paragraph({
    spacing: { after: spaceAfter, line: 280 },
    children: [
      new TextRun({
        text,
        bold,
        italics: italic,
        color,
        size,
        font: 'Arial'
      })
    ]
  })
}

function createBullet(title, description) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 100, line: 260 },
    children: [
      new TextRun({
        text: `${title}: `,
        bold: true,
        color: BRAND_NAVY,
        size: 21,
        font: 'Arial'
      }),
      new TextRun({
        text: description,
        color: TEXT_DARK,
        size: 21,
        font: 'Arial'
      })
    ]
  })
}

function createLinkParagraph(label, url) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        color: BRAND_NAVY,
        size: 21,
        font: 'Arial'
      }),
      new ExternalHyperlink({
        link: url,
        children: [
          new TextRun({
            text: url,
            color: '2563EB',
            underline: {},
            bold: true,
            size: 21,
            font: 'Arial'
          })
        ]
      })
    ]
  })
}

function createCalloutBox(title, body) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      left: { style: BorderStyle.SINGLE, size: 24, color: BRAND_AMBER }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: 'FEF3C7', type: ShadingType.CLEAR },
            margins: { top: 160, bottom: 160, left: 240, right: 200 },
            children: [
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: `💡 ${title}`,
                    bold: true,
                    color: BRAND_GOLD,
                    size: 22,
                    font: 'Georgia'
                  })
                ]
              }),
              new Paragraph({
                spacing: { after: 0, line: 260 },
                children: [
                  new TextRun({
                    text: body,
                    color: TEXT_DARK,
                    size: 20,
                    font: 'Arial'
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  })
}

function createDataTable(headers, rows) {
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: headers.map((h) => (
        new TableCell({
          shading: { fill: BRAND_NAVY, type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 160, right: 160 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: h,
                  bold: true,
                  color: 'FFFFFF',
                  size: 20,
                  font: 'Arial'
                })
              ]
            })
          ]
        })
      ))
    }),
    ...rows.map((row, rIdx) => (
      new TableRow({
        children: row.map((cellText) => (
          new TableCell({
            shading: { fill: rIdx % 2 === 0 ? 'FFFFFF' : BG_LIGHT, type: ShadingType.CLEAR },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
              left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
              right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR }
            },
            margins: { top: 100, bottom: 100, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: cellText,
                    color: TEXT_DARK,
                    size: 19,
                    font: 'Arial'
                  })
                ]
              })
            ]
          })
        ))
      })
    ))
  ]

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  })
}

async function buildReport() {
  const doc = new Document({
    creator: 'Antigravity Studio',
    title: 'ShipWreck Music Festival — Digital Showcase, Video Integration & Lineup Engine Report',
    description: 'Comprehensive report on the ShipWreck Music Festival demo, video bumpers, dedicated band post publisher, sample audio player, and commercial recommendations.',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
          }
        },
        children: [
          // Title Banner
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'The Ship Inn • Porlock Weir',
                bold: true,
                color: BRAND_AMBER,
                size: 24,
                font: 'Georgia'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'ShipWreck Music Festival Showcase',
                bold: true,
                color: BRAND_NAVY,
                size: 38,
                font: 'Georgia'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'Digital Promotion, Video Integration & Dedicated Band Lineup Engine Report',
                italics: true,
                color: TEXT_MUTED,
                size: 24,
                font: 'Georgia'
              })
            ]
          }),

          // Metadata Strip
          createDataTable(
            ['Project Component', 'Details'],
            [
              ['Client / Venue', 'The Ship Inn, Porlock Weir, Somerset (TA24 8PB)'],
              ['Feature Title', 'ShipWreck Music Festival Digital Hub & Dedicated Lineup Engine'],
              ['Festival Dates', 'Friday 4th – Sunday 6th June 2027'],
              ['Staged URL', 'https://www.theshipinnporlockweir.co.uk/demo-shipwreck-7924'],
              ['Dynamic Live PDF Timetable', '/api/demo-shipwreck/pdf (Generated on-demand from live database)'],
              ['Staff Publishing Tool', 'https://www.theshipinnporlockweir.co.uk/staff (Direct Shortcut: 🎸 ShipWreck)'],
              ['Dedicated API Feed', '/api/demo-shipwreck (Edge Blob Storage + JSON Backup)'],
              ['Report Date', 'November 2026'],
              ['Deployment Status', 'Production Build Verified & Deployed on Vercel (Commit 11958a84)']
            ]
          ),

          new Paragraph({ spacing: { before: 240 } }),

          // Executive Summary
          createHeading1('1. Executive Summary'),
          createParagraph(
            'This report details the newly developed digital hub and lineup management engine for the ShipWreck Music Festival at The Ship Inn, Porlock Weir. Using the newly produced promotional video (Ship_Wreck_with_Logo.mp4) as the centerpiece, this solution provides a dedicated, highly engaging festival experience without polluting or confusing the pub’s day-to-day dining, rooms, and regular news feed.'
          ),
          createParagraph(
            'The implementation includes an interactive hero video player with side-by-side intro comparison, a dedicated "Create Band Post" tool that updates only the festival schedule, an inline sample audio player allowing visitors to listen to band tracks on the page, and social links engineered to open strictly in new tabs.'
          ),

          createCalloutBox(
            'Core Principle: Total Channel Separation',
            'Staff can publish band announcements and set times in under 60 seconds from their mobile phones. Crucially, these posts are targeted exclusively to the ShipWreck Festival page, preserving the elegance and clarity of the main pub website.'
          ),

          new Paragraph({ spacing: { before: 200 } }),

          // Video Assets & Implementations
          createHeading1('2. Promotional Video Assets & Cinematic Hero'),
          createParagraph(
            'The festival hub features a high-impact, widescreen video hero player designed to capture visitor attention immediately and evoke the maritime festival atmosphere.'
          ),
          createHeading2('Available Video Variants'),
          createBullet(
            'Standard Logo Intro (Ship_Wreck_with_Logo.mp4)',
            'Presents the authentic hand-drawn Ship Inn crest on a deep nautical night canvas for 1.75 seconds before dissolving into the vibrant festival fireworks and ribbon animations with the music track.'
          ),
          createBullet(
            'Sailing Boat Intro (Ship_Wreck_Sailing_Boat.mp4)',
            'Features the historical hand-drawn galleon sailing serenely across dark ocean waters with natural swells, gentle pitch rocking, and "THE SHIP INN AT PORLOCK WEIR" fading in beneath, followed by a majestic 1.0-second dissolve into the festival.'
          ),
          createBullet(
            'Side-by-Side Video Switcher',
            'An interactive control bar right inside the video frame allows the client and stakeholders to toggle instantly between the Standard Logo and Sailing Boat versions to evaluate visitor response.'
          ),
          createBullet(
            'Interactive Audio Control',
            'Videos autoplay muted to satisfy modern browser and mobile policies, with an instant "Unmute Festival Music" button so visitors can experience the audio whenever they choose.'
          ),

          new Paragraph({ spacing: { before: 200 } }),

          // Dedicated Band Lineup Engine
          createHeading1('3. Dedicated "Create Band Post" Engine'),
          createParagraph(
            'A key requirement was ensuring that staff could announce new bands, set times, and artist updates without altering the pub’s general news, dining specials, or room notices. This was solved through an isolated festival publishing pipeline.'
          ),
          createHeading2('Dedicated Publishing Workflow'),
          createBullet(
            'Dual Access Points',
            'Management and bar staff can create posts via the "+ Create Band Post" button directly on the demo page or via the 🎸 ShipWreck shortcut inside the Staff Mobile PWA (/staff).'
          ),
          createBullet(
            'Band Metadata Capture',
            'Captures Artist Name, Headline Act status, Musical Genre, Festival Day (Friday/Saturday/Sunday), Stage, Time Slot, and Performance Highlights.'
          ),
          createBullet(
            'Client-Side Image Compression',
            'Staff can upload band flyers or photos directly from camera rolls; the system optimizes and compresses images to under 300KB in the browser before upload, ensuring lightning-fast mobile loading.'
          ),
          createBullet(
            'Sample Audio Attachment',
            'Supports direct links to .mp3 preview clips, allowing artists or staff to provide 30-second audio snippets for immediate playback.'
          ),
          createBullet(
            'Social Media Links (New Window Only)',
            'Fields for Spotify, Instagram, Facebook, YouTube, and Website. All external links are strictly encoded with target="_blank" and rel="noopener noreferrer" so visitors never lose their place on the festival website.'
          ),

          new Paragraph({ spacing: { before: 200 } }),

          // Public Showcase & Audio Player
          createHeading1('4. Public Visitor Experience & Audio Showcase'),
          createParagraph(
            'The public display is engineered to maximize guest engagement, drive table bookings, and build excitement for the festival weekend.'
          ),
          createHeading2('Key Interactive Features'),
          createDataTable(
            ['Feature', 'Visitor Experience', 'Business Value'],
            [
              ['Day Filter Pills', 'Quickly switch between Friday, Saturday, Sunday, or All Days', 'Helps guests plan accommodation and dinner bookings'],
              ['Stage Filter Chips', 'Filter by The Quay Stage, Fireside Saloon, or Harbour Lawn', 'Promotes the distinct atmospheres of indoor & outdoor stages'],
              ['Inline Audio Player', 'Instant play/pause sample track with animated equalizer', 'Engages visitors with real music without leaving the site'],
              ['Social Hub Icons', 'Spotify, Instagram, Facebook, and YouTube links', 'Builds credibility while keeping the visitor on The Ship Inn site'],
              ['Direct CTA Buttons', '"Reserve Quayside Table for Set" linking to booking', 'Directly converts music interest into high-margin food & beverage revenue']
            ]
          ),

          new Paragraph({ spacing: { before: 200 } }),

          // Festival Guide & Harbour Context
          createHeading1('5. Festival Atmosphere & Hospitality Guide'),
          createParagraph(
            'The page highlights the broader festival experience at Porlock Weir, establishing The Ship Inn as the focal point of the weekend:'
          ),
          createBullet(
            'The Three Stages',
            'The Quay Stage (headline festival acts under the cliffs), Fireside Saloon Sessions (candlelit acoustic folk and fiddle by the 15th-century hearth), and Harbour Lawn (afternoon cider sessions).'
          ),
          createBullet(
            'Craft Ales & Farm Ciders',
            'Showcasing 16+ guest real ales from Exmoor and Devon alongside traditional West Country farmhouse scrumpies.'
          ),
          createBullet(
            'Quayside BBQ & Porlock Bay Oysters',
            'Fresh seafood, whole spit-roasted Exmoor lamb, and quayside dining served along the seawall.'
          ),
          createBullet(
            'High Tide Evening Sessions',
            'Emphasizing the magical atmosphere when the sea fills the harbour basin at twilight and the music kicks off by maritime torchlight.'
          ),

          new Paragraph({ spacing: { before: 200 } }),

          // Technical Architecture & Verification
          createHeading1('6. Technical Architecture & Verification'),
          createParagraph(
            'The system adheres to modern web standards, security best practices, and zero-maintenance architecture:'
          ),
          createDataTable(
            ['System Layer', 'Technology & Architecture', 'Performance Benefit'],
            [
              ['Framework', 'Next.js 16.1.6 (App Router + Turbopack)', 'Instant server rendering and edge performance'],
              ['Data Persistence', 'Vercel Blob Edge Storage + Local JSON Backup', 'Zero Vercel build minutes consumed; updates appear instantly'],
              ['Media Optimization', 'Next/Image, Sharp WebP/AVIF & H.264 MP4', 'High visual fidelity with low data consumption for mobile users'],
              ['Security', 'Robots: noindex/nofollow on staging; strict rel="noopener"', 'Prevents premature SEO indexing and external link exploits'],
              ['Build Status', 'Zero TypeScript / Build Errors (Exited Code 0)', 'Production-grade code ready for immediate client demonstration']
            ]
          ),

          new Paragraph({ spacing: { before: 200 } }),

          // Recommendations & Go-Live Roadmap
          createHeading1('7. Recommended Next Steps for Pub Management'),
          createParagraph(
            'To prepare for the official launch of the ShipWreck Music Festival campaign, the following steps are recommended:'
          ),
          createBullet(
            'Step 1: Stakeholder Review',
            'Share the staged link (https://www.theshipinnporlockweir.co.uk/demo-shipwreck-7924) with pub proprietors and festival organizers to confirm the band lineup format and stage names.'
          ),
          createBullet(
            'Step 2: Collect Artist Assets',
            'Gather official photos, social links, and 30-second audio preview clips from confirmed headline acts (e.g. The Longest Johns, Blackbeard\'s Tea Party).'
          ),
          createBullet(
            'Step 3: Staff Training (5 Minutes)',
            'Demonstrate the "+ Create Band Post" workflow on a mobile phone to bar staff so they feel confident announcing surprise acts or schedule adjustments during festival weekend.'
          ),
          createBullet(
            'Step 4: Public Go-Live',
            'Promote the route from /demo-shipwreck-7924 to the permanent public URL /shipwreck and add a prominent "ShipWreck Festival" badge to the main navigation and homepage banner.'
          )
        ]
      }
    ]
  })

  const buffer = await Packer.toBuffer(doc)
  const outputPath = path.join(
    process.cwd(),
    'public',
    'docs',
    'ShipWreck_Music_Festival_Digital_Showcase_Report.docx'
  )
  const brainPath =
    'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/ShipWreck_Music_Festival_Digital_Showcase_Report.docx'

  fs.writeFileSync(outputPath, buffer)
  fs.writeFileSync(brainPath, buffer)

  console.log('Report generated successfully at:')
  console.log('1.', outputPath)
  console.log('2.', brainPath)
}

buildReport().catch((err) => {
  console.error('Error generating report:', err)
  process.exit(1)
})
