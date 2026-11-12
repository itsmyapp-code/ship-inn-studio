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

function createCalloutBox(title, lines, borderColor = 'D97706', bgColor = 'FFFBEB') {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 12, color: borderColor },
      bottom: { style: BorderStyle.SINGLE, size: 12, color: borderColor },
      left: { style: BorderStyle.SINGLE, size: 36, color: borderColor },
      right: { style: BorderStyle.SINGLE, size: 12, color: borderColor }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: bgColor, type: ShadingType.CLEAR },
            margins: { top: 160, bottom: 160, left: 240, right: 240 },
            children: [
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 22,
                    color: '92400E'
                  })
                ]
              }),
              ...lines.map((l) =>
                new Paragraph({
                  spacing: { after: 40 },
                  children: createLinkedRuns(l, '78350F', 20, false)
                })
              )
            ]
          })
        ]
      })
    ]
  })
}

function createStepBox(steps) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 24, color: '1E3A8A' },
      right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
            children: steps.map((s, idx) =>
              new Paragraph({
                spacing: { after: idx === steps.length - 1 ? 0 : 70 },
                children: createLinkedRuns(s, '1E293B', 20, false)
              })
            )
          })
        ]
      })
    ]
  })
}

function createTable(headers, rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' }
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h) =>
          new TableCell({
            shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
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
          })
        )
      }),
      ...rows.map((row, rIdx) =>
        new TableRow({
          children: row.map((cellText) =>
            new TableCell({
              shading: {
                fill: rIdx % 2 === 0 ? 'FFFFFF' : 'F8FAFC',
                type: ShadingType.CLEAR
              },
              margins: { top: 100, bottom: 100, left: 160, right: 160 },
              children: [
                new Paragraph({
                  children: createLinkedRuns(cellText, '334155', 20, false)
                })
              ]
            })
          )
        })
      )
    ]
  })
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
            size: 22,
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
          // Logo & Header
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
                size: 34,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 280 },
            children: [
              new TextRun({
                text: 'System: ',
                bold: true,
                size: 21
              }),
              new TextRun({
                text: 'Dedicated Staff Mobile App (PWA), Video & Reel Hosting, Fast Admin Tools | Version 4.1 (12 November 2026)',
                bold: true,
                color: 'D97706',
                size: 21
              })
            ]
          }),

          // Fast Track Box (No Outstatic references)
          createCalloutBox(
            '⚡ Fast Track: Which Tool to Use?',
            [
              '• To Post Events, Gigs, Blackboard Specials, or Videos: Use the Staff Mobile App — https://theshipinnporlockweir.co.uk/staff (PIN: 1572)',
              '• To Upload or Update PDF Food & Drink Menus: Use the Menu Manager — https://theshipinnporlockweir.co.uk/admin/menus',
              '• To Add or Delete Photo Gallery Images: Use the Gallery Manager — https://theshipinnporlockweir.co.uk/admin/gallery',
              '• To Manage Customer Reviews & Testimonials: Use the Testimonials Manager — https://theshipinnporlockweir.co.uk/admin/testimonials'
            ]
          ),

          new Paragraph({ spacing: { before: 280, after: 120 } }),

          // Section 1: Staff Mobile App & POSH Video Publisher
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '1. Staff Mobile App & Social Video Publisher (/staff)',
                bold: true,
                size: 28,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'Pub staff can now post upcoming gigs, blackboard dinner specials, weather notices, and phone video clips in under 60 seconds directly from their phone—no passwords, no desktop computer, and no complex CMS logins required.'
              })
            ]
          }),
          createStepBox([
            '1. Open Safari (iPhone) or Chrome (Android) and go to: https://theshipinnporlockweir.co.uk/staff',
            '2. Add to Home Screen (Optional but Recommended): Tap the Share button in Safari and tap "Add to Home Screen" to install The Ship Inn app icon directly on your phone.',
            '3. Enter Staff PIN: Enter the 4-digit pub passcode 1572 (or 7924) to unlock the publisher.',
            '4. Choose What You Are Posting:',
            '   • 📅 Scheduled Event: For live music, quiz nights, holiday feasts (requires date, time, and optional table booking prompt).',
            '   • 📰 Pub News / Special: For daily chalkboard specials, seasonal ale taps, local seafood catch, or harbour weather updates.',
            '5. Enter Headline & Description: Type a punchy title and optional short summary.',
            '6. Choose Media (Direct Camera Roll or Social Link):',
            '   • 🎥 Phone Camera Roll Video: Select any MP4 or MOV clip straight from your phone camera roll. The studio automatically extracts a crisp video frame thumbnail for your Facebook/WhatsApp preview card! Keep "Silent Video Mode" switched ON for ambient website looping with zero copyright audio blocks.',
            '   • 🖼️ Photo / Flyer: Pick an event poster or food photo. It automatically optimizes and compresses in your phone browser in 0.5 seconds.',
            '   • 🔗 Social Link: Paste a public Facebook Reel, Instagram Reel, or YouTube Shorts link.',
            '7. Attach PDF Menu or Flyer (Optional): Tap "Choose PDF Document" to attach seasonal food menus, Christmas menus, or wine lists directly to the post.',
            '8. Button Link to Website (Optional CTA): Choose a high-converting button link ("Reserve Table", "Festive & Christmas", "View Rooms & Stay", "Explore Food & Drink", or Custom).',
            '9. Check the Live Social Card Preview: Right above the publish button, view the live preview of what followers will see on Facebook, Instagram, and WhatsApp.',
            '10. Click "Publish to The Ship Inn (1-Click)": Your post goes live immediately with zero build wait time and £0 in build costs (stored directly on Vercel Edge storage).',
            '11. One-Tap Social Syndication:',
            '   • "Copy Facebook Post (with Menu & CTA)": Copies a pre-formatted post with headline, description, video link, and direct links to the menu and reservations. Just open Facebook and tap Paste!',
            '   • "Copy Link Only": Copies just the direct post URL.',
            '   • "Test in Facebook Debugger": Opens Meta\'s official tool to verify how Facebook renders the card without posting publicly.'
          ]),

          new Paragraph({ spacing: { before: 280, after: 120 } }),

          // Section 2: Menu Manager
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '2. Menu Manager & PDF Uploader (/admin/menus)',
                bold: true,
                size: 28,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'Use this dedicated tool whenever you have a new season or updated food and drink PDF menu:'
              })
            ]
          }),
          createStepBox([
            '1. Open your browser and go to: https://theshipinnporlockweir.co.uk/admin/menus',
            '2. Click the menu you want to update (Breakfast Menu, Lunch Menu, Evening Menu, Sunday Lunch Menu, or Custom Menu).',
            '3. Enter the Season / Subtitle (e.g. "Autumn/Winter 2026" or "Served 12:00 PM – 3:00 PM").',
            '4. Click "Browse PDF file" and choose your new .pdf document from your computer or phone.',
            '5. Click "Upload & Publish Menu". The live website updates automatically within 1–2 minutes!'
          ]),

          new Paragraph({ spacing: { before: 280, after: 120 } }),

          // Section 3: Gallery Manager
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '3. Gallery Manager & Photo Uploader (/admin/gallery)',
                bold: true,
                size: 28,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'Use this dedicated tool to upload new photos to the gallery or delete old ones without having to manually resize images or copy file links:'
              })
            ]
          }),
          createStepBox([
            '1. Open your browser and go to: https://theshipinnporlockweir.co.uk/admin/gallery',
            '2. Choose your upload mode:',
            '   • Single Photo Upload: Add an individual photo with a custom title and caption.',
            '   • Batch Upload: Upload 3–10+ photos at once into a chosen category.',
            '3. Click the matching category button (Food & Drink, Interior & Bar, Exterior & Garden, Rooms & Cabins, Surroundings & Exmoor, or Custom).',
            '4. Click "Browse Image" to select your photo (.jpg, .jpeg, .png, .webp, .avif, .jfif, .gif up to 20MB) and verify the instant preview thumbnail.',
            '5. Enter a descriptive Photo Title / Alt Text and optional Caption.',
            '6. Click "Upload & Publish Image". Your photo is automatically converted into both ultra-fast .avif and .webp formats and published immediately!',
            '7. Deleting Existing Photos: Scroll down to the "Current Gallery Photos" section at the bottom of /admin/gallery to filter by category and click "Delete" on any photo to remove it instantly.'
          ]),

          new Paragraph({ spacing: { before: 280, after: 120 } }),

          // Section 4: Testimonials Manager
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '4. Testimonials & Customer Reviews Manager (/admin/testimonials)',
                bold: true,
                size: 28,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'Use this dedicated tool to approve customer submissions from the website, manually transcribe reviews from Google or TripAdvisor, and manage what reviews appear on the homepage:'
              })
            ]
          }),
          createStepBox([
            '1. Open your browser and go to: https://theshipinnporlockweir.co.uk/admin/testimonials',
            '2. Enter Admin Passcode: When prompted, enter the pub passcode theshipinnta248pb! to unlock the manager.',
            '3. Live Stats & Tabs: The dashboard displays live counts (Total Reviews, Average Star Rating, Pending Approvals, Published Reviews) and tabbed filters (All, Pending, Published, Archived).',
            '4. Approving Guest Submissions: When guests leave a review via the website review form (/review), it lands in "Pending" status. Click the green "Approve & Publish" button to immediately make it live on the homepage.',
            '5. Manually Adding Reviews: Click the "+ Add Review Manually" button in the header. Enter the guest\'s name, rating (1–5 stars), visit date, source (Google, TripAdvisor, In Person / Guestbook, or Direct), review text, and optional verified stay badge. Click "Save & Publish".',
            '6. Editing, Archiving & Deleting: Click "Edit" on any review card to update wording or rating. Click "Archive" to remove a review from the homepage without permanently deleting it, or click "Delete" to remove it permanently.'
          ]),

          new Paragraph({ spacing: { before: 280, after: 120 } }),

          // Section 5: The "POSH" Rule (Publish on Site, Share to Social)
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '5. The POSH Strategy (How to Avoid Copyright Music Blocks)',
                bold: true,
                size: 28,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'Meta (Facebook & Instagram) enforces strict music copyright licenses. If staff make a Reel inside the Facebook app and attach commercial pop songs (Sony, Universal, Warner), Meta blocks the video from playing on external websites, displaying "Video unavailable".'
              })
            ]
          }),
          createCalloutBox(
            '⭐ The Golden POSH Rule: Always Publish on Site First!',
            [
              '1. Film on Phone Camera: Record 10–30 seconds of high quality video (pouring an Exmoor ale, carving roast beef, roaring fireplace, sea waves hitting the weir).',
              '2. Upload to The Ship Inn Website First: Open https://theshipinnporlockweir.co.uk/staff, choose the video, leave "Silent Video Mode" switched ON, and hit Publish.',
              '3. Share to Social Media Afterwards: Now post that same video to your Facebook and Instagram channels with whatever background music or stickers you want for your social followers!',
              'Result: The pub website gets a crisp, lightning-fast video loop with 0% risk of copyright takedowns, while your social channels still get full engagement.'
            ],
            '2563EB',
            'EFF6FF'
          ),

          new Paragraph({ spacing: { before: 280, after: 120 } }),

          // Section 6: Image Optimization
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '6. Automatic Image & Video Optimization — Zero Effort Required',
                bold: true,
                size: 28,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'You never need Photoshop, image conversion apps, or video compressors before uploading:'
              })
            ]
          }),
          createStepBox([
            '• Photo Optimization: Every image uploaded through /staff or /admin/gallery is automatically resized and converted to modern WebP and AVIF formats (reducing file size by up to 85% with zero quality loss).',
            '• Video Streaming: Videos uploaded through /staff are processed and served through high-speed edge CDN storage for smooth mobile playback without buffering.',
            '• Uncropped Flyer Display: The website uses an intelligent adaptive display container. Whether your event flyer is circular, square (1:1), portrait poster (4:5), or landscape (16:9), 100% of the poster and event text is visible with no cropping.'
          ]),

          new Paragraph({ spacing: { before: 280, after: 120 } }),

          // Section 7: Summary Table
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '7. Summary: Which Tool Should I Use?',
                bold: true,
                size: 28,
                color: '1E3A8A'
              })
            ]
          }),
          createTable(
            ['Task', 'Recommended Tool', 'Direct Link'],
            [
              [
                'Post an upcoming gig, quiz, or event',
                'Staff Mobile App (/staff)',
                'https://theshipinnporlockweir.co.uk/staff'
              ],
              [
                'Post a daily special or harbour update',
                'Staff Mobile App (/staff)',
                'https://theshipinnporlockweir.co.uk/staff'
              ],
              [
                'Upload a short video or social Reel',
                'Staff Mobile App (/staff)',
                'https://theshipinnporlockweir.co.uk/staff'
              ],
              [
                'Upload a new PDF food/drinks menu',
                'Menu Manager',
                'https://theshipinnporlockweir.co.uk/admin/menus'
              ],
              [
                'Add or delete photo gallery images',
                'Gallery Manager',
                'https://theshipinnporlockweir.co.uk/admin/gallery'
              ],
              [
                'Approve customer reviews from website',
                'Testimonials Manager',
                'https://theshipinnporlockweir.co.uk/admin/testimonials'
              ],
              [
                'Add Google or TripAdvisor reviews',
                'Testimonials Manager',
                'https://theshipinnporlockweir.co.uk/admin/testimonials'
              ]
            ]
          ),

          new Paragraph({ spacing: { before: 360, after: 120 } }),

          // Footer Branding
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new ImageRun({
                data: itsmyappLogoPng,
                transformation: { width: 110, height: 35 },
                type: 'png'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 0 },
            children: [
              new TextRun({
                text: 'The Ship Inn, Porlock Weir — TA24 8PB | Website & CMS Managed by itsmyapp (https://itsmyapp.co.uk)',
                size: 18,
                color: '64748B'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Manual Version 4.1 • Updated 12 November 2026',
                size: 18,
                bold: true,
                color: '64748B'
              })
            ]
          })
        ]
      }
    ]
  })

  const buffer = await Packer.toBuffer(doc)
  const paths = [
    path.join(process.cwd(), 'public', 'docs', 'The-Ship-Inn-Website-Management-Guide-20261111-Updated.docx'),
    path.join(process.cwd(), 'public', 'docs', 'The-Ship-Inn-Website-Management-Guide.docx'),
    path.join(process.cwd(), 'docs', 'The-Ship-Inn-Website-Management-Guide.docx')
  ]

  for (const p of paths) {
    fs.writeFileSync(p, buffer)
    console.log('Successfully created:', p)
  }
}

generateDocx().catch((err) => {
  console.error('Error generating document:', err)
  process.exit(1)
})

