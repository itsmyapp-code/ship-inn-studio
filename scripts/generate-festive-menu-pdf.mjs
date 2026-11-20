import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

async function generateFestiveMenuPdf() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()

  const logoBase64 = fs.existsSync(path.join(process.cwd(), 'public/images/the_ship_inn2.webp'))
    ? `data:image/webp;base64,${fs.readFileSync(path.join(process.cwd(), 'public/images/the_ship_inn2.webp')).toString('base64')}`
    : ''

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

  @page {
    size: A4;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 210mm;
    height: 297mm;
    background: #fbf9f5;
    color: #1e293b;
    font-family: 'Cormorant Garamond', serif;
    padding: 12mm 14mm 10mm 14mm;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Decorative Double Border */
  .outer-border {
    position: absolute;
    top: 6mm;
    left: 6mm;
    right: 6mm;
    bottom: 6mm;
    border: 2px solid #b45309;
    pointer-events: none;
  }

  .inner-border {
    position: absolute;
    top: 8mm;
    left: 8mm;
    right: 8mm;
    bottom: 8mm;
    border: 1px solid rgba(180, 83, 9, 0.4);
    pointer-events: none;
  }

  /* Corner Ornaments */
  .corner {
    position: absolute;
    width: 18mm;
    height: 18mm;
    pointer-events: none;
  }
  .corner-tl { top: 7mm; left: 7mm; border-top: 3px solid #7f1d1d; border-left: 3px solid #7f1d1d; }
  .corner-tr { top: 7mm; left: auto; right: 7mm; border-top: 3px solid #7f1d1d; border-right: 3px solid #7f1d1d; }
  .corner-bl { bottom: 7mm; left: 7mm; border-bottom: 3px solid #7f1d1d; border-left: 3px solid #7f1d1d; }
  .corner-br { bottom: 7mm; left: auto; right: 7mm; border-bottom: 3px solid #7f1d1d; border-right: 3px solid #7f1d1d; }

  /* Header Section */
  .header {
    text-align: center;
    padding-top: 2mm;
    margin-bottom: 3mm;
  }

  .logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
    margin: 0 auto 4px auto;
    display: block;
  }

  .pub-name {
    font-family: 'Cinzel', serif;
    font-size: 15pt;
    font-weight: 800;
    color: #1e3a8a;
    letter-spacing: 4px;
    text-transform: uppercase;
  }

  .sub-tagline {
    font-family: 'Montserrat', sans-serif;
    font-size: 7pt;
    font-weight: 500;
    letter-spacing: 2.5px;
    color: #78350f;
    text-transform: uppercase;
    margin-top: 1px;
    margin-bottom: 5px;
  }

  .festive-title {
    font-family: 'Cinzel', serif;
    font-size: 26pt;
    font-weight: 700;
    color: #991b1b;
    letter-spacing: 5px;
    text-transform: uppercase;
    position: relative;
    display: inline-block;
    padding: 0 16px;
    margin-bottom: 2px;
  }

  .festive-sub {
    font-style: italic;
    font-size: 10.5pt;
    color: #475569;
    max-width: 160mm;
    margin: 0 auto;
    line-height: 1.25;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 4px auto 8px auto;
    color: #b45309;
    font-size: 9pt;
  }
  .divider-line {
    width: 35mm;
    height: 1px;
    background: linear-gradient(to right, transparent, #b45309, transparent);
  }

  /* Courses Layout */
  .courses-container {
    display: flex;
    flex-direction: column;
    gap: 5mm;
    margin-bottom: 3mm;
  }

  .course-block {
    text-align: center;
  }

  .course-heading {
    font-family: 'Cinzel', serif;
    font-size: 13pt;
    font-weight: 700;
    color: #991b1b;
    letter-spacing: 3.5px;
    text-transform: uppercase;
    margin-bottom: 2mm;
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .course-heading::before,
  .course-heading::after {
    content: "✦";
    font-size: 7pt;
    color: #d97706;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 1.8mm;
  }

  .menu-item {
    line-height: 1.2;
  }

  .item-title {
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .allergens {
    font-family: 'Montserrat', sans-serif;
    font-size: 6.5pt;
    font-weight: 600;
    color: #94a3b8;
    margin-left: 4px;
    letter-spacing: 0.5px;
  }

  .item-desc {
    font-size: 9.5pt;
    font-style: italic;
    color: #475569;
    margin-top: 0.5px;
  }

  /* Pricing Box */
  .pricing-bar {
    background: linear-gradient(135deg, rgba(127, 29, 29, 0.06), rgba(180, 83, 9, 0.08));
    border-top: 1px solid #b45309;
    border-bottom: 1px solid #b45309;
    padding: 3mm 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 25mm;
    margin-top: 2mm;
    margin-bottom: 3mm;
  }

  .price-tier {
    font-family: 'Cinzel', serif;
    font-size: 13pt;
    font-weight: 700;
    color: #1e3a8a;
    letter-spacing: 1.5px;
  }

  .price-tier span {
    font-size: 14pt;
    color: #991b1b;
    font-weight: 800;
  }

  /* Allergen Guide & Booking Footer */
  .footer {
    border-top: 1px dashed rgba(180, 83, 9, 0.4);
    padding-top: 3mm;
    text-align: center;
  }

  .allergen-key {
    font-family: 'Montserrat', sans-serif;
    font-size: 6pt;
    color: #64748b;
    letter-spacing: 0.3px;
    line-height: 1.35;
    margin-bottom: 2.5mm;
  }

  .allergen-key strong {
    color: #334155;
  }

  .booking-info {
    font-family: 'Montserrat', sans-serif;
    font-size: 7.5pt;
    color: #1e293b;
    line-height: 1.35;
  }

  .booking-phone {
    font-weight: 700;
    color: #991b1b;
    font-size: 8.5pt;
  }

  .address {
    font-size: 6.5pt;
    color: #64748b;
    margin-top: 1.5px;
    letter-spacing: 0.5px;
  }
</style>
</head>
<body>
  <div class="outer-border"></div>
  <div class="inner-border"></div>
  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>
  <div class="corner corner-br"></div>

  <!-- Header -->
  <div class="header">
    ${logoBase64 ? `<img src="${logoBase64}" class="logo" alt="The Ship Inn Logo" />` : ''}
    <div class="pub-name">The Ship Inn</div>
    <div class="sub-tagline">Porlock Weir • Exmoor Coast • Est. 15th Century</div>
    <div class="festive-title">Festive Menu</div>
    <div class="divider">
      <div class="divider-line"></div>
      <span>✦ ❄ ✦</span>
      <div class="divider-line"></div>
    </div>
    <div class="festive-sub">
      Served throughout December in our candlelit Galley Restaurant and fireside Saloon Bar.<br/>
      Crafted fresh by our kitchen team celebrating the finest West Country produce &amp; seasonal Exmoor fare.
    </div>
  </div>

  <!-- Menu Courses -->
  <div class="courses-container">

    <!-- Starters -->
    <div class="course-block">
      <div class="course-heading">Starters</div>
      <div class="items-list">
        <div class="menu-item">
          <span class="item-title">Homemade Winter Vegetable &amp; Herb Soup</span>
          <span class="allergens">(G, D)</span>
          <div class="item-desc">Served with warm crusty farmhouse bread &amp; West Country churned butter</div>
        </div>
        <div class="menu-item">
          <span class="item-title">Smoked Salmon Pâté</span>
          <span class="allergens">(F, G, MU, E)</span>
          <div class="item-desc">Crisp melba toast, baby capers, pickled shallot &amp; cucumber, fresh watercress</div>
        </div>
        <div class="menu-item">
          <span class="item-title">Ham Hock &amp; Mature Cheddar Croquette</span>
          <span class="allergens">(G, D, MU)</span>
          <div class="item-desc">Slow-braised ham, spiced apple &amp; cider chutney, dressed pea shoots</div>
        </div>
        <div class="menu-item">
          <span class="item-title">Poached Winter Pear &amp; Blue Cheese</span>
          <span class="allergens">(D, N)</span>
          <div class="item-desc">Candied Exmoor walnuts, wild baby rocket, drizzled with local Somerset honey</div>
        </div>
      </div>
    </div>

    <!-- Main Courses -->
    <div class="course-block">
      <div class="course-heading">Main Courses</div>
      <div class="items-list">
        <div class="menu-item">
          <span class="item-title">Traditional Roast West Country Turkey</span>
          <span class="allergens">(G, D, MU)</span>
          <div class="item-desc">Pigs in blankets, cranberry &amp; herb stuffing, roast potatoes, seasonal greens &amp; rich roast gravy</div>
        </div>
        <div class="menu-item">
          <span class="item-title">Slow-Braised Local Exmoor Venison</span>
          <span class="allergens">(D, MU, SU)</span>
          <div class="item-desc">Rich red wine and juniper sauce, buttery mashed potatoes, honey-glazed winter root vegetables</div>
        </div>
        <div class="menu-item">
          <span class="item-title">Pan-Fried Coastal Cod Loin</span>
          <span class="allergens">(F, D)</span>
          <div class="item-desc">Mediterranean olive &amp; sweet cherry tomato sauce, lemon crushed new potatoes, fine green beans</div>
        </div>
        <div class="menu-item">
          <span class="item-title">Chestnut &amp; Roasted Butternut Squash Risotto</span>
          <span class="allergens">(V, G, N)</span>
          <div class="item-desc">Crumbled feta, fresh wild sage pesto, toasted pumpkin seeds &amp; parmesan crisp</div>
        </div>
      </div>
    </div>

    <!-- Desserts -->
    <div class="course-block">
      <div class="course-heading">Desserts</div>
      <div class="items-list">
        <div class="menu-item">
          <span class="item-title">Warm Christmas Pudding Strudel</span>
          <span class="allergens">(G, D, SU, N, E)</span>
          <div class="item-desc">Traditional spiced fruit strudel served with warm brandy custard &amp; toasted candied almonds</div>
        </div>
        <div class="menu-item">
          <span class="item-title">Dark Chocolate &amp; Clementine Orange Torte</span>
          <span class="allergens">(G, D, E)</span>
          <div class="item-desc">Warm ginger syrup, honeycomb crunch &amp; West Country clotted cream ice cream</div>
        </div>
        <div class="menu-item">
          <span class="item-title">Godminster Vintage Somerset Cheddar</span>
          <span class="allergens">(D, G, MU)</span>
          <div class="item-desc">Artisan biscuits, homemade spiced tomato &amp; apple chutney, chilled grapes &amp; celery</div>
        </div>
      </div>
    </div>

  </div>

  <!-- Pricing -->
  <div class="pricing-bar">
    <div class="price-tier">2 COURSES &nbsp;•&nbsp; <span>£30.00</span></div>
    <div class="price-tier">3 COURSES &nbsp;•&nbsp; <span>£35.50</span></div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="allergen-key">
      <strong>ALLERGEN INFORMATION:</strong> G - Gluten • N - Nuts • D - Dairy • F - Fish • S - Shellfish • MU - Mustard • SE - Sesame • E - Egg • SO - Soya • CR - Crustaceans • V - Vegetarian / Vegan Option Available • SU - Sulphites.<br/>
      Please inform your server of any dietary requirements or allergies when ordering.
    </div>
    <div class="booking-info">
      <strong>To Reserve Your Festive Table:</strong> Call <span class="booking-phone">01643 863288</span> or email <strong>hello@theshipinnporlockweir.co.uk</strong><br/>
      Pre-orders &amp; deposit required for party sizes of 6 or more • Cosy Harbour-View Accommodation Available Upstairs
    </div>
    <div class="address">
      The Ship Inn, Porlock Weir, Minehead, Somerset, TA24 8PB • www.theshipinnporlockweir.co.uk
    </div>
  </div>
</body>
</html>
`

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

  const outputPdfPath = path.join(process.cwd(), 'public/menus/The-Ship-Inn-Festive-Menu.pdf')
  
  // Ensure directory exists
  const dir = path.dirname(outputPdfPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  await page.pdf({
    path: outputPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  })

  await browser.close()
  console.log('Festive Menu PDF successfully generated at:', outputPdfPath)
}

generateFestiveMenuPdf().catch((err) => {
  console.error('Error generating Festive Menu PDF:', err)
  process.exit(1)
})
