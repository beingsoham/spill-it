import { supabase } from '../db/supabase.js'

// Hacker News gravity formula adapted for tea:
// score = (likes*2 + comments*3) / (hours + 2)^1.2
export async function refreshTrendingScores() {
  const { error } = await supabase.rpc('refresh_temp_scores')

  if (error) {
    console.error('[Trending] Score refresh failed:', error.message)
    return { success: false, error: error.message }
  }

  console.log('[Trending] Scores refreshed at', new Date().toISOString())
  return { success: true }
}

export async function getTopTrending({ limit = 10, category = null } = {}) {
  let query = supabase
    .from('posts_with_counts')
    .select('*')
    .order('temp_score', { ascending: false })
    .limit(limit)

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getTopTags({ limit = 10 } = {}) {
  // Count tag occurrences from the last 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('tags')
    .select('tag_name')
    .gte('created_at', since)

  if (error) throw new Error(error.message)

  // Aggregate counts in JS
  const counts = (data ?? []).reduce((acc, { tag_name }) => {
    acc[tag_name] = (acc[tag_name] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }))
}
