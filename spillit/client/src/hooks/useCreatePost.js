import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

// Extracts #hashtags from post content
function extractTags(text) {
  const matches = text.match(/#[\w]+/g) ?? []
  return [...new Set(matches.map(t => t.toLowerCase()))]
}

export function useCreatePost() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState(null)
  const { user, profile, fetchProfile } = useAuthStore()

  async function submitPost({ content, category, isAnonymous, mediaFile }) {
    if (!user) return { error: 'Not logged in' }

    setSubmitting(true)
    setError(null)

    try {
      // 1 ── Upload media if provided
      let media_url = null
      if (mediaFile) {
        const ext  = mediaFile.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('tea-media')
          .upload(path, mediaFile, { upsert: false })

        if (uploadErr) throw new Error('Media upload failed: ' + uploadErr.message)

        const { data: urlData } = supabase.storage
          .from('tea-media')
          .getPublicUrl(path)
        media_url = urlData.publicUrl
      }

      // 2 ── Insert the post
      const { data: post, error: postErr } = await supabase
        .from('posts')
        .insert({
          user_id:      user.id,
          content:      content.trim(),
          media_url,
          is_anonymous: isAnonymous,
          category,
        })
        .select()
        .single()

      if (postErr) throw new Error(postErr.message)

      // 3 ── Insert tags (fire and forget)
      const tags = extractTags(content)
      if (tags.length > 0) {
        await supabase.from('tags').insert(
          tags.map(tag_name => ({ post_id: post.id, tag_name }))
        )
      }

      // 4 ── Update streak
      const today     = new Date().toISOString().split('T')[0]
      const lastDate  = profile?.last_post_date
      const isConsec  = lastDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]

      await supabase
        .from('users')
        .update({
          last_post_date: today,
          streak_count:   isConsec ? (profile.streak_count ?? 0) + 1 : 1,
        })
        .eq('id', user.id)

      await fetchProfile(user.id)

      return { post, error: null }

    } catch (err) {
      setError(err.message)
      return { post: null, error: err.message }
    } finally {
      setSubmitting(false)
    }
  }

  return { submitPost, submitting, error }
}
