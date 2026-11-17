/**
 * Universal Social URL Normalizer
 * Validates, cleans, and extracts canonical URLs and clean 9:16 embed URLs
 * for Facebook Reels/Videos and Instagram Reels.
 */

export interface NormalizedSocial {
  platform: 'facebook' | 'instagram';
  url: string;
  embedUrl: string;
  shortcode?: string;
}

export function normalizeSocialUrl(rawUrl: string): NormalizedSocial {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    throw new Error('Please enter a valid Facebook or Instagram Reel URL.');
  }

  const trimmed = rawUrl.trim();

  // If user pasted an iframe tag directly
  if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
    const srcMatch = trimmed.match(/src=["'](.*?)["']/);
    if (srcMatch && srcMatch[1]) {
      const iframeSrc = srcMatch[1];
      if (iframeSrc.includes('instagram.com')) {
        return {
          platform: 'instagram',
          url: iframeSrc.replace(/\/embed\/.*$/, '/'),
          embedUrl: iframeSrc,
        };
      }
      if (iframeSrc.includes('facebook.com')) {
        return {
          platform: 'facebook',
          url: iframeSrc,
          embedUrl: iframeSrc,
        };
      }
    }
  }

  let parsed: URL;
  try {
    const withProto = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    parsed = new URL(withProto);
  } catch {
    throw new Error('Invalid URL format. Please include https://');
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const pathname = parsed.pathname;

  // 1. INSTAGRAM SUPPORT
  if (hostname.includes('instagram.com')) {
    const match = pathname.match(/\/(reel|reels|p)\/([a-zA-Z0-9_-]+)/);
    if (match && match[2]) {
      const shortcode = match[2];
      const canonicalUrl = `https://www.instagram.com/reel/${shortcode}/`;
      // Clean borderless 9:16 direct embed without embed.js dependency
      const embedUrl = `https://www.instagram.com/reel/${shortcode}/embed/`;
      return {
        platform: 'instagram',
        url: canonicalUrl,
        embedUrl,
        shortcode,
      };
    }
    throw new Error('Please enter a valid Instagram Reel link (e.g. https://www.instagram.com/reel/C123abc/)');
  }

  // 2. FACEBOOK SUPPORT
  if (
    hostname.includes('facebook.com') ||
    hostname.includes('fb.watch') ||
    hostname.includes('fb.me')
  ) {
    parsed.searchParams.delete('mibextid');
    parsed.searchParams.delete('rdid');
    parsed.searchParams.delete('share_url');
    parsed.searchParams.delete('sfnsn');
    parsed.searchParams.delete('checkpoint_src');
    parsed.searchParams.delete('fbclid');

    if (hostname.includes('fb.watch')) {
      const cleanWatch = `https://fb.watch${parsed.pathname}`;
      return {
        platform: 'facebook',
        url: cleanWatch,
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(cleanWatch)}&show_text=false&width=350&mute=1`,
      };
    }

    const cleanPath = parsed.pathname.replace(/\/$/, '');
    const canonicalUrl = `${parsed.origin}${cleanPath}${parsed.search ? parsed.search : ''}`;

    const isPostOrPhoto =
      canonicalUrl.includes('/photo') ||
      canonicalUrl.includes('/photos') ||
      canonicalUrl.includes('/posts') ||
      canonicalUrl.includes('fbid=') ||
      canonicalUrl.includes('/share/p/');

    const embedUrl = isPostOrPhoto
      ? `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(canonicalUrl)}&width=350&show_text=true&mute=1`
      : `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(canonicalUrl)}&show_text=false&width=350&mute=1`;

    return {
      platform: 'facebook',
      url: canonicalUrl,
      embedUrl,
    };
  }

  throw new Error('Unsupported platform. Only Facebook and Instagram Reels are currently supported.');
}

