import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useFeedStore } from '../store/feedStore'

export function useFeedRealtime() {
  const prependPost = useFeedStore(s => s.prependPost)

  useEffect(() => {
    const channel = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          prependPost(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [prependPost])
}
