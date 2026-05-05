import cron from 'node-cron'
import { refreshTrendingScores } from '../services/trendingService.js'

// Run every 5 minutes
export function startTrendingCron() {
  cron.schedule('*/5 * * * *', async () => {
    await refreshTrendingScores()
  })
  console.log('[Cron] Trending score job scheduled (every 5 min)')
}
