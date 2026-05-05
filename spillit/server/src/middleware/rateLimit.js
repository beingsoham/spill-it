import rateLimit from 'express-rate-limit'

// General API — 100 requests per minute per IP
export const generalLimiter = rateLimit({
  windowMs:    60 * 1000,
  max:         100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many requests, slow down ☕' },
})

// Post creation — max 10 posts per 10 minutes
export const postLimiter = rateLimit({
  windowMs:    10 * 60 * 1000,
  max:         10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Posting too fast — take a breath 🫖' },
})

// Comment creation — max 30 per 10 minutes
export const commentLimiter = rateLimit({
  windowMs:    10 * 60 * 1000,
  max:         30,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Slow down on the replies 💬' },
})

// Auth endpoints — max 10 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs:    15 * 60 * 1000,
  max:         10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many auth attempts, try later' },
})
