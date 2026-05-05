import { useState, useEffect } from 'react'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'

export function useNotifications() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState([])
  const [loading,       setLoading]       = useState(true)
  const [unreadCount,   setUnreadCount]   = useState(0)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }
    fetchNotifications()
  }, [user])

  async function fetchNotifications() {
    try {
      const { data } = await api.get('/api/notifications')
      setNotifications(data.notifications ?? [])
      setUnreadCount((data.notifications ?? []).filter(n => !n.is_read).length)
    } catch (err) {
      console.error('Notifications error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  async function markAllRead() {
    if (!user) return
    try {
      await api.patch('/api/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Mark read error:', err.message)
    }
  }

  return { notifications, loading, unreadCount, markAllRead, refetch: fetchNotifications }
}
