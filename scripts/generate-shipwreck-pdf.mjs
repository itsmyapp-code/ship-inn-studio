import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

async function generateShipwreckPdf() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()

  const logoBase64 = fs.existsSync(path.join(process.cwd(), 'public/images/the_ship_inn2.webp'))
    ? `data:image/webp;base64,${fs.readFileSync(path.join(process.cwd(), 'public/images/the_ship_inn2.webp')).toString('base64')}`
    : ''

  // Read current bands
  const dataFile = path.join(process.cwd(), 'content', 'demo-shipwreck-items.json')
  let bands = []
  if (fs.existsSync(dataFile)) {
    try {
      bands = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    } catch (e) {
      console.warn('Could not read bands from JSON:', e)
    }
  }

  const fridayBands = bands.filter((b) => b.day === 'Friday')
  const saturdayBands = bands.filter((b) => b.day === 'Saturday')
  const sundayBands = bands.filter((b) => b.day === 'Sunday')
  const tbcBands = bands.filter((b) => b.day === 'TBC' || b.isTbc || (b.timeSlot || '').includes('TBC'))

  const renderBandRow = (b) => `
    <div class="band-item">
      <div class="band-header">
        <span class="band-name">${b.bandName} ${b.isHeadline ? '<span class="star">★ HEADLINE</span>' : ''}</span>
        <span class="band-time">${b.timeSlot || 'Schedule TBC'}</span>
      </div>
      <div class="band-sub">
        <span class="band-genre">${b.genre || 'Maritime Folk'}</span>
        <span class="band-stage">📍 ${b.stage || 'The Quay Stage'}</span>
      </div>
      <div class="band-desc">${b.description || ''}</div>
    </div>
  `

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

  @page {
    size: A4 portrait;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 210mm;
    min-height: 297mm;
    background: #090e17;
    color: #e2e8f0;
    font-family: 'Montserrat', sans-serif;
    padding: 10mm 12mm;
    position: relative;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Decorative Border */
  .border-frame {
    border: 2px solid #d97706;
    padding: 8mm 10mm;
    background: #05080f;
    min-height: 275mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .header {
    text-align: center;
    border-bottom: 1.5px solid rgba(217, 119, 6, 0.4);
    padding-bottom: 5mm;
    margin-bottom: 5mm;
  }

  .logo-img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    margin: 0 auto 3mm auto;
    display: block;
    filter: invert(1);
  }

  .sub-title {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #f59e0b;
    font-weight: 700;
    margin-bottom: 2mm;
  }

  .main-title {
    font-family: 'Cinzel', serif;
    font-size: 24pt;
    font-weight: 800;
    color: #fef3c7;
    letter-spacing: 1px;
    line-height: 1.1;
    margin-bottom: 2mm;
  }

  .meta-strip {
    font-size: 7.5pt;
    color: #cbd5e1;
    letter-spacing: 1px;
    display: flex;
    justify-content: center;
    gap: 15px;
    font-weight: 500;
  }

  /* Schedule Columns */
  .schedule-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6mm;
    flex-grow: 1;
  }

  .day-card {
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(217, 119, 6, 0.3);
    border-radius: 6px;
    padding: 4mm 5mm;
    margin-bottom: 4mm;
  }

  .day-heading {
    font-family: 'Cinzel', serif;
    font-size: 11pt;
    font-weight: 700;
    color: #fbbf24;
    border-bottom: 1px dashed rgba(217, 119, 6, 0.3);
    padding-bottom: 2mm;
    margin-bottom: 3mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .day-heading span.badge {
    font-family: 'Montserrat', sans-serif;
    font-size: 6.5pt;
    background: #d97706;
    color: #05080f;
    padding: 1px 6px;
    border-radius: 3px;
    font-weight: 800;
  }

  .band-item {
    margin-bottom: 3mm;
    padding-bottom: 2mm;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.08);
  }

  .band-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .band-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1mm;
  }

  .band-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 11.5pt;
    font-weight: 700;
    color: #ffffff;
  }

  .band-time {
    font-size: 7pt;
    font-weight: 600;
    color: #fbbf24;
    background: rgba(217, 119, 6, 0.15);
    padding: 1px 5px;
    border-radius: 3px;
  }

  .star {
    font-size: 6.5pt;
    color: #f59e0b;
    font-weight: 800;
    letter-spacing: 0.5px;
    margin-left: 4px;
  }

  .band-sub {
    font-size: 6.5pt;
    color: #94a3b8;
    margin-bottom: 1mm;
    display: flex;
    gap: 8px;
  }

  .band-genre {
    color: #cbd5e1;
    font-weight: 500;
  }

  .band-desc {
    font-size: 6.5pt;
    color: #64748b;
    line-height: 1.25;
  }

  /* Festival Perks Banner */
  .footer-perks {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4mm;
    border-top: 1px solid rgba(217, 119, 6, 0.3);
    padding-top: 3.5mm;
    margin-top: 4mm;
    text-align: center;
  }

  .perk-box {
    background: rgba(255, 255, 255, 0.03);
    padding: 2.5mm;
    border-radius: 4px;
    border: 0.5px solid rgba(255, 255, 255, 0.06);
  }

  .perk-title {
    font-size: 7pt;
    font-weight: 700;
    color: #fbbf24;
    margin-bottom: 1mm;
    text-transform: uppercase;
  }

  .perk-desc {
    font-size: 6pt;
    color: #94a3b8;
    line-height: 1.2;
  }

  .footer-meta {
    text-align: center;
    font-size: 6.5pt;
    color: #64748b;
    margin-top: 3mm;
  }
