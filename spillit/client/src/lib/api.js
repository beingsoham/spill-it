import axios from 'axios'
import { supabase } from './supabase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }

  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.error ?? err.message
    console.error('[API Error]', message)
    return Promise.reject(new Error(message))
  }
)

export default api
