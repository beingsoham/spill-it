import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

import MainLayout        from './layouts/MainLayout'
import FeedPage          from './pages/FeedPage'
import ExplorePage       from './pages/ExplorePage'
import ProfilePage       from './pages/ProfilePage'
import NotificationsPage from './pages/NotificationsPage'
import AuthPage          from './pages/AuthPage'

export default function App() {
  const { user, loading, init } = useAuthStore()

  // Boot the auth listener once
  useEffect(() => { init() }, [init])

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--text-muted)',
        fontSize: 14,
        gap: 10,
      }}>
        <span style={{ fontSize: 24 }}>☕</span> Brewing...
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*"     element={<Navigate to="/auth" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index                      element={<FeedPage />} />
        <Route path="/explore"            element={<ExplorePage />} />
        <Route path="/profile"            element={<ProfilePage />} />
        <Route path="/profile/:username"  element={<ProfilePage />} />
        <Route path="/notifications"      element={<NotificationsPage />} />
      </Route>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*"     element={<Navigate to="/" replace />} />
    </Routes>
  )
}
