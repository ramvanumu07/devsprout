/**
 * Database Service - Sara Learning Platform
 * Industry-level database operations with single-topic architecture
 */

import { createClient } from '@supabase/supabase-js'
import { withPerformanceLogging, progressCache } from '../middleware/performance.js'

// ============ SUPABASE CLIENT ============
let supabase = null

// Development mode fallback data
const DEV_USERS = new Map()
const DEV_PROGRESS = new Map()
const DEV_CHAT_SESSIONS = new Map()

// Initialize database connection
function initializeDatabase() {
  if (supabase) return supabase

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  // Check if we have placeholder values (development mode)
  const isPlaceholderConfig = !supabaseUrl || !supabaseKey || 
    supabaseUrl.includes('your_') || supabaseKey.includes('your_')

  if (isPlaceholderConfig) {
    console.log(`[${new Date().toISOString()}] ⚠️  Running in DEVELOPMENT MODE - Using in-memory database`)
    console.log(`[${new Date().toISOString()}] 📝 To use Supabase, update SUPABASE_URL and SUPABASE_SERVICE_KEY in .env`)
    return 'DEV_MODE' // Special marker for development mode
  }

  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      db: {
        schema: 'public'
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          'x-application-name': 'sara-api'
        }
      }
    })
    console.log(`[${new Date().toISOString()}] ✅ Sara database connected with performance optimizations`)
    return supabase
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Database connection failed:`, error)
    throw error
  }
}

// ============ USER OPERATIONS ============

export async function createUser(username, email, name, hashedPassword, securityQuestion = null, securityAnswer = null) {
  const client = initializeDatabase()
  
  // Development mode fallback
  if (client === 'DEV_MODE') {
    // Check for existing users
    if (DEV_USERS.has(username)) {
      throw new Error('Username already exists')
    }
    for (const user of DEV_USERS.values()) {
      if (user.email === email) {
        throw new Error('Email already exists')
      }
    }
    
    const userId = Date.now().toString()
    const user = {
      id: userId,
      username,
      email,
      name,
      password: hashedPassword,
      security_question: securityQuestion,
      security_answer: securityAnswer,
      has_access: true,
      email_verified: false, // Match schema default
      created_at: new Date().toISOString()
    }
    DEV_USERS.set(username, user)
    console.log(`[DEV] Created user: ${username}`)
    return user
  }

  // Prepare user data - only include security fields if provided
  const userData = {
    username,
    email,
    name,
    password: hashedPassword,
    has_access: true, // Default access for Sara
    email_verified: false // Explicit default
  }

  // Only add security fields if they're provided (avoid storing empty strings)
  if (securityQuestion && securityQuestion.trim()) {
    userData.security_question = securityQuestion.trim()
  }
  if (securityAnswer && securityAnswer.trim()) {
    userData.security_answer = securityAnswer.trim()
  }

  const { data, error } = await client
    .from('users')
    .insert(userData)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      if (error.message.includes('username')) {
        throw new Error('Username already exists')
      }
      if (error.message.includes('email')) {
        throw new Error('Email already exists')
      }
    }
    throw new Error(`Failed to create user: ${error.message}`)
  }
  return data
}

export async function getUserById(userId) {
  console.log(`🔍 [DB] Searching for user with ID: "${userId}"`)
  const client = initializeDatabase()
  
  // Development mode fallback
  if (client === 'DEV_MODE') {
    for (const user of DEV_USERS.values()) {
      if (user.id === userId) {
        console.log(`[DEV] Get user by ID: ${userId} - Found`)
        return user
      }
    }
    console.log(`[DEV] Get user by ID: ${userId} - Not found`)
    return null
  }

  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      console.log(`🔍 [DB] No user found with ID: "${userId}"`)
      return null
    } else {
      console.error(`❌ [DB] Database error searching for user ID "${userId}":`, error)
      throw new Error(`Failed to get user by ID: ${error.message}`)
    }
  }
  
  console.log(`✅ [DB] User found: ${data.username} (ID: ${data.id})`)
  return data
}

export async function getUserByUsername(username) {
  console.log(`🔍 [DB] Searching for user with username: "${username}"`)
  const client = initializeDatabase()
  
  // Development mode fallback
  if (client === 'DEV_MODE') {
    const user = DEV_USERS.get(username)
    console.log(`[DEV] Get user by username: ${username} - ${user ? 'Found' : 'Not found'}`)
    return user || null
  }

  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      console.log(`🔍 [DB] No user found with username: "${username}"`)
      return null
    } else {
      console.error(`❌ [DB] Database error searching for username "${username}":`, error)
      throw new Error(`Failed to get user by username: ${error.message}`)
    }
  }
  
  console.log(`✅ [DB] User found: ${data.username} (ID: ${data.id})`)
  return data
}

export async function getUserByEmail(email) {
  const client = initializeDatabase()
  
  // Development mode fallback
  if (client === 'DEV_MODE') {
    for (const user of DEV_USERS.values()) {
      if (user.email === email) {
        console.log(`[DEV] Get user by email: ${email} - Found`)
        return user
      }
    }
    console.log(`[DEV] Get user by email: ${email} - Not found`)
    return null
  }

  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get user by email: ${error.message}`)
  }
  return data
}

