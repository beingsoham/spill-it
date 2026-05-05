import { Router } from 'express'
import { supabase } from '../db/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { commentLimiter } from '../middleware/rateLimit.js'
import { moderateContent } from '../middleware/moderation.js'
import { createNotification } from '../services/notificationService.js'

const router = Router()

// ── GET /api/posts/:id/comments ───────────────────────────────
router.get('/:postId/comments', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id, content, is_anonymous, created_at,
        user:users (id, username, display_name, avatar_url)
      `)
      .eq('post_id', req.params.postId)
      .order('created_at', { ascending: true })

    if (error) throw error
    res.json({ comments: data ?? [] })

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
})

// ── POST /api/posts/:id/comments ──────────────────────────────
router.post('/:postId/comments', requireAuth, commentLimiter, moderateContent, async (req, res) => {
  try {
    const { content, is_anonymous = false } = req.body
    const postId = req.params.postId

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        post_id:      postId,
        user_id:      req.user.id,
        content:      content.trim(),
        is_anonymous,
      })
      .select(`
        id, content, is_anonymous, created_at,
        user:users (id, username, display_name, avatar_url)
      `)
      .single()

    if (error) throw error

    // Notify post owner
    const { data: post } = await supabase
      .from('posts').select('user_id').eq('id', postId).single()

    if (post) {
      await createNotification({
        userId:  post.user_id,
        type:    'comment',
        actorId: req.user.id,
        postId,
      })
    }

    res.status(201).json({ comment })

  } catch (err) {
    console.error('[Comments POST]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── DELETE /api/posts/:postId/comments/:commentId ─────────────
router.delete('/:postId/comments/:commentId', requireAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .match({ id: req.params.commentId, user_id: req.user.id })

    if (error) throw error
    res.json({ success: true })

  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' })
  }
})

export default router
