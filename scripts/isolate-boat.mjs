import sharp from 'sharp'

async function inspectLogo() {
  const meta = await sharp('public/images/the_ship_inn2.webp').metadata()
  console.log('Original meta:', meta.width, meta.height)

  // Just crop the original image first!
  const boatBuf = await sharp('public/images/the_ship_inn2.webp')
    .extract({ left: 0, top: 0, width: meta.width, height: 1250 })
    .toBuffer()

  const textBuf = await sharp('public/images/the_ship_inn2.webp')
    .extract({ left: 0, top: 1250, width: meta.width, height: meta.height - 1250 })
    .toBuffer()

  // Invert helper
  async function makeTransparentWhite(buf) {
    const { data, info } = await sharp(buf).grayscale().raw().toBuffer({ resolveWithObject: true })
    const rgba = Buffer.alloc(info.width * info.height * 4)
    for (let i = 0; i < data.length; i++) {
      const val = data[i]
      const inv = 255 - val
      const alpha = Math.min(255, Math.max(0, Math.round(inv * 1.4)))
      const idx = i * 4
      rgba[idx] = 255
      rgba[idx + 1] = 255
      rgba[idx + 2] = 255
      rgba[idx + 3] = alpha
    }
    return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().png().toBuffer()
  }

  const boatPng = await makeTransparentWhite(boatBuf)
  const textPng = await makeTransparentWhite(textBuf)

  await sharp(boatPng).toFile('C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/boat_only.png')
  await sharp(textPng).toFile('C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/text_only.png')

  console.log('Successfully saved boat_only.png and text_only.png!')
}

inspectLogo().catch(console.error)