export async function getUserByStudentId(studentId) {
  // Legacy compatibility - map to username
  return await getUserByUsername(studentId)
}

export async function updateUserProfile(userId, updates) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      if (error.message.includes('username')) {
        throw new Error('Username already exists')
      }
      if (error.message.includes('email')) {
        throw new Error('Email already exists')
      }
    }
    throw new Error(`Failed to update user profile: ${error.message}`)
  }
  return data
}

export async function updateUserAccess(userId, hasAccess, expiresAt = null) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('users')
    .update({
      has_access: hasAccess,
      access_expires_at: expiresAt,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update user access: ${error.message}`)
  return data
}

export async function updateLastLogin(userId) {
  const client = initializeDatabase()
  const { error } = await client
    .from('users')
    .update({
      last_login: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) throw new Error(`Failed to update last login: ${error.message}`)
}

export async function getAllUsers() {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('users')
    .select('id, username, email, name, has_access, access_expires_at, last_login, created_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to get users: ${error.message}`)
  return data || []
}

export async function isAdmin(userId) {
  const client = initializeDatabase()
  const { data } = await client
    .from('admins')
    .select('id')
    .eq('user_id', userId)
    .single()

  return !!data
}

// ============ PROGRESS OPERATIONS ============

export async function getProgress(userId, topicId) {
  const cacheKey = `progress:${userId}:${topicId}`

  // Check cache first
  const cached = progressCache.get(cacheKey)
  if (cached) {
    console.log(`[${new Date().toISOString()}] 🚀 CACHE HIT: Progress for ${topicId}`)
    return cached
  }

  return await withPerformanceLogging(async () => {
    const client = initializeDatabase()
    
    // Development mode fallback
    if (client === 'DEV_MODE') {
      const progressKey = `${userId}:${topicId}`
      const progress = DEV_PROGRESS.get(progressKey)
      console.log(`[DEV] Get progress: ${progressKey} - ${progress ? 'Found' : 'Not found'}`)
      if (progress) {
        progressCache.set(cacheKey, progress)
      }
      return progress || null
    }

    const { data, error } = await client
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get progress: ${error.message}`)
    }

    // Cache the result
    if (data) {
      progressCache.set(cacheKey, data)
    }

    return data
  }, `getProgress(${topicId})`)
}

export async function upsertProgress(userId, topicId, updates) {
  return await withPerformanceLogging(async () => {
    const client = initializeDatabase()
    
    // Development mode fallback
    if (client === 'DEV_MODE') {
      const progressKey = `${userId}:${topicId}`
      const existingProgress = DEV_PROGRESS.get(progressKey) || {}
      const newProgress = {
        user_id: userId,
        topic_id: topicId,
        ...existingProgress,
        ...updates,
        last_accessed: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      DEV_PROGRESS.set(progressKey, newProgress)
      
      // Update cache
      const cacheKey = `progress:${userId}:${topicId}`
      progressCache.set(cacheKey, newProgress)
      
      console.log(`[DEV] Upserted progress: ${progressKey}`)
      return newProgress
    }

    const { data, error } = await client
      .from('progress')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        ...updates,
        last_accessed: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,topic_id' })
      .select()
      .single()

    if (error) throw new Error(`Failed to update progress: ${error.message}`)

    // Invalidate and update cache
    const cacheKey = `progress:${userId}:${topicId}`
    progressCache.set(cacheKey, data)

    return data
  }, `upsertProgress(${topicId})`)
}

export async function getAllProgress(userId) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('❌ getAllProgress error:', error)
    throw new Error(`Failed to get all progress: ${error.message}`)
  }
  console.log(`📊 getAllProgress: Found ${data?.length || 0} progress records for user ${userId}`)
  if (data && data.length > 0) {
    console.log(`📊 getAllProgress RAW DATA:`, JSON.stringify(data, null, 2))
    data.forEach((record, index) => {
      console.log(`📊 Record ${index + 1}:`, {
        topic_id: record.topic_id,
        status: record.status,
        phase: record.phase,
        created_at: record.created_at,
        updated_at: record.updated_at
      })
    })
  } else {
    console.log(`📊 getAllProgress: No data returned from database`)
  }
  return data || []
}

export async function getLastAccessedTopic(userId) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('progress')
    .select('topic_id, phase, updated_at')
    .eq('user_id', userId)
    .in('status', ['in_progress', 'completed'])
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get last accessed topic: ${error.message}`)
  }

  return data
}

