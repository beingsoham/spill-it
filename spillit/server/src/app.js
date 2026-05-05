import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'
import helmet     from 'helmet'

import { generalLimiter }     from './middleware/rateLimit.js'
import postsRouter            from './routes/posts.js'
import commentsRouter         from './routes/comments.js'
import usersRouter            from './routes/users.js'
import trendingRouter         from './routes/trending.js'
import notificationsRouter    from './routes/notifications.js'
import likesRouter            from './routes/likes.js'
import { startTrendingCron }  from './jobs/updateTrending.js'

const app  = express()
const PORT = process.env.PORT ?? 4000

// ── Security & parsing ────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin:      process.env.CLIENT_URL ?? 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(generalLimiter)

// ── Health check ──────────────────────────────────────────────
app.get('/health', (_, res) => res.json({
  status: 'ok',
  time:   new Date().toISOString(),
}))

// ── Routes ────────────────────────────────────────────────────
app.use('/api/posts',            postsRouter)
app.use('/api/posts',            commentsRouter)
app.use('/api/users',            usersRouter)
app.use('/api/trending',         trendingRouter)
app.use('/api/notifications',    notificationsRouter)
app.use('/api/likes',             likesRouter)

// ── 404 fallback ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err)
  res.status(500).json({ error: 'Internal server error' })
})

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🫖 SpillIt server running on http://localhost:${PORT}`)
  startTrendingCron()
})

export default app
