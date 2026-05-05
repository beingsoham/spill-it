import { create } from 'zustand'
import api from '../lib/api'

export const useFeedStore = create((set, get) => ({
  posts:       [],
  loading:     false,
  hasMore:     true,
  page:        0,
  filter:      'hot',
  newTeaCount: 0,
  error:       null,

  setFilter(filter) {
    set({ filter, posts: [], page: 0, hasMore: true, newTeaCount: 0, error: null })
    get().fetchPosts(true)
  },

  async fetchPosts(reset = false) {
    const { loading, hasMore, page, filter, error } = get()

    if (loading) return
    if (!reset && !hasMore) return
    if (!reset && error) return

    set({ loading: true, error: null })
    const limit  = 10
    const p      = reset ? 0 : page

    try {
      const { data } = await api.get('/api/posts', {
        params: { filter, page: p, limit },
      })

      set(state => ({
        posts:   reset ? data.posts : [...state.posts, ...data.posts],
        loading: false,
        hasMore: data.hasMore,
        page:    reset ? 1 : state.page + 1,
        error:   null,
      }))
    } catch (err) {
      console.error('Feed fetch error:', err.message)
      set({ loading: false, hasMore: false, error: err.message })
    }
  },

  prependPost(newPost) {
    if (get().posts.some(p => p.id === newPost.id)) return
    set(state => ({ newTeaCount: state.newTeaCount + 1 }))
  },

  flushNewTea() {
    set({ newTeaCount: 0, posts: [], page: 0, error: null })
    get().fetchPosts(true)
  },

  async toggleLike(postId, liked) {
    try {
      await api.post(`/api/likes/${postId}`)
    } catch (err) {
      console.error('Like failed:', err.message)
    }
  },
}))
