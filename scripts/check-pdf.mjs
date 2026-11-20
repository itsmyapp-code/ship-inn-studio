import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

async function checkPdf() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  const pdfAbs = path.resolve('public/menus/The-Ship-Inn-Festive-Menu.pdf').split(path.sep).join('/')
  
  // Load PDF in chrome viewer or render HTML source
  console.log('Checking PDF generation...')
  await browser.close()
}

checkPdf().catch(console.error)
