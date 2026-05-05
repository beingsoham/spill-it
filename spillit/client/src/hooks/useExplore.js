import { useState, useEffect, useRef } from 'react'
import api from '../lib/api'

export function useExplore() {
  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState(null)
  const [posts,    setPosts]    = useState([])
  const [loading,  setLoading]  = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    fetchPosts()
  }, [category])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchPosts(), 400)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  async function fetchPosts() {
    setLoading(true)
    try {
      const params = { filter: 'hot', limit: 20 }
      if (category) params.category = category
      if (query.trim()) params.q = query.trim()

      const { data } = await api.get('/api/posts', { params })
      setPosts(data.posts ?? [])
    } catch (err) {
      console.error('Explore error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  return { query, setQuery, category, setCategory, posts, loading }
}
