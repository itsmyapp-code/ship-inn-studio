import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

async function extractPoster() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  })
  const page = await browser.newPage()
  const videoAbs = path.resolve('public/videos/santa-ship-inn.mp4').split(path.sep).join('/')
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000;">
        <video id="v" src="file:///${videoAbs}" preload="auto" muted style="width:100%; height:100%;"></video>
      </body>
    </html>
  `
  await page.setContent(html)
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const v = document.getElementById('v')
      v.addEventListener('loadeddata', () => {
        v.currentTime = 0.05
      })
      v.addEventListener('seeked', () => resolve())
      setTimeout(resolve, 3000)
    })
  })
  const v = await page.$('#v')
  if (v) {
    await v.screenshot({ path: 'public/videos/santa-poster.jpg' })
    console.log('Poster screenshot saved.')
  }
  await browser.close()
}

extractPoster().catch(console.error)