export async function getCompletedTopics(userId) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('progress')
    .select('topic_id')
    .eq('user_id', userId)
    .eq('status', 'completed')

  if (error) throw new Error(`Failed to get completed topics: ${error.message}`)
  return data ? data.map(row => row.topic_id) : []
}

export async function getUserProgressSummary(userId) {
  const client = initializeDatabase()
  const { data, error } = await client
    .rpc('get_user_progress_summary', { p_user_id: userId })

  if (error) throw new Error(`Failed to get progress summary: ${error.message}`)
  return data?.[0] || { total_topics: 0, completed_topics: 0, in_progress_topics: 0, completion_percentage: 0 }
}

// ============ PASSWORD RESET OPERATIONS ============

export async function createPasswordResetToken(userId, token, expiresAt) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('password_reset_tokens')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create password reset token: ${error.message}`)
  return data
}

export async function getPasswordResetToken(token) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('password_reset_tokens')
    .select('*, users(id, username, email)')
    .eq('token', token)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get password reset token: ${error.message}`)
  }
  return data
}

export async function markPasswordResetTokenUsed(tokenId) {
  const client = initializeDatabase()
  const { error } = await client
    .from('password_reset_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('id', tokenId)

  if (error) throw new Error(`Failed to mark token as used: ${error.message}`)
}

export async function updateUserPassword(userId, hashedPassword) {
  const client = initializeDatabase()
  
  // Development mode fallback
  if (client === 'DEV_MODE') {
    for (const [username, user] of DEV_USERS.entries()) {
      if (user.id === userId) {
        user.password = hashedPassword
        user.updated_at = new Date().toISOString()
        console.log(`[DEV] Updated password for user: ${username}`)
        return user
      }
    }
    throw new Error('User not found in development mode')
  }
  
  const { data, error } = await client
    .from('users')
    .update({
      password: hashedPassword,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update password: ${error.message}`)
  return data
}

// ============ SESSION MANAGEMENT ============

export async function createUserSession(userId, token, expiresAt, ipAddress, userAgent) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('user_sessions')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt,
      ip_address: ipAddress,
      user_agent: userAgent
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create user session: ${error.message}`)
  return data
}

export async function getUserSession(token) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('user_sessions')
    .select('*, users(id, username, email, name)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get user session: ${error.message}`)
  }
  return data
}

export async function updateSessionLastAccessed(sessionId) {
  const client = initializeDatabase()
  const { error } = await client
    .from('user_sessions')
    .update({ last_accessed: new Date().toISOString() })
    .eq('id', sessionId)

  if (error) throw new Error(`Failed to update session: ${error.message}`)
}

export async function deleteUserSession(token) {
  const client = initializeDatabase()
  const { error } = await client
    .from('user_sessions')
    .delete()
    .eq('token', token)

  if (error) throw new Error(`Failed to delete session: ${error.message}`)
}

// ============ ANALYTICS OPERATIONS ============

export async function updateLearningAnalytics(userId, topicId, analytics) {
  const client = initializeDatabase()
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

  const { data, error } = await client
    .from('learning_analytics')
    .upsert({
      user_id: userId,
      topic_id: topicId,
      session_date: today,
      ...analytics,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,topic_id,session_date' })
    .select()
    .single()

  if (error) throw new Error(`Failed to update learning analytics: ${error.message}`)
  return data
}

export async function getLearningAnalytics(userId, topicId = null, days = 30) {
  const client = initializeDatabase()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  let query = client
    .from('learning_analytics')
    .select('*')
    .eq('user_id', userId)
    .gte('session_date', startDate.toISOString().split('T')[0])
    .order('session_date', { ascending: false })

  if (topicId) {
    query = query.eq('topic_id', topicId)
  }

  const { data, error } = await query

  if (error) throw new Error(`Failed to get learning analytics: ${error.message}`)
  return data || []
}

// Export the client for direct access if needed
export const getSupabaseClient = () => initializeDatabase()
export { initializeDatabase }