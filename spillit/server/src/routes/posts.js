import { Router } from 'express'
import { supabase } from '../db/supabase.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'
import { postLimiter } from '../middleware/rateLimit.js'
import { moderateContent } from '../middleware/moderation.js'

const router = Router()

// ── GET /api/posts — paginated feed ──────────────────────────
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      filter   = 'hot',
      page     = 0,
      limit    = 10,
      category = null,
      q        = null,
    } = req.query

    const pageNum   = Math.max(0, parseInt(page))
    const limitNum  = Math.min(50, Math.max(1, parseInt(limit)))
    const offset    = pageNum * limitNum

    let query = supabase
      .from('posts_with_counts')
      .select('*')
      .range(offset, offset + limitNum - 1)

    // Filters
    if (filter === 'hot')   query = query.order('temp_score',  { ascending: false })
    if (filter === 'fresh') query = query.order('created_at',  { ascending: false })
    if (filter === 'cold')  query = query.lt('temp_score', 20).order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)

    // Search by content or tag
    if (q && String(q).trim()) {
      const raw = String(q).trim()

      if (raw.startsWith('#')) {
        const tagQuery = raw.replace(/^#+/, '').toLowerCase()
        if (tagQuery) {
          const { data: tagRows, error: tagError } = await supabase
            .from('tags')
            .select('post_id')
            .ilike('tag_name', `%${tagQuery}%`)

          if (tagError) throw tagError

          const postIds = [...new Set((tagRows ?? []).map(t => t.post_id))]
          if (postIds.length === 0) {
            return res.json({ posts: [], hasMore: false })
          }

          query = query.in('id', postIds)
        }
      } else {
        query = query.ilike('content', `%${raw}%`)
      }
    }

    const { data, error } = await query
    if (error) throw error

    // If user is logged in, attach liked_by_me flag
    let posts = data ?? []
    if (req.user && posts.length > 0) {
      const postIds = posts.map(p => p.id)
      const { data: likes } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', req.user.id)
        .in('post_id', postIds)

      const likedSet = new Set((likes ?? []).map(l => l.post_id))
      posts = posts.map(p => ({ ...p, liked_by_me: likedSet.has(p.id) }))
    }

    res.json({ posts, hasMore: posts.length === limitNum })

  } catch (err) {
    console.error('[Posts GET]', err.message)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// ── GET /api/posts/:id — single post ─────────────────────────
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts_with_counts')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Post not found' })

    let post = data
    if (req.user) {
      const { data: like } = await supabase
        .from('likes')
        .select('post_id')
        .match({ post_id: data.id, user_id: req.user.id })
        .single()
      post = { ...post, liked_by_me: !!like }
    }

    res.json({ post })

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// ── POST /api/posts — create post ────────────────────────────
router.post('/', requireAuth, postLimiter, moderateContent, async (req, res) => {
  try {
    const { content, category = 'Other', is_anonymous = false, media_url = null } = req.body

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id:      req.user.id,
        content:      content.trim(),
        category,
        is_anonymous,
        media_url,
        status:       'active',
      })
      .select()
      .single()

    if (error) throw error

    // Extract and save hashtags
    const tags = [...new Set((content.match(/#[\w]+/g) ?? [])
      .map(t => t.toLowerCase()))]

    if (tags.length > 0) {
      await supabase.from('tags').insert(
        tags.map(tag_name => ({ post_id: post.id, tag_name }))
      )
    }

    // Update streak
    const today     = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const { data: profile } = await supabase
      .from('users').select('streak_count, last_post_date').eq('id', req.user.id).single()

    const isConsec = profile?.last_post_date === yesterday
    await supabase.from('users').update({
      last_post_date: today,
      streak_count:   isConsec ? (profile.streak_count ?? 0) + 1 : 1,
    }).eq('id', req.user.id)

    res.status(201).json({ post })

  } catch (err) {
    console.error('[Posts POST]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── DELETE /api/posts/:id ─────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .match({ id: req.params.id, user_id: req.user.id })

    if (error) throw error
    res.json({ success: true })

  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

// ── POST /api/posts/:id/flag ──────────────────────────────────
router.post('/:id/flag', requireAuth, async (req, res) => {
  try {
    const { data: post } = await supabase
      .from('posts')
      .select('flag_count, status')
      .eq('id', req.params.id)
      .single()

    if (!post) return res.status(404).json({ error: 'Post not found' })

    const newCount = (post.flag_count ?? 0) + 1
    const update   = { flag_count: newCount }

    // Auto-hide after 3 flags
    if (newCount >= 3) update.status = 'hidden'

    await supabase.from('posts').update(update).eq('id', req.params.id)

    res.json({ flagged: true, hidden: newCount >= 3 })

  } catch (err) {
    res.status(500).json({ error: 'Flag action failed' })
  }
})

export default router
