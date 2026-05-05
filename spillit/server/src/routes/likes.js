import { Router } from 'express'
import { supabase } from '../db/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { createNotification } from '../services/notificationService.js'

const router = Router()

// POST /api/likes/:postId
router.post('/:postId', requireAuth, async (req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.user.id

    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .match({ post_id: postId, user_id: userId })
      .single()

    if (existing) {
      await supabase.from('likes').delete()
        .match({ post_id: postId, user_id: userId })
      return res.json({ liked: false })
    }

    await supabase.from('likes').insert({ post_id: postId, user_id: userId })

    const { data: post } = await supabase
      .from('posts').select('user_id').eq('id', postId).single()

    if (post) {
      await createNotification({
        userId:  post.user_id,
        type:    'like',
        actorId: userId,
        postId,
      })
    }

    res.json({ liked: true })

  } catch (err) {
    res.status(500).json({ error: 'Like action failed' })
  }
})

export default router
