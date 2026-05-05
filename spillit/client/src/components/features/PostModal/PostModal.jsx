import { useState, useRef, useEffect } from 'react'
import { usePostModal }   from '../../../hooks/usePostModal'
import { useCreatePost }  from '../../../hooks/useCreatePost'
import { useAuthStore }   from '../../../store/authStore'
import { useFeedStore }   from '../../../store/feedStore'
import CategoryPicker     from './CategoryPicker'
import MediaPreview       from './MediaPreview'
import Avatar             from '../TeaCard/Avatar'
import styles             from './PostModal.module.css'

const MAX_CHARS = 500

export default function PostModal() {
  const { isOpen, close }            = usePostModal()
  const { profile }                  = useAuthStore()
  const { fetchPosts }               = useFeedStore()
  const { submitPost, submitting }   = useCreatePost()

  const [content,     setContent]     = useState('')
  const [category,    setCategory]    = useState('Other')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [mediaFile,   setMediaFile]   = useState(null)
  const [success,     setSuccess]     = useState(false)
  const [err,         setErr]         = useState('')

  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const overlayRef  = useRef(null)

  const remaining = MAX_CHARS - content.length
  const canSubmit = content.trim().length > 0 && !submitting

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function handleClose() {
    if (submitting) return
    close()
    // Reset form after transition
    setTimeout(resetForm, 300)
  }

  function resetForm() {
    setContent('')
    setCategory('Other')
    setIsAnonymous(false)
    setMediaFile(null)
    setSuccess(false)
    setErr('')
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) handleClose()
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setErr('Image must be under 5MB'); return }
    setMediaFile(file)
    setErr('')
  }

  // Auto-grow textarea
  function handleTextChange(e) {
    const val = e.target.value
    if (val.length > MAX_CHARS) return
    setContent(val)
    // auto-resize
    const ta = textareaRef.current
    if (ta) { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px' }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')

    const { error } = await submitPost({ content, category, isAnonymous, mediaFile })
    if (error) { setErr(error); return }

    setSuccess(true)
    // Refresh the feed, then close
    fetchPosts(true)
    setTimeout(handleClose, 1200)
  }

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Create new tea"
    >
      <div className={`${styles.sheet} ${isOpen ? styles.open : ''}`}>

        {/* ── Drag handle ── */}
        <div className={styles.handle} />

        {/* ── Header ── */}
        <div className={styles.header}>
          <button
            type="button"
            className={`btn btn-ghost ${styles.cancelBtn}`}
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </button>

          <span className={`font-display ${styles.title}`}>New Spill</span>

          <button
            type="button"
            className={`btn btn-primary ${styles.spillBtn}`}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {submitting ? (
              <span className={styles.spinner} />
            ) : success ? (
              '✓ Spilled!'
            ) : (
              '🫖 Spill'
            )}
          </button>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* User row */}
          <div className={styles.userRow}>
            <Avatar
              user={isAnonymous ? null : (profile ? {
                display_name: profile.display_name,
                avatar_url:   profile.avatar_url,
              } : null)}
              size="md"
            />
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {isAnonymous ? 'Posting anonymously' : `@${profile?.username ?? '...'}`}
              </span>
              {isAnonymous && (
                <span className={styles.anonNote}>Your identity is hidden</span>
              )}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            placeholder="What's the tea? ☕ Spill it..."
            value={content}
            onChange={handleTextChange}
            rows={4}
            disabled={submitting}
          />

          {/* Media preview */}
          {mediaFile && (
            <MediaPreview
              file={mediaFile}
              onRemove={() => { setMediaFile(null); fileInputRef.current.value = '' }}
            />
          )}

          {/* Error */}
          {err && <p className={styles.err}>{err}</p>}

          {/* ── Toolbar ── */}
          <div className={styles.toolbar}>

            {/* Image upload */}
            <button
              type="button"
              className={`${styles.toolBtn} ${mediaFile ? styles.toolActive : ''}`}
              onClick={() => fileInputRef.current?.click()}
              title="Add image"
              disabled={submitting}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="16" height="12" rx="2" />
                <circle cx="7" cy="9" r="1.5" />
                <path d="M2 14l4-4 3 3 2-2 5 5" />
              </svg>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleFileChange}
            />

            {/* Anonymous toggle */}
            <button
              type="button"
              className={`${styles.anonToggle} ${isAnonymous ? styles.anonOn : ''}`}
              onClick={() => setIsAnonymous(v => !v)}
              disabled={submitting}
            >
              <div className={`${styles.toggleTrack} ${isAnonymous ? styles.toggleOn : ''}`}>
                <div className={styles.toggleThumb} />
              </div>
              <span>Anonymous</span>
            </button>

            {/* Character counter */}
            <div
              className={`${styles.charCount} font-mono
                ${remaining < 50 ? styles.charWarn : ''}
                ${remaining < 20 ? styles.charDanger : ''}`}
            >
              {remaining}
            </div>
          </div>

          {/* Category picker */}
          <div className={styles.divider} />
          <CategoryPicker value={category} onChange={setCategory} />

        </div>
      </div>
    </div>
  )
}
