import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType
} from 'docx'

async function generateInvoice() {
  const rootDir = process.cwd()

  // Load logos
  let itsmyappLogoPng = null
  let shipLogoPng = null

  try {
    itsmyappLogoPng = await sharp(path.join(rootDir, 'public', 'images', 'itsmyapp_logo.webp'))
      .resize(160, 50, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer()
  } catch (e) {
    console.warn('Could not load itsmyapp logo:', e.message)
  }

  try {
    shipLogoPng = await sharp(path.join(rootDir, 'public', 'images', 'the_ship_inn2.webp'))
      .resize(120, 120, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer()
  } catch (e) {
    console.warn('Could not load ship logo:', e.message)
  }

  const borderNone = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  const borderLight = { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' }
  const borderNavy = { style: BorderStyle.SINGLE, size: 10, color: '1E3A8A' }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Segoe UI',
            size: 21, // ~10.5pt
            color: '334155'
          },
          paragraph: {
            spacing: {
              after: 120,
              line: 260
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
              top: 1000,
              bottom: 1000,
              left: 1200,
              right: 1200
            }
          }
        },
        children: [
          // Top Header: Service Provider Info & Invoice Title
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: borderNone,
              bottom: borderNavy,
              left: borderNone,
              right: borderNone,
              insideHorizontal: borderNone,
              insideVertical: borderNone
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    children: [
                      ...(itsmyappLogoPng
                        ? [
                            new Paragraph({
                              children: [
                                new ImageRun({
                                  data: itsmyappLogoPng,
                                  transformation: { width: 140, height: 44 }
                                })
                              ],
                              spacing: { after: 100 }
                            })
                          ]
                        : []),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'itsmyapp.co.uk', bold: true, size: 24, color: '1E3A8A' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: '14 Norton Park, Norton, Dartmouth, Devon TQ6 0NH', color: '64748B', size: 19 })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Tel: 07791 043227  |  Email: hello@itsmyapp.co.uk', color: '64748B', size: 19 })
                        ],
                        spacing: { after: 200 }
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'INVOICE', bold: true, size: 40, color: '1E3A8A' })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'Invoice No: ', bold: true, size: 20, color: '1E3A8A' }),
                          new TextRun({ text: 'INV-20261120-01', bold: true, size: 20, color: '0F172A' })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'Invoice Date: ', bold: true, size: 19, color: '64748B' }),
                          new TextRun({ text: '20 November 2026', size: 19, color: '334155' })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'Payment Due: ', bold: true, size: 19, color: '64748B' }),
                          new TextRun({ text: 'Due on Receipt (By Return)', bold: true, size: 19, color: 'B91C1C' })
                        ],
                        spacing: { after: 200 }
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 180 } }),

          // Bill To & Account Details Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: borderLight,
              bottom: borderLight,
              left: borderLight,
              right: borderLight,
              insideHorizontal: borderNone,
              insideVertical: borderNone
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 55, type: WidthType.PERCENTAGE },
                    shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
                    margins: { top: 140, bottom: 140, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'INVOICE TO:', bold: true, size: 20, color: '1E3A8A' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'The Ship Inn Porlock Weir', bold: true, size: 22, color: '0F172A' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Porlock Weir, Minehead, Somerset, TA24 8PB', size: 19, color: '475569' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Target: www.theshipinnporlockweir.co.uk', size: 19, color: '475569' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 45, type: WidthType.PERCENTAGE },
                    shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
                    margins: { top: 140, bottom: 140, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'CONTRACT & RATE BASIS:', bold: true, size: 20, color: '1E3A8A' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Contracted Rate: ', bold: true, size: 19, color: '475569' }),
                          new TextRun({ text: '£35.00 per hour', size: 19, color: '0F172A', bold: true })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Proposal Reference: ', bold: true, size: 19, color: '475569' }),
                          new TextRun({ text: 'Website Enhancement Proposal (Nov 2026)', size: 18, color: '475569' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Scope Billed: ', bold: true, size: 19, color: '475569' }),
                          new TextRun({ text: 'Live Production Deliverables Only', size: 19, color: '047857', bold: true })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // Heading: Itemized Schedule of Work Made Live
          new Paragraph({
            children: [
              new TextRun({
                text: 'Itemized Schedule of Live Deliverables',
                bold: true,
                size: 24,
                color: '1E3A8A'
              })
            ],
            spacing: { after: 60 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'As per the Website Enhancement Pricing Proposal, only the features and assets commissioned, completed, and published live to production are billed below:',
                size: 19,
                color: '64748B',
                italics: true
              })
            ],
            spacing: { after: 140 }
          }),

          // Line Items Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: borderNavy,
              bottom: borderNavy,
              left: borderLight,
              right: borderLight,
              insideHorizontal: borderLight,
              insideVertical: borderLight
            },
            rows: [
              // Header Row
              new TableRow({
                shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
                children: [
                  new TableCell({
                    width: { size: 28, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Deliverable / Workstream', bold: true, color: 'FFFFFF', size: 20 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 46, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Technical Scope & Live Implementation', bold: true, color: 'FFFFFF', size: 20 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 12, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'Hours', bold: true, color: 'FFFFFF', size: 20 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 14, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'Amount', bold: true, color: 'FFFFFF', size: 20 })
                        ]
                      })
                    ]
                  })
                ]
              }),

              // Line Item 1: Christmas Launch
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 28, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: '1. Christmas Launch', bold: true, size: 20, color: '0F172A' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Live Campaign & Dining Hub', size: 17, color: '64748B', italics: true })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 46, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: '• Promoted private preview to live production route (/christmas) with full OpenGraph/SEO metadata.\n' +
                                  '• Connected pulsing hero carousel CTA button on live Homepage.\n' +
                                  '• Built warm coastal festive showcase with glowing badge and pre-filled email booking engine.\n' +
                                  '• Santa video integration: real 78KB poster preview, 2.8s hold frame, loop controls, un-mute toggle, and analytics telemetry.\n' +
                                  '• Wired Vercel Analytics event tracking across all festive CTAs and video interactions.',
                            size: 18,
                            color: '334155'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 12, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: '2.5 hrs', size: 19, color: '334155' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 14, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: '£87.50', bold: true, size: 20, color: '0F172A' })
                        ]
                      })
                    ]
                  })
                ]
              }),

              // Line Item 2: Menu PDF Refresh
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 28, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: '2. Menu PDF Refresh', bold: true, size: 20, color: '0F172A' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Seasonal Menus & Content Audit', size: 17, color: '64748B', italics: true })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 46, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: '• Cleaned all outdated "Sept 2026" date labels and obsolete static links across Outstatic CMS and /food-drink page; standardized buttons to canonical "PDF MENU".\n' +
                                  '• Completely removed retired Summer BBQ / Saturday Braai promo banner, photo grid, and outdated news article.\n' +
                                  '• Designed, formatted and compiled uncropped high-resolution printable A4 Festive Menu PDF (The-Ship-Inn-Festive-Menu.pdf).\n' +
                                  '• Integrated direct new-tab download card on Christmas page; added Christmas Menu to Outstatic collections for live CMS management.',
                            size: 18,
                            color: '334155'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 12, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: '1.5 hrs', size: 19, color: '334155' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 14, type: WidthType.PERCENTAGE },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: '£52.50', bold: true, size: 20, color: '0F172A' })
                        ]
                      })
                    ]
                  })
                ]
              }),

              // Subtotal Row
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 74, type: WidthType.PERCENTAGE },
                    columnSpan: 2,
                    margins: { top: 100, bottom: 100, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'Subtotal (4.0 hrs @ £35.00/hr):', bold: true, size: 20, color: '475569' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 12, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: '4.0 hrs', bold: true, size: 19, color: '475569' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 14, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: '£140.00', bold: true, size: 20, color: '0F172A' })
                        ]
                      })
                    ]
                  })
                ]
              }),

              // VAT Row
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 86, type: WidthType.PERCENTAGE },
                    columnSpan: 3,
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'VAT (0% / Not Applicable):', size: 19, color: '64748B' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 14, type: WidthType.PERCENTAGE },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: '£0.00', size: 19, color: '64748B' })
                        ]
                      })
                    ]
                  })
                ]
              }),

              // Total Row
              new TableRow({
                shading: { fill: 'EFF6FF', type: ShadingType.CLEAR },
                children: [
                  new TableCell({
                    width: { size: 86, type: WidthType.PERCENTAGE },
                    columnSpan: 3,
                    margins: { top: 140, bottom: 140, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'TOTAL AMOUNT DUE:', bold: true, size: 24, color: '1E3A8A' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 14, type: WidthType.PERCENTAGE },
                    margins: { top: 140, bottom: 140, left: 120, right: 120 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: '£140.00', bold: true, size: 26, color: '1E3A8A' })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 180 } }),

          // Scope & Proposal Note Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: borderLight,
              bottom: borderLight,
              left: borderLight,
              right: borderLight,
              insideHorizontal: borderNone,
              insideVertical: borderNone
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 140, right: 140 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'NOTE ON SCOPE & UNRELEASED PROPOSAL ITEMS:', bold: true, size: 19, color: '1E3A8A' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'This invoice strictly reflects the live production deployment of Items 1 & 2 from the November 2026 Website Enhancement Proposal. Remaining items (Item 3 Mobile Action Bar, Item 4 Facebook Reels Public Embeds, Item 5 AVIF Optimization Pipeline, Item 6 Stay & Dine Packages, Item 7 Room Engine/Availability Bar, Item 8 PWA Offline Caching) and temporary test items (Guest Testimonials Carousel) were not commissioned for live production and are billed at £0.00.',
                            size: 17,
                            color: '64748B'
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 220 } }),

          // Payment Details & Remittance Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: borderNavy,
              bottom: borderNavy,
              left: borderNavy,
              right: borderNavy,
              insideHorizontal: borderNone,
              insideVertical: borderNone
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
                    margins: { top: 140, bottom: 140, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'PAYMENT DETAILS (BACS DIRECT TRANSFER)', bold: true, size: 21, color: '1E3A8A' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Account Name: ', bold: true, size: 19, color: '334155' }),
                          new TextRun({ text: 'Martin Cozens', size: 19, color: '0F172A', bold: true }),
                          new TextRun({ text: '    |    Sort Code: ', bold: true, size: 19, color: '334155' }),
                          new TextRun({ text: '08-93-00', size: 19, color: '0F172A', bold: true }),
                          new TextRun({ text: '    |    Account No: ', bold: true, size: 19, color: '334155' }),
                          new TextRun({ text: '79002929', size: 19, color: '0F172A', bold: true })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Payment Reference: ', bold: true, size: 19, color: '334155' }),
                          new TextRun({ text: 'INV-20261120-01 (or The Ship Inn)', size: 19, color: '0F172A' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Payment Terms: ', bold: true, size: 19, color: '334155' }),
                          new TextRun({ text: 'Strictly due by return upon invoice following live deployment and client sign-off.', size: 18, color: '64748B', italics: true })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // Sign-off
          new Paragraph({
            children: [
              new TextRun({ text: 'Thank you for your business.', bold: true, size: 20, color: '1E3A8A' })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Martin Cozens | itsmyapp.co.uk | hello@itsmyapp.co.uk | 07791 043227', size: 18, color: '64748B' })
            ]
          })
        ]
      }
    ]
  })

  const buffer = await Packer.toBuffer(doc)

  // Paths to save
  const targetDir1 = path.join(
    rootDir,
    '..',
    'Proposals',
    'Presentation to The Ship Inn - Porlock Weir November 2026'
  )
  const targetDir2 = path.join(rootDir, '..', 'Invoicing')

  const file1 = path.join(targetDir1, 'The_Ship_Inn_Website_Enhancement_Invoice_November_2026.docx')
  const file2 = path.join(targetDir2, 'The Ship Inn Website INVOICE November 2026 - Christmas & Menus.docx')

  fs.writeFileSync(file1, buffer)
  console.log(`Saved proposal invoice: ${file1}`)

  if (fs.existsSync(targetDir2)) {
    fs.writeFileSync(file2, buffer)
    console.log(`Saved invoicing folder invoice: ${file2}`)
  }

  return { file1, file2 }
}

generateInvoice()
  .then(() => console.log('Invoice generation finished successfully!'))
  .catch(err => {
    console.error('Error generating invoice:', err)
    process.exit(1)
  })
