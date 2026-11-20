import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

async function checkRenderedPdf() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1240, height: 1754 })
  
  // Let's load the html that generated the PDF and check the bottom
  const scriptContent = fs.readFileSync('scripts/generate-festive-menu-pdf.mjs', 'utf8')
  const match = scriptContent.match(/const htmlContent = `([\s\S]*?)`\s*await page\.setContent/m)
  if (match) {
    let html = match[1]
    const logoBase64 = fs.existsSync(path.join(process.cwd(), 'public/images/the_ship_inn2.webp'))
      ? `data:image/webp;base64,${fs.readFileSync(path.join(process.cwd(), 'public/images/the_ship_inn2.webp')).toString('base64')}`
      : ''
    html = html.replace('${logoBase64}', logoBase64)
    await page.setContent(html, { waitUntil: 'networkidle0' })
    await page.screenshot({ path: 'public/menus/festive-menu-preview.png', fullPage: true })
    const dimensions = await page.evaluate(() => {
      const body = document.body
      return {
        scrollHeight: body.scrollHeight,
        clientHeight: body.clientHeight,
        offsetHeight: body.offsetHeight
      }
    })
    console.log('Body dimensions:', dimensions)
  }
  await browser.close()
}

checkRenderedPdf().catch(console.error)
