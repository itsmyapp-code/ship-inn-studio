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

async function generateSlowingSequence() {
  console.log('Generating slowed-down, majestic sailing sequence...')

  const boatMeta = await sharp(boatImgPath).metadata()
  const textMeta = await sharp(textImgPath).metadata()

  const boatBuffer = await sharp(boatImgPath).png().toBuffer()
  const textBuffer = await sharp(textImgPath).png().toBuffer()

  const fps = 24
  const durationSec = 5.0 // Slowed down from 2.6s to 5.0s (half speed, majestic glide)
  const totalFrames = Math.round(fps * durationSec)

  const W = 960
  const H = 720

  // Pre-generate subtle pitch-angle boat buffers (-3.5 deg to +3.5 deg)
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

    // Gentle, stately sailing speed across the 960px screen
    const x = Math.round(-boatMeta.width + (W + boatMeta.width) * progress)

    // Gentle, realistic ocean swell (0.7 Hz calm frequency)
    const waveSin = Math.sin(2 * Math.PI * 0.75 * t)
    const y = Math.round(155 + 9 * waveSin)

    // Gentle pitch rocking on the swell
    const rawAngle = 2.5 * Math.sin(2 * Math.PI * 0.75 * t + 0.3)
    const snappedAngle = (Math.round(rawAngle * 2) / 2).toFixed(1)
    const currentBoatBuf = angles[snappedAngle] || boatBuffer

    // Text fade in gracefully over first 1.2s
    const textAlpha = Math.min(1, t / 1.2)
    let renderedTextBuf = textBuffer
    if (textAlpha < 0.98) {
      const { data, info } = await sharp(textBuffer).raw().toBuffer({ resolveWithObject: true })
      const faded = Buffer.from(data)
      for (let i = 3; i < faded.length; i += 4) {
        faded[i] = Math.round(faded[i] * textAlpha)
      }
      renderedTextBuf = await sharp(faded, {
        raw: { width: info.width, height: info.height, channels: 4 }
      }).png().toBuffer()
    }

    const frameNumber = String(f).padStart(4, '0')
    const framePath = path.join(framesDir, `frame_${frameNumber}.jpg`)

    await sharp({
      create: {
        width: W,
        height: H,
        channels: 4,
        background: { r: 5, g: 9, b: 18, alpha: 1 }
      }
    })
      .composite([
        {
          input: renderedTextBuf,
          left: Math.round((W - textMeta.width) / 2),
          top: 450
        },
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

  // Step 3: Crossfade into festival video
  // Logo sails for 4.0s, crossfades over 1.0s (offset = 4.0s)
  const outputVideo = 'public/videos/Ship_Wreck_Sailing_Boat.mp4'
  const offset = 4.0
  const xfadeDur = 1.0
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

  const brainOutput = 'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/Ship_Wreck_Sailing_Boat.mp4'
  fs.copyFileSync(outputVideo, brainOutput)
  console.log('Saved slowed sailing video to:', outputVideo)

  // Extract preview frames for user inspection
  execSync(`"${ffmpeg}" -ss 1.5 -i "${outputVideo}" -vframes 1 "C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/sailing_prev_slow_01.jpg" -y`, { stdio: 'ignore' })
  execSync(`"${ffmpeg}" -ss 3.0 -i "${outputVideo}" -vframes 1 "C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/sailing_prev_slow_02.jpg" -y`, { stdio: 'ignore' })
  execSync(`"${ffmpeg}" -ss 4.4 -i "${outputVideo}" -vframes 1 "C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/sailing_prev_slow_03.jpg" -y`, { stdio: 'ignore' })

  // Clean frames dir
  fs.rmSync(framesDir, { recursive: true, force: true })
  console.log('Done!')
}

generateSlowingSequence().catch(console.error)
