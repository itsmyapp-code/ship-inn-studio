import sharp from 'sharp'

async function prepareAssets() {
  const meta = await sharp('public/images/the_ship_inn2.webp').metadata()

  // 1. Boat crop: top 0 to 1270
  const boatBuf = await sharp('public/images/the_ship_inn2.webp')
    .extract({ left: 0, top: 0, width: meta.width, height: 1270 })
    .toBuffer()

  // 2. Text crop: top 1320 to bottom
  const textBuf = await sharp('public/images/the_ship_inn2.webp')
    .extract({ left: 0, top: 1320, width: meta.width, height: meta.height - 1320 })
    .toBuffer()

  async function makeTransparentWhite(buf, boost = 1.45) {
    const { data, info } = await sharp(buf).grayscale().raw().toBuffer({ resolveWithObject: true })
    const rgba = Buffer.alloc(info.width * info.height * 4)
    for (let i = 0; i < data.length; i++) {
      const val = data[i]
      const inv = 255 - val
      const alpha = Math.min(255, Math.max(0, Math.round(inv * boost)))
      const idx = i * 4
      rgba[idx] = 255
      rgba[idx + 1] = 255
      rgba[idx + 2] = 255
      rgba[idx + 3] = alpha
    }
    return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().png().toBuffer()
  }

  const boatPng = await makeTransparentWhite(boatBuf)
  const textPng = await makeTransparentWhite(textBuf, 1.6)

  // Resize boat to ideal sailing size for 960x720 video (e.g. width 340)
  const resizedBoat = await sharp(boatPng)
    .resize(340, null, { fit: 'inside' })
    .png()
    .toBuffer()

  // Resize text to elegant centered size (e.g. width 480)
  const resizedText = await sharp(textPng)
    .resize(480, null, { fit: 'inside' })
    .png()
    .toBuffer()

  await sharp(resizedBoat).toFile('C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/sailing_boat.png')
  await sharp(resizedText).toFile('C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/sailing_text.png')

  console.log('Boat and text assets prepared successfully!')
}

prepareAssets().catch(console.error)
