/**
 * Format a timestamp into a short relative string: "2m", "3h", "4d"
 */
export function timeAgo(isoString) {
  const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000)
  if (seconds < 60)  return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

/**
 * Compact number format: 1200 → "1.2K"
 */
export function compactNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

/**
 * Map a temp_score (0–100) to a badge tier
 */
export function getTempTier(score) {
  if (score >= 80) return { tier: 'hot',   label: '🔥 HOT',   cls: 'badge-hot'   }
  if (score >= 50) return { tier: 'warm',  label: '☕ WARM',  cls: 'badge-warm'  }
  if (score >= 20) return { tier: 'fresh', label: '✨ FRESH', cls: 'badge-fresh' }
  return              { tier: 'cold',  label: '🧊 COLD',  cls: 'badge-cold'  }
}

/**
 * Get initials from a display name: "Stacy M." → "SM"
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Category color map
 */
export const CATEGORY_COLORS = {
  Work:    { bg: 'rgba(43,134,197,0.15)',    color: '#2B86C5' },
  Tech:    { bg: 'rgba(120,75,160,0.15)',    color: '#9B73CC' },
  School:  { bg: 'rgba(0,245,160,0.12)',     color: '#00C882' },
  Culture: { bg: 'rgba(255,181,71,0.15)',    color: '#FFB547' },
  Drama:   { bg: 'rgba(255,60,172,0.15)',    color: '#FF3CAC' },
  Other:   { bg: 'rgba(255,255,255,0.08)',   color: '#A9A8B8' },
}
