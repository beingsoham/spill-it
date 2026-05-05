import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import styles from './AuthPage.module.css'

export default function AuthPage() {
  const [mode, setMode]       = useState('signin')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [busy, setBusy]       = useState(false)
  const [done, setDone]       = useState(false)

  const { signIn, signUp }    = useAuthStore()
  const navigate              = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)

    const fn = mode === 'signin' ? signIn : signUp
    const { error: err } = await fn(email, password)

    setBusy(false)
    if (err) { setError(err.message); return }

    if (mode === 'signup') {
      setDone(true)
    } else {
      navigate('/')
    }
  }

  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
          <h2 className={`font-display ${styles.title}`}>Check your email</h2>
          <p className={styles.sub}>
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then come back to sign in.
          </p>
          <button className={`btn btn-ghost ${styles.switchBtn}`}
            onClick={() => { setDone(false); setMode('signin') }}>
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Logo */}
        <h1 className={`font-display gradient-text ${styles.logo}`}>
          SpillIt ☕
        </h1>
        <p className={styles.sub}>
          {mode === 'signin'
            ? 'Sign in to see what\'s brewing'
            : 'Join the tea party'}
        </p>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className={styles.input}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={`btn btn-primary ${styles.submit}`}
            disabled={busy}
          >
            {busy
              ? 'Brewing...'
              : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Switch mode */}
        <p className={styles.switchText}>
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button
            className={styles.switchLink}
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

      </div>
    </div>
  )
}
