/**
 * API Configuration - Sara Learning Platform
 * Optimized API client with Sara branding and single-topic architecture
 */

import axios from 'axios'

// Sara API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sara_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on login/signup pages
      const currentPath = window.location.pathname
      const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(currentPath)
      
      if (!isAuthPage) {
        localStorage.removeItem('sara_token')
        localStorage.removeItem('sara_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ============ SARA API FUNCTIONS ============

// Authentication
export const auth = {
  login: (usernameOrEmail, password) => 
    api.post('/auth/login', { usernameOrEmail, password }),
  
  signup: (username, email, name, password, confirmPassword) => 
    api.post('/auth/signup', { username, email, name, password, confirmPassword }),
  
  forgotPassword: (usernameOrEmail) => 
    api.post('/auth/forgot-password', { usernameOrEmail }),
  
  resetPassword: (token, password, confirmPassword) => 
    api.post('/auth/reset-password', { token, password, confirmPassword }),
  
  getProfile: () => api.get('/auth/profile'),
  
  updateProfile: (updates) => api.put('/auth/profile', updates),
  
  logout: () => api.post('/auth/logout'),
  
  validate: () => api.get('/auth/validate')
}

// Learning API - Single-topic architecture
export const learning = {
  // Get all courses
  getCourses: () => api.get('/learn/courses'),
  
  // Get all topics
  getTopics: () => api.get('/learn/topics'),
  
  // Get specific topic details
  getTopic: (topicId) => api.get(`/learn/topic/${topicId}`),
  
  // Get session state for a topic
  getState: (topicId) => api.get(`/learn/state/${topicId}`),

  // Start session for a topic
  startSession: (topicId, assignments = []) => 
    api.post('/learn/session/start', { topicId, assignments }),

  // Session chat
  sessionChat: (topicId, message) => 
    api.post('/chat/session', { topicId, message }),

  // Playtime
  startPlaytime: (topicId) => 
    api.post('/learn/playtime/start', { topicId }),

  completePlaytime: (topicId) => 
    api.post('/learn/playtime/complete', { topicId }),

  playtimeChat: (topicId, message) => 
    api.post('/chat/playtime', { topicId, message }),

  // Assignments
  startAssignments: (topicId) => 
    api.post('/learn/assignment/start', { topicId }),

  completeAssignment: (topicId, assignmentIndex, code) => 
    api.post('/learn/assignment/complete', { topicId, assignmentIndex, code }),

  // Code execution
  executeCode: (code, topicId, assignmentIndex = null) => 
    api.post('/learn/execute', { code, topicId, assignmentIndex }),

  getHint: (topicId, assignment, userCode = '') => 
    api.post('/chat/assignment/hint', { topicId, assignment, userCode }),

  // Feedback
  getFeedback: (topicId, userCode, assignment) => 
    api.post('/chat/feedback', { topicId, userCode, assignment }),

  // Continue learning
  getContinueLearning: () => api.get('/learn/continue')
}

// Progress API
export const progress = {
  getAll: () => api.get('/learn/progress', { 
    params: { _t: Date.now() } // Cache busting
  }),
  getSummary: () => api.get('/learn/progress/summary'),
  resetAll: () => api.delete('/learn/debug/reset-progress'),
  clearCache: () => api.post('/learn/debug/clear-cache'),
  debugAllSources: () => api.get('/learn/debug/all-data-sources'),
  debugTopic: (topicId) => api.get(`/learn/debug/progress/${topicId}`)
}

// Chat History API
export const chat = {
  getHistory: (topicId) => api.get(`/chat/history/${topicId}`),
  clearHistory: (topicId) => api.delete(`/chat/history/${topicId}`)
}

// ============ HELPER FUNCTIONS ============

// Token management
export const getToken = () => localStorage.getItem('sara_token')
export const setToken = (token) => localStorage.setItem('sara_token', token)
export const removeToken = () => localStorage.removeItem('sara_token')

// User management
export const getUser = () => {
  const user = localStorage.getItem('sara_user')
  return user ? JSON.parse(user) : null
}
export const setUser = (user) => localStorage.setItem('sara_user', JSON.stringify(user))
export const removeUser = () => localStorage.removeItem('sara_user')

// Simplified error handling
export const handleApiError = (error, defaultMessage = 'Something went wrong') => {
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return defaultMessage
}

// Retry logic for failed requests
export const retryApiCall = async (apiCall, maxRetries = 2) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }
}

// ============ REQUEST BATCHING ============

// Batch multiple API calls for better performance
export const batchRequests = async (requests) => {
  try {
    const results = await Promise.allSettled(requests)
    return results.map((result, index) => ({
      index,
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null
    }))
  } catch (error) {
    console.error('Batch request error:', error)
    throw error
  }
}

// ============ CACHING LAYER ============

// Simple in-memory cache for static data
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const cachedRequest = async (key, apiCall, ttl = CACHE_TTL) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data
  }

  try {
    const response = await apiCall()
    cache.set(key, {
      data: response,
      timestamp: Date.now()
    })
    return response
  } catch (error) {
    // Return cached data if available, even if expired
    if (cached) {
      console.warn('Using expired cache due to API error:', error.message)
      return cached.data
    }
    throw error
  }
}

// Clear cache
export const clearCache = () => {
  cache.clear()
  console.log('🧹 Frontend cache cleared')
}

// Make clearCache available globally for debugging
if (typeof window !== 'undefined') {
  window.clearCache = clearCache
}

// ============ PERFORMANCE MONITORING ============

// Track API performance
const performanceMetrics = {
  requests: 0,
  totalTime: 0,
  errors: 0
}

api.interceptors.request.use((config) => {
  config.startTime = Date.now()
  return config
})

api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.startTime
    performanceMetrics.requests++
    performanceMetrics.totalTime += duration
    
    // Log slow requests
    if (duration > 3000) {
      console.warn(`Slow API request: ${response.config.url} took ${duration}ms`)
    }
    
    return response
  },
  (error) => {
    performanceMetrics.errors++
    return Promise.reject(error)
  }
)

export const getApiMetrics = () => ({
  ...performanceMetrics,
  averageTime: performanceMetrics.requests > 0 
    ? Math.round(performanceMetrics.totalTime / performanceMetrics.requests) 
    : 0,
  errorRate: performanceMetrics.requests > 0 
    ? Math.round((performanceMetrics.errors / performanceMetrics.requests) * 100) 
    : 0
})

// ============ STORAGE UTILITIES ============

// Get storage key with Sara prefix
export const getStorageKey = (topicId, key) => `sara_${topicId}_${key}`

// Clear all Sara-related storage
export const clearSaraStorage = () => {
  const keys = Object.keys(localStorage)
  keys.forEach(key => {
    if (key.startsWith('sara_')) {
      localStorage.removeItem(key)
    }
  })
}

export default api