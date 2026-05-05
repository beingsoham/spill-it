import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useComments(postId, isOpen) {
  const { user } = useAuthStore()
  const [comments,    setComments]    = useState([])
  const [loading,     setLoading]     = useState(false)
  const [submitting,  setSubmitting]  = useState(false)
  const [content,     setContent]     = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [error,       setError]       = useState(null)

  // Fetch when section opens
  useEffect(() => {
    if (!isOpen || !postId) return
    fetchComments()
    const unsub = subscribeRealtime()
    return unsub
  }, [isOpen, postId])

  async function fetchComments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        is_anonymous,
        created_at,
        user:users (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (!error) setComments(data ?? [])
    setLoading(false)
  }

  function subscribeRealtime() {
    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'comments',
          filter: `post_id=eq.${postId}`,
        },
        async (payload) => {
          // Fetch the full comment row with user join
          const { data } = await supabase
            .from('comments')
            .select(`
              id, content, is_anonymous, created_at,
              user:users (id, username, display_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setComments(prev => {
              // Avoid duplicates
              if (prev.some(c => c.id === data.id)) return prev
              return [...prev, data]
            })
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }

  async function submitComment() {
    if (!content.trim() || !user || submitting) return
    setSubmitting(true)
    setError(null)

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id:      postId,
        user_id:      user.id,
        content:      content.trim(),
        is_anonymous: isAnonymous,
      })

    if (error) {
      setError(error.message)
    } else {
      setContent('')
    }

    setSubmitting(false)
  }

  async function deleteComment(commentId) {
    await supabase.from('comments').delete().eq('id', commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  return {
    comments, loading, submitting, error,
    content, setContent,
    isAnonymous, setIsAnonymous,
    submitComment, deleteComment,
  }
}
