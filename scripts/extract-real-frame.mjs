import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'
import http from 'http'

// Start a quick local static server to serve the video without file:// security restrictions
const server = http.createServer((req, res) => {
  const filePath = path.join(process.cwd(), 'public/videos/santa-ship-inn.mp4')
  const stat = fs.statSync(filePath)
  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes'
  })
  fs.createReadStream(filePath).pipe(res)
})

server.listen(48291, async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-web-security', '--autoplay-policy=no-user-gesture-required']
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 720 })

    const html = `
      <!DOCTYPE html>
      <html>
        <body style="margin:0; background:#000;">
          <video id="vid" src="http://localhost:48291/" muted autoplay playsinline style="width:1280px; height:720px; object-fit:contain;"></video>
          <canvas id="canv" width="1280" height="720" style="display:none;"></canvas>
        </body>
      </html>
    `
    await page.setContent(html)

    // Wait until video is playing and has rendered frames
    await page.evaluate(() => {
      return new Promise((resolve) => {
        const v = document.getElementById('vid')
        v.addEventListener('timeupdate', () => {
          if (v.currentTime > 0.2) {
            const c = document.getElementById('canv')
            const ctx = c.getContext('2d')
            ctx.drawImage(v, 0, 0, 1280, 720)
            resolve(c.toDataURL('image/jpeg', 0.92))
          }
        })
        v.play().catch(() => {})
      })
    })

    const dataUrl = await page.evaluate(() => {
      const c = document.getElementById('canv')
      return c.toDataURL('image/jpeg', 0.92)
    })

    if (dataUrl && dataUrl.startsWith('data:image/jpeg;base64,')) {
      const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '')
      fs.writeFileSync('public/videos/santa-poster.jpg', Buffer.from(base64Data, 'base64'))
      console.log('Real frame captured! New poster size:', fs.statSync('public/videos/santa-poster.jpg').size)
    }

    await browser.close()
  } catch (err) {
    console.error('Error capturing frame:', err)
  } finally {
    server.close()
  }
})
