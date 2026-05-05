import { Router } from 'express'
import { supabase } from '../db/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ── GET /api/notifications ────────────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        id, type, is_read, created_at,
        actor:users!actor_id (id, username, display_name, avatar_url),
        post:posts (id, content)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) throw error
    res.json({ notifications: data ?? [] })

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
})

// ── PATCH /api/notifications/read-all ────────────────────────
router.patch('/read-all', requireAuth, async (req, res) => {
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.user.id)
      .eq('is_read', false)

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notifications read' })
  }
})

export default router
