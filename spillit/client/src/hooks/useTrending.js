import { useState, useEffect } from 'react'
import api from '../lib/api'

export function useTrending() {
  const [tags,    setTags]    = useState([])
  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrending()
    const interval = setInterval(fetchTrending, 60000)
    return () => clearInterval(interval)
  }, [])

  async function fetchTrending() {
    try {
      const [tagsRes, postsRes] = await Promise.all([
        api.get('/api/trending/tags?limit=8'),
        api.get('/api/trending/posts?limit=5'),
      ])
      setTags(tagsRes.data.tags ?? [])
      setPosts(postsRes.data.posts ?? [])
    } catch (err) {
      console.error('Trending fetch error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  return { tags, posts, loading }
}
