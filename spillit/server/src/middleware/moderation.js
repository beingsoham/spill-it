// Basic blocklist — extend as needed
const BLOCKLIST = [
  'slur1', 'slur2',
]

const BLOCKLIST_RE = new RegExp(
  BLOCKLIST.map(w => `\\b${w}\\b`).join('|'),
  'i'
)

export function moderateContent(req, res, next) {
  const { content } = req.body

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Content is required' })
  }

  if (content.trim().length < 1) {
    return res.status(400).json({ error: 'Content cannot be empty' })
  }

  if (content.length > 500) {
    return res.status(400).json({ error: 'Content too long (max 500 chars)' })
  }

  if (BLOCKLIST.length > 0 && BLOCKLIST_RE.test(content)) {
    return res.status(400).json({ error: 'Content violates community guidelines' })
  }

  next()
}
