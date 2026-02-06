/**
 * Database Service - Sara Learning Platform
 * Industry-level database operations with single-topic architecture
 */

import { createClient } from '@supabase/supabase-js'
import { withPerformanceLogging, progressCache } from '../middleware/performance.js'

// ============ SUPABASE CLIENT ============
let supabase = null

// Initialize database connection
function initializeDatabase() {
  if (supabase) return supabase

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Database configuration missing. Check SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.')
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

export async function createUser(username, email, name, hashedPassword) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('users')
    .insert({
      username,
      email,
      name,
      password: hashedPassword,
      has_access: true // Default access for Sara
    })
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

export async function getUserByUsername(username) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get user by username: ${error.message}`)
  }
  return data
}

export async function getUserByEmail(email) {
  const client = initializeDatabase()
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