import { Router } from 'express'
import { getTopTrending, getTopTags } from '../services/trendingService.js'

const router = Router()

// ── GET /api/trending/posts ───────────────────────────────────
router.get('/posts', async (req, res) => {
  try {
    const { limit = 10, category } = req.query
    const posts = await getTopTrending({ limit: parseInt(limit), category })
    res.json({ posts })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending posts' })
  }
})

// ── GET /api/trending/tags ────────────────────────────────────
router.get('/tags', async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const tags = await getTopTags({ limit: parseInt(limit) })
    res.json({ tags })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending tags' })
  }
})

export default router
