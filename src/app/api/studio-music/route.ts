import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export interface MusicTrack {
  id: string
  title: string
  artist: string
  mood: string
  duration: number
  audioUrl: string
  source: 'jamendo' | 'starter'
  license?: string
}

const STARTER_TRACKS: MusicTrack[] = [
  {
    id: 'starter-upbeat-tech',
    title: 'Upbeat Harbour Groove',
    artist: 'SoundHelix (Royalty-Free)',
    mood: 'upbeat',
    duration: 372,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    source: 'starter',
    license: 'Free Commercial / Demo Use',
  },
  {
    id: 'starter-modern-launch',
    title: 'Warm Evening Acoustic',
    artist: 'SoundHelix (Royalty-Free)',
    mood: 'corporate',
    duration: 425,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    source: 'starter',
    license: 'Free Commercial / Demo Use',
  },
  {
    id: 'starter-chill-lofi',
    title: 'Chill Fireside Pulse',
    artist: 'SoundHelix (Royalty-Free)',
    mood: 'chill',
    duration: 344,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    source: 'starter',
    license: 'Free Commercial / Demo Use',
  },
  {
    id: 'starter-energetic-pop',
    title: 'Energetic Live Night',
    artist: 'SoundHelix (Royalty-Free)',
    mood: 'energetic',
    duration: 302,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    source: 'starter',
    license: 'Free Commercial / Demo Use',
  },
  {
    id: 'starter-cinematic-rise',
    title: 'Cinematic Exmoor Horizon',
    artist: 'SoundHelix (Royalty-Free)',
    mood: 'cinematic',
    duration: 353,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    source: 'starter',
    license: 'Free Commercial / Demo Use',
  },
  {
    id: 'starter-bright-showcase',
    title: 'Sunny Quayside Vibe',
    artist: 'SoundHelix (Royalty-Free)',
    mood: 'upbeat',
    duration: 325,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    source: 'starter',
    license: 'Free Commercial / Demo Use',
  },
  {
    id: 'starter-coastal-ambient',
    title: 'Coastal Ambient Drift',
    artist: 'SoundHelix (Royalty-Free)',
    mood: 'chill',
    duration: 389,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    source: 'starter',
    license: 'Free Commercial / Demo Use',
  },
  {
    id: 'starter-corporate-clean',
    title: 'Clean Hospitality Flow',
    artist: 'SoundHelix (Royalty-Free)',
    mood: 'corporate',
    duration: 314,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    source: 'starter',
    license: 'Free Commercial / Demo Use',
  },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = (searchParams.get('q') || '').trim()
  const mood = (searchParams.get('mood') || '').trim().toLowerCase()

  const jamendoClientId = (process.env.JAMENDO_CLIENT_ID || '').trim()

  if (jamendoClientId) {
    try {
      const params = new URLSearchParams({
        client_id: jamendoClientId,
        format: 'json',
        limit: '12',
        audioformat: 'mp32',
        order: 'popularity_total',
        include: 'musicinfo',
      })
      if (query) params.set('search', query)
      if (mood && mood !== 'all') params.set('fuzzytags', mood)

      const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?${params.toString()}`, {
        cache: 'no-store',
      })

      if (res.ok) {
        const json = await res.json()
        const rawTracks = Array.isArray(json?.results) ? json.results : []
        const tracks: MusicTrack[] = rawTracks
          .filter((t: any) => t?.audio)
          .map((t: any) => ({
            id: `jamendo-${t.id}`,
            title: t.name || 'Untitled Track',
            artist: t.artist_name || 'Jamendo Artist',
            mood: mood || 'royalty-free',
            duration: Number(t.duration) || 120,
            audioUrl: t.audio,
            source: 'jamendo' as const,
            license: t.license_ccurl || 'Creative Commons (Jamendo)',
          }))

        if (tracks.length > 0) {
          return NextResponse.json({
            success: true,
            provider: 'jamendo',
            jamendoEnabled: true,
            tracks,
          })
        }
      }
    } catch (err) {
      console.warn('[studio-music] Jamendo search fallback:', err)
    }
  }

  let filtered = STARTER_TRACKS
  if (mood && mood !== 'all') {
    const byMood = filtered.filter((t) => t.mood === mood)
    if (byMood.length > 0) filtered = byMood
  }
  if (query) {
    const q = query.toLowerCase()
    const byQuery = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.mood.toLowerCase().includes(q)
    )
    if (byQuery.length > 0) filtered = byQuery
  }

  return NextResponse.json({
    success: true,
    provider: 'starter',
    jamendoEnabled: Boolean(jamendoClientId),
    tracks: filtered,
  })
}
