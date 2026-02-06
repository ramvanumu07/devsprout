/**
 * Chat Service - Sara Learning Platform
 * Industry-level chat storage using simple string format
 * Format: "AGENT: message\nUSER: message\nAGENT: message\n"
 */

import { createClient } from '@supabase/supabase-js'

// ============ DATABASE CLIENT ============
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Database configuration missing. Check SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.')
  }

  return createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'public' },
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { 'x-application-name': 'sara-chat' } }
  })
}

// ============ CORE CHAT FUNCTIONS ============

/**
 * Get chat history for a topic as a string
 * @param {string} userId - User ID
 * @param {string} topicId - Topic ID
 * @returns {Promise<string>} - Chat history in "AGENT: ...\nUSER: ..." format
 */
export async function getChatHistory(userId, topicId) {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('messages')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return data?.messages || ''
  } catch (error) {
    console.error('Error getting chat history:', error)
    return ''
  }
}

/**
 * Get last N messages from chat history
 * @param {string} userId - User ID
 * @param {string} topicId - Topic ID
 * @param {number} limit - Number of messages to retrieve (default 10)
 * @returns {Promise<string>} - Last N messages in string format
 */
export async function getLastMessages(userId, topicId, limit = 10) {
  try {
    const fullHistory = await getChatHistory(userId, topicId)
    if (!fullHistory) return ''

    // Split by message boundaries and get last N
    const messages = fullHistory.split(/(?=AGENT:|USER:)/).filter(msg => msg.trim())
    const lastMessages = messages.slice(-limit)

    return lastMessages.join('')
  } catch (error) {
    console.error('Error getting last messages:', error)
    return ''
  }
}

/**
 * Append new message to chat history
 * @param {string} userId - User ID
 * @param {string} topicId - Topic ID
 * @param {string} role - 'AGENT' or 'USER'
 * @param {string} content - Message content
 * @returns {Promise<boolean>} - Success status
 */
export async function appendMessage(userId, topicId, role, content) {
  try {
    const supabase = getSupabaseClient()

    // Get current history
    const currentHistory = await getChatHistory(userId, topicId)

    // Append new message
    const newMessage = `${role}: ${content}\n`
    const updatedHistory = currentHistory + newMessage

    // Upsert (insert or update)
    const { error } = await supabase
      .from('chat_sessions')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        messages: updatedHistory,
        phase: 'session',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,topic_id'
      })

    if (error) throw error

    return true
  } catch (error) {
    console.error('Error appending message:', error)
    return false
  }
}

/**
 * Save a complete conversation turn (user message + AI response)
 * @param {string} userId - User ID
 * @param {string} topicId - Topic ID
 * @param {string} userMessage - User's message
 * @param {string} aiResponse - AI's response
 * @returns {Promise<boolean>} - Success status
 */
export async function saveChatTurn(userId, topicId, userMessage, aiResponse) {
  try {
    const supabase = getSupabaseClient()

    // Get current history
    const currentHistory = await getChatHistory(userId, topicId)

    // Append both messages
    const newTurn = `USER: ${userMessage}\nAGENT: ${aiResponse}\n`
    const updatedHistory = currentHistory + newTurn

    // Upsert (insert or update)
    const { error } = await supabase
      .from('chat_sessions')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        messages: updatedHistory,
        phase: 'session',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,topic_id'
      })

    if (error) throw error

    console.log(`✅ Chat turn saved: User ${userId}, Topic ${topicId}`)
    return true
  } catch (error) {
    console.error('Error saving chat turn:', error)
    return false
  }
}

/**
 * Save initial AI message (for session start)
 * @param {string} userId - User ID
 * @param {string} topicId - Topic ID
 * @param {string} aiMessage - Initial AI message
 * @returns {Promise<{wasCreated: boolean, conversationHistory: string}>}
 */
export async function saveInitialMessage(userId, topicId, aiMessage) {
  try {
    const supabase = getSupabaseClient()

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('chat_sessions')
      .select('messages')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single()

    if (existing && existing.messages && existing.messages.trim()) {
      // Conversation exists, return it
      return {
        wasCreated: false,
        conversationHistory: existing.messages
      }
    }

    // Create new conversation with initial message
    const initialHistory = `AGENT: ${aiMessage}\n`

    const { error } = await supabase
      .from('chat_sessions')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        messages: initialHistory,
        phase: 'session',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,topic_id'
      })

    if (error) throw error

    console.log(`✅ Initial message saved: User ${userId}, Topic ${topicId}`)
    return {
      wasCreated: true,
      conversationHistory: initialHistory
    }
  } catch (error) {
    console.error('Error saving initial message:', error)
    return {
      wasCreated: false,
      conversationHistory: ''
    }
  }
}

/**
 * Clear chat history for a topic
 * @param {string} userId - User ID
 * @param {string} topicId - Topic ID
 * @returns {Promise<boolean>} - Success status
 */
export async function clearChatHistory(userId, topicId) {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('user_id', userId)
      .eq('topic_id', topicId)

    if (error) throw error

    console.log(`✅ Chat history cleared: User ${userId}, Topic ${topicId}`)
    return true
  } catch (error) {
    console.error('Error clearing chat history:', error)
    return false
  }
}

/**
 * Parse string history to array format (for frontend display)
 * @param {string} history - String history in "AGENT: ...\nUSER: ..." format
 * @returns {Array} - Array of message objects
 */
export function parseHistoryToMessages(history) {
  if (!history || typeof history !== 'string') return []

  const messages = []
  
  // Split by message markers, not by newlines
  const messageParts = history.split(/(?=AGENT:|USER:)/).filter(part => part.trim())
  
  for (const part of messageParts) {
    const trimmedPart = part.trim()
    
    if (trimmedPart.startsWith('AGENT: ')) {
      // Extract everything after "AGENT: " including newlines
      const content = trimmedPart.substring(7).trim()
      if (content) {
        messages.push({
          role: 'assistant',
          content: content,
          timestamp: new Date().toISOString()
        })
      }
    } else if (trimmedPart.startsWith('USER: ')) {
      // Extract everything after "USER: " including newlines
      const content = trimmedPart.substring(6).trim()
      if (content) {
        messages.push({
          role: 'user',
          content: content,
          timestamp: new Date().toISOString()
        })
      }
    }
  }

  console.log(`📝 Parsed ${messages.length} messages from history`)
  return messages
}

/**
 * Legacy compatibility function
 * @deprecated Use getChatHistory instead
 */
export async function getChatHistoryString(userId, topicId) {
  return await getChatHistory(userId, topicId)
}