</style>
</head>
<body>
  <div class="border-frame">
    <div>
      <div class="header">
        ${logoBase64 ? `<img src="${logoBase64}" class="logo-img" alt="The Ship Inn" />` : ''}
        <div class="sub-title">The Ship Inn • Porlock Weir Quayside</div>
        <h1 class="main-title">ShipWreck Music Festival</h1>
        <div class="meta-strip">
          <span>📅 Bank Holiday Weekend</span>
          <span>📍 Porlock Weir, Somerset, TA24 8PB</span>
          <span>🎟️ Free Quayside Admission</span>
        </div>
      </div>

      <div class="schedule-grid">
        <!-- Column 1: Friday & Saturday -->
        <div>
          ${fridayBands.length > 0 ? `
            <div class="day-card">
              <div class="day-heading">
                <span>Friday Sessions</span>
                <span class="badge">Day 1</span>
              </div>
              ${fridayBands.map(renderBandRow).join('')}
            </div>
          ` : ''}

          ${saturdayBands.length > 0 ? `
            <div class="day-card">
              <div class="day-heading">
                <span>Saturday Main Stage</span>
                <span class="badge">Day 2</span>
              </div>
              ${saturdayBands.map(renderBandRow).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Column 2: Sunday & Upcoming / TBC -->
        <div>
          ${sundayBands.length > 0 ? `
            <div class="day-card">
              <div class="day-heading">
                <span>Sunday Finale</span>
                <span class="badge">Day 3</span>
              </div>
              ${sundayBands.map(renderBandRow).join('')}
            </div>
          ` : ''}

          ${tbcBands.length > 0 ? `
            <div class="day-card">
              <div class="day-heading">
                <span>Additional Lineup Acts</span>
                <span class="badge" style="background:#475569; color:#f8fafc;">TBC</span>
              </div>
              ${tbcBands.map(renderBandRow).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </div>

    <!-- Bottom Hospitality & Venue Highlights -->
    <div>
      <div class="footer-perks">
        <div class="perk-box">
          <div class="perk-title">🍺 16 Guest Ales &amp; Cider</div>
          <div class="perk-desc">Real ales from Exmoor &amp; Devon alongside traditional West Country cloudy farm ciders.</div>
        </div>
        <div class="perk-box">
          <div class="perk-title">🦪 Quayside BBQ &amp; Oysters</div>
          <div class="perk-desc">Fresh Porlock Bay oysters, spit-roasted Exmoor lamb, and hot seafood along the seawall.</div>
        </div>
        <div class="perk-box">
          <div class="perk-title">🌊 High Tide Sessions</div>
          <div class="perk-desc">Live music by torchlight as the tide rolls into the harbour basin. Table booking recommended.</div>
        </div>
      </div>

      <div class="footer-meta">
        The Ship Inn, Porlock Weir, Somerset, TA24 8PB • Tel: 01643 863288 • www.theshipinnporlockweir.co.uk<br/>
        Official Festival Pocket Timetable • Times &amp; acts subject to tidal schedules.
      </div>
    </div>
  </div>
</body>
</html>
  `

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

  const outputPdfPath = path.join(
    process.cwd(),
    'public',
    'docs',
    'ShipWreck_Festival_Lineup_Guide.pdf'
  )
  const brainPdfPath =
    'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/ShipWreck_Festival_Lineup_Guide.pdf'

  await page.pdf({
    path: outputPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  })

  fs.copyFileSync(outputPdfPath, brainPdfPath)

  await browser.close()
  console.log('ShipWreck printable timetable PDF generated at:')
  console.log('1.', outputPdfPath)
  console.log('2.', brainPdfPath)
}

generateShipwreckPdf().catch((err) => {
  console.error('Error generating PDF:', err)
  process.exit(1)
})
