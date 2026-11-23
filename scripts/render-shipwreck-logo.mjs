import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

const ffmpeg = 'C:\\Program Files\\Agent\\dlls\\x64\\ffmpeg.exe'

const logoImg = 'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/logo_card_960x720.jpg'
const inputVideo = 'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/.user_uploaded/media_1795473134963_1aab6c32.mp4'
const outputVideo = 'public/videos/Ship_Wreck_with_Logo.mp4'

async function renderVideo() {
  console.log('Rendering composite video with additional 1s logo hold (1.75s total logo hold)...')

  // Step 1: Create a 2.5s video clip from logoImg at 24fps (1.75s hold + 0.75s crossfade)
  const logoVideoTemp = 'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/temp_logo.mp4'
  execSync(
    `"${ffmpeg}" -loop 1 -t 2.5 -i "${logoImg}" -f lavfi -t 2.5 -i anullsrc=r=48000:cl=stereo -c:v libx264 -t 2.5 -pix_fmt yuv420p -r 24 -c:a aac -shortest "${logoVideoTemp}" -y`,
    { stdio: 'inherit' }
  )

  // Step 2: Use xfade on video, and crossfade/delay on audio
  // Logo hold: 1.75s (+1s as requested), xfade duration: 0.75s, offset: 1.75s
  // Audio: silence for 1.75s, then audio from inputVideo starts and fades in over 0.75s
  const filterComplex = 
    `[0:v]settb=AVTB,setpts=PTS-STARTPTS[v0];` +
    `[1:v]settb=AVTB,setpts=PTS-STARTPTS[v1];` +
    `[v0][v1]xfade=transition=fade:duration=0.75:offset=1.75[v];` +
    `[1:a]adelay=1750|1750,afade=t=in:ss=0:d=0.75[a]`

  execSync(
    `"${ffmpeg}" -i "${logoVideoTemp}" -i "${inputVideo}" -filter_complex "${filterComplex}" -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k "${outputVideo}" -y`,
    { stdio: 'inherit' }
  )

  console.log('Composite video created successfully:', outputVideo)

  // Also create a copy in the brain/user directory
  const brainOutput = 'C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/Ship_Wreck_with_Logo.mp4'
  fs.copyFileSync(outputVideo, brainOutput)
  console.log('Copied to brain output:', brainOutput)

  // Extract preview frames
  execSync(`"${ffmpeg}" -ss 0.8 -i "${outputVideo}" -vframes 1 "C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/preview_01_logo.jpg" -y`, { stdio: 'ignore' })
  execSync(`"${ffmpeg}" -ss 2.1 -i "${outputVideo}" -vframes 1 "C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/preview_02_crossfade.jpg" -y`, { stdio: 'ignore' })
  execSync(`"${ffmpeg}" -ss 2.7 -i "${outputVideo}" -vframes 1 "C:/Users/mcozens/.gemini/antigravity/brain/e5463797-c943-4e43-9d65-f99c29f86a55/preview_03_video.jpg" -y`, { stdio: 'ignore' })

  // Also re-generate posters
  execSync(`"${ffmpeg}" -ss 0.8 -i "${outputVideo}" -vframes 1 "public/videos/Ship_Wreck_with_Logo-poster.webp" -y`, { stdio: 'ignore' })
  execSync(`"${ffmpeg}" -ss 2.7 -i "${outputVideo}" -vframes 1 "public/videos/Ship_Wreck_with_Logo-thumb.webp" -y`, { stdio: 'ignore' })

  console.log('Preview frames and posters updated!')
}

renderVideo().catch(console.error)
