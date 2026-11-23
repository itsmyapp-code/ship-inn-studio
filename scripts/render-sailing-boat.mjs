import sharp from 'sharp'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

const ffmpeg = 'C:\\Program Files\\Agent\\dlls\\x64\\ffmpeg.exe'

const boatImgPath = 'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/sailing_boat.png'
const textImgPath = 'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/sailing_text.png'
const inputVideo = 'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/.user_uploaded/media_1795473134963_1aab6c32.mp4'

const framesDir = 'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/sailing_frames'
if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true })

async function generateSailingSequence() {
  console.log('Generating sailing frames...')

  const boatMeta = await sharp(boatImgPath).metadata()
  const textMeta = await sharp(textImgPath).metadata()

  const boatBuffer = await sharp(boatImgPath).png().toBuffer()
  const textBuffer = await sharp(textImgPath).png().toBuffer()

  const fps = 24
  const durationSec = 2.6 // Total intro clip duration
  const totalFrames = Math.round(fps * durationSec)

  const W = 960
  const H = 720

  // Pre-generate rotated boat buffers for smooth performance
  // Pitch range: -3.5 deg to +3.5 deg
  const angles = {}
  for (let a = -4; a <= 4; a += 0.5) {
    angles[a.toFixed(1)] = await sharp(boatBuffer)
      .rotate(a, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  }

  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps
    const progress = t / durationSec

    // Sailing motion: enters from x = -boatMeta.width, sails across to x = W
    const x = Math.round(-boatMeta.width + (W + boatMeta.width) * progress)

    // Wave swell bobbing: 1.4 Hz wave frequency
    const waveSin = Math.sin(2 * Math.PI * 1.35 * t)
    const y = Math.round(155 + 10 * waveSin)

    // Pitch angle rocking with wave
    const rawAngle = 3.0 * Math.sin(2 * Math.PI * 1.35 * t + 0.4)
    const snappedAngle = (Math.round(rawAngle * 2) / 2).toFixed(1)
    const currentBoatBuf = angles[snappedAngle] || boatBuffer

    // Text fade in over first 0.8s
    const textAlpha = Math.min(1, t / 0.8)
    let renderedTextBuf = textBuffer
    if (textAlpha < 0.98) {
      // Modulate opacity
      const { data, info } = await sharp(textBuffer).raw().toBuffer({ resolveWithObject: true })
      const faded = Buffer.from(data)
      for (let i = 3; i < faded.length; i += 4) {
        faded[i] = Math.round(faded[i] * textAlpha)
      }
      renderedTextBuf = await sharp(faded, {
        raw: { width: info.width, height: info.height, channels: 4 }
      }).png().toBuffer()
    }

    // Build frame
    const frameNumber = String(f).padStart(4, '0')
    const framePath = path.join(framesDir, `frame_${frameNumber}.jpg`)

    await sharp({
      create: {
        width: W,
        height: H,
        channels: 4,
        background: { r: 5, g: 9, b: 18, alpha: 1 } // Deep night background
      }
    })
      .composite([
        // Centered Text in lower third
        {
          input: renderedTextBuf,
          left: Math.round((W - textMeta.width) / 2),
          top: 450
        },
        // Sailing Boat
        {
          input: currentBoatBuf,
          left: Math.max(-boatMeta.width, Math.min(W, x)),
          top: y
        }
      ])
      .jpeg({ quality: 95 })
      .toFile(framePath)
  }

  console.log(`Rendered ${totalFrames} frames!`)

  // Step 2: Assemble frames into temp video with silent audio
  const sailingClipTemp = 'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/temp_sailing.mp4'
  execSync(
    `"${ffmpeg}" -r ${fps} -i "${framesDir}/frame_%04d.jpg" -f lavfi -t ${durationSec} -i anullsrc=r=48000:cl=stereo -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -shortest "${sailingClipTemp}" -y`,
    { stdio: 'inherit' }
  )

  // Step 3: Crossfade sailing boat into inputVideo
  // Sailing clip is 2.6s. Crossfade starts at t = 1.85s, duration 0.75s
  const outputVideo = 'public/videos/Ship_Wreck_Sailing_Boat.mp4'
  const offset = 1.85
  const xfadeDur = 0.75
  const audioDelayMs = Math.round(offset * 1000)

  const filterComplex =
    `[0:v]settb=AVTB,setpts=PTS-STARTPTS[v0];` +
    `[1:v]settb=AVTB,setpts=PTS-STARTPTS[v1];` +
    `[v0][v1]xfade=transition=fade:duration=${xfadeDur}:offset=${offset}[v];` +
    `[1:a]adelay=${audioDelayMs}|${audioDelayMs},afade=t=in:ss=0:d=${xfadeDur}[a]`

  execSync(
    `"${ffmpeg}" -i "${sailingClipTemp}" -i "${inputVideo}" -filter_complex "${filterComplex}" -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k "${outputVideo}" -y`,
    { stdio: 'inherit' }
  )

  // Copy to brain
  const brainOutput = 'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/Ship_Wreck_Sailing_Boat.mp4'
  fs.copyFileSync(outputVideo, brainOutput)
  console.log('Saved sailing video to:', outputVideo)
  console.log('Saved copy to brain:', brainOutput)

  // Extract preview frames for user inspection
  execSync(`"${ffmpeg}" -ss 0.8 -i "${outputVideo}" -vframes 1 "C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/sailing_prev_01.jpg" -y`, { stdio: 'ignore' })
  execSync(`"${ffmpeg}" -ss 1.4 -i "${outputVideo}" -vframes 1 "C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/sailing_prev_02.jpg" -y`, { stdio: 'ignore' })
  execSync(`"${ffmpeg}" -ss 2.2 -i "${outputVideo}" -vframes 1 "C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/sailing_prev_03.jpg" -y`, { stdio: 'ignore' })
  console.log('Preview frames extracted!')
}

generateSailingSequence().catch(console.error)
