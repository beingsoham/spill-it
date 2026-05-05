import { supabase } from '../db/supabase.js'

export async function createNotification({ userId, type, actorId, postId = null }) {
  // Don't notify yourself
  if (userId === actorId) return

  const { error } = await supabase
    .from('notifications')
    .insert({ user_id: userId, type, actor_id: actorId, post_id: postId })

  if (error) console.error('[Notif] Failed to create:', error.message)
}
