import sharp from 'sharp'
import path from 'path'

async function makeLogoCards() {
  const logoPath = 'public/images/the_ship_inn2.webp'
  
  // 1. Inspect original logo
  const logoMeta = await sharp(logoPath).metadata()
  console.log('Original logo:', logoMeta.width, 'x', logoMeta.height, logoMeta.format)

  // Invert colors so the ship & text are white on transparent
  // First convert to grayscale, then negate so white becomes black and navy becomes light
  // Then use as alpha mask on pure white, or composite onto dark background
  const { data, info } = await sharp(logoPath)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true })

  // Build RGBA buffer: wherever original was dark (low value), make it white with high alpha
  const rgba = Buffer.alloc(info.width * info.height * 4)
  for (let i = 0; i < data.length; i++) {
    const val = data[i]
    // val is 0..255. 255 is white background in original. ~40 is dark navy ship.
    // Invert: 255 -> 0 alpha, <200 -> high alpha
    const inv = 255 - val
    // Boost contrast
    const alpha = Math.min(255, Math.max(0, Math.round(inv * 1.35)))
    
    const idx = i * 4
    rgba[idx] = 255     // R
    rgba[idx + 1] = 255 // G
    rgba[idx + 2] = 255 // B
    rgba[idx + 3] = alpha // A
  }

  const whiteLogoOnTransparent = await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
    .resize(520, 520, { fit: 'contain' })
    .png()
    .toBuffer()

  // Card 1: 960x720 (Native Ship_Wreck resolution) with deep cinematic black/night background
  await sharp({
    create: {
      width: 960,
      height: 720,
      channels: 4,
      background: { r: 5, g: 9, b: 18, alpha: 1 } // Deep nautical night sky
    }
  })
    .composite([
      {
        input: whiteLogoOnTransparent,
        gravity: 'center'
      }
    ])
    .jpeg({ quality: 95 })
    .toFile('C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/logo_card_960x720.jpg')

  // Card 2: 1280x720 (HD 16:9)
  await sharp({
    create: {
      width: 1280,
      height: 720,
      channels: 4,
      background: { r: 5, g: 9, b: 18, alpha: 1 }
    }
  })
    .composite([
      {
        input: whiteLogoOnTransparent,
        gravity: 'center'
      }
    ])
    .jpeg({ quality: 95 })
    .toFile('C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/logo_card_1280x720.jpg')

  console.log('Logo cards generated successfully!')
}

makeLogoCards().catch(console.error)
