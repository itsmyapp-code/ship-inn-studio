const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

const IMAGE_DIR = path.join(__dirname, '../public/images');
const OUTPUT_PDF = path.join(__dirname, `../image_catalog_${Date.now()}.pdf`);
const TEMP_HTML = path.join(__dirname, '../temp_image_catalog.html');

const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(file => {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
                arrayOfFiles.push(path.join(dirPath, '/', file));
            }
        }
    });

    return arrayOfFiles;
};

const main = async () => {
    console.log('Scanning for images...');
    if (!fs.existsSync(IMAGE_DIR)) {
        console.error(`Directory not found: ${IMAGE_DIR}`);
        process.exit(1);
    }
    const files = getAllFiles(IMAGE_DIR);
    console.log(`Found ${files.length} images.`);

    // Group by folder
    const filesByFolder = {};
    files.forEach(file => {
        const dir = path.dirname(file);
        const relativeDir = path.relative(IMAGE_DIR, dir);
        const key = relativeDir === '' ? 'Root' : relativeDir;

        if (!filesByFolder[key]) {
            filesByFolder[key] = [];
        }
        filesByFolder[key].push(file);
    });

    let html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: sans-serif; padding: 20px; }
      h1 { text-align: center; margin-bottom: 30px; }
      h2 { border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-top: 40px; page-break-after: avoid; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
      .item { break-inside: avoid; text-align: center; border: 1px solid #eee; padding: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); background: #fff; }
      .item img { max-width: 100%; max-height: 120px; object-fit: contain; display: block; margin: 0 auto 10px; }
      .item .name { font-size: 10px; color: #555; word-wrap: break-word; overflow-wrap: break-word; }
    </style>
  </head>
  <body>
    <h1>Image Catalog</h1>
  `;

    const sortedFolders = Object.keys(filesByFolder).sort();

    for (const folder of sortedFolders) {
        html += `<h2>${folder}</h2>`;
        html += `<div class="grid">`;

        // Process images sequentially to avoid OOM
        for (const file of filesByFolder[folder].sort()) {
            try {
                const fileName = path.basename(file);
                // Resize image to 300px width, convert to JPEG quality 80
                const imageBuffer = await sharp(file)
                    .resize(300)
                    .jpeg({ quality: 80 })
                    .toBuffer();

                const fileUrl = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

                html += `
                    <div class="item">
                        <img src="${fileUrl}" />
                        <div class="name">${fileName}</div>
                    </div>
                `;
            } catch (err) {
                console.error(`Failed to process ${file}:`, err);
                html += `
                    <div class="item">
                        <div style="height:100px;display:flex;align-items:center;justify-content:center;color:red;">Error</div>
                        <div class="name">${path.basename(file)}</div>
                    </div>
                `;
            }
        }

        html += `</div>`;
    }

    html += `</body></html>`;

    console.log('Writing temporary HTML...');
    fs.writeFileSync(TEMP_HTML, html);

    console.log('Generating PDF...');
    const browser = await puppeteer.launch({
        headless: "new"
    });
    const page = await browser.newPage();

    // Go to the local HTML file
    const pageUrl = 'file:///' + TEMP_HTML.replace(/\\/g, '/');
    console.log('Navigating to:', pageUrl);

    // Increase timeout to 5 minutes (300000 ms) or disable it (0)
    try {
        await page.goto(pageUrl, { waitUntil: 'networkidle0', timeout: 300000 });
    } catch (e) {
        console.error("Navigation failed:", e);
        // Try to proceed anyway, maybe some images failed but page loaded?
    }

    console.log('Printing PDF...');
    await page.pdf({
        path: OUTPUT_PDF,
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
        timeout: 300000 // also increase pdf generation timeout
    });

    await browser.close();

    // Cleanup
    try {
        fs.unlinkSync(TEMP_HTML);
    } catch (e) {
        console.warn("Could not delete temp file", e);
    }

    console.log(`PDF created at ${OUTPUT_PDF}`);
};

main().catch(console.error);
