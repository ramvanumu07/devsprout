import axios from 'axios'

// Optimized API configuration with simplified endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

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
    const token = localStorage.getItem('token')
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
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ============ OPTIMIZED API FUNCTIONS ============

// Authentication (fixed to match backend)
export const auth = {
  login: (studentId, password) => api.post('/auth/login', { studentId, password }),
  register: (studentId, password, name) => api.post('/auth/register', { studentId, password, name }),
  verify: () => api.get('/auth/verify')
}

// Learning API - Simplified calls
export const learning = {
  // Get session state (simplified response)
  getState: (topicId, subtopicId) => 
    api.get(`/learn/state/${topicId}/${subtopicId}`),

  // Start session (complete request body)
  startSession: (topicId, subtopicId, subtopicTitle, assignments) => 
    api.post('/learn/session/start', { topicId, subtopicId, subtopicTitle, assignments }),

  // Session chat (industry-level: minimal payload)
  sessionChat: (topicId, subtopicId, message) => 
    api.post('/chat/session', { topicId, subtopicId, message }),

  // Playtime
  startPlaytime: (topicId, subtopicId) => 
    api.post('/learn/playtime/start', { topicId, subtopicId }),

  executeCode: (code) => 
    api.post('/learn/playtime/execute', { code }),

  playtimeChat: (topicId, subtopicId, message, currentCode = '') => 
    api.post('/chat/playground', { topicId, subtopicId, message, currentCode }),

  // Assignments
  startAssignments: (topicId, subtopicId) => 
    api.post('/learn/assignment/start', { topicId, subtopicId }),

  getHint: (topicId, subtopicId, assignmentTitle, currentCode, hintLevel) => 
    api.post('/chat/assignment/hint', { 
      topicId, subtopicId, assignmentTitle, currentCode, hintLevel 
    }),

  runAssignment: (code) => 
    api.post('/learn/assignment/run', { code }),

  submitAssignment: (topicId, subtopicId, code, assignmentIndex) => 
    api.post('/learn/assignment/submit', { topicId, subtopicId, code, assignmentIndex }),

  // Feedback
  generateFeedback: (topicId, subtopicId, assignmentIndex, subtopicTitle, assignmentTitle) => 
    api.post('/chat/feedback', { 
      topicId, subtopicId, assignmentIndex, subtopicTitle, assignmentTitle 
    }),

  continueFeedback: (topicId, subtopicId) => 
    api.post('/chat/feedback', { topicId, subtopicId })
}

// Progress API (simplified)
export const progress = {
  getAll: () => api.get('/progress')
}

// ============ HELPER FUNCTIONS ============

// Simplified error handling
export const handleApiError = (error, defaultMessage = 'Something went wrong') => {
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

// ============ OPTIMIZED REQUEST BATCHING ============

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

export default api