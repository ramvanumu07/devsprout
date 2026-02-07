/**
 * Chat Service - Sara Learning Platform
 * Industry-level chat storage with structured JSON format
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
    global: { headers: { 'x-application-name': 'sara-chat-v2' } }
  })
}

// ============ STRUCTURED CHAT OPERATIONS ============

/**
 * Helper function to parse text format to messages array
 */
function parseTextToMessages(textHistory) {
  // Handle null, undefined, or non-string values
  if (!textHistory || typeof textHistory !== 'string' || textHistory.trim() === '') {
    return []
  }

  const messages = []
  const lines = textHistory.split('\n')
  
  let currentMessage = null
  let currentContent = []

  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (trimmedLine.startsWith('USER: ')) {
      // Save previous message if exists
      if (currentMessage) {
        currentMessage.content = currentContent.join('\n').trim()
        messages.push(currentMessage)
      }
      
      // Start new user message
      currentMessage = {
        role: 'user',
        timestamp: new Date().toISOString()
      }
      currentContent = [trimmedLine.substring(6).trim()] // Remove "USER: " prefix
      
    } else if (trimmedLine.startsWith('AGENT: ')) {
      // Save previous message if exists
      if (currentMessage) {
        currentMessage.content = currentContent.join('\n').trim()
        messages.push(currentMessage)
      }
      
      // Start new assistant message
      currentMessage = {
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
      currentContent = [trimmedLine.substring(7).trim()] // Remove "AGENT: " prefix
      
    } else if (trimmedLine !== '' && currentMessage) {
      // Continuation line for current message
      currentContent.push(trimmedLine)
    }
  }
  
  // Don't forget the last message
  if (currentMessage) {
    currentMessage.content = currentContent.join('\n').trim()
    messages.push(currentMessage)
  }

  console.log(`📝 Parsed ${messages.length} messages from text format`)
  return messages
}

/**
 * Get chat history as structured messages array (parsed from text format)
 */
export async function getChatHistory(userId, topicId) {
  const client = getSupabaseClient()
  
  console.log(`🔍 Fetching chat history: ${userId}/${topicId}`)
  
  try {
    const { data, error } = await client
      .from('chat_sessions')
      .select('messages, message_count, phase')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        console.log(`📝 No chat history found - returning empty array`)
        return []
      }
      throw new Error(`Database error: ${error.message}`)
    }

    const rawMessages = data?.messages || ''
    console.log(`📝 Raw messages:`, typeof rawMessages, rawMessages?.substring(0, 200))
    
    let messages = []
    
    if (rawMessages) {
      try {
        // First try to parse as JSON (old format)
        const jsonMessages = JSON.parse(rawMessages)
        if (Array.isArray(jsonMessages)) {
          console.log(`📝 Parsed as JSON format: ${jsonMessages.length} messages`)
          messages = jsonMessages
        } else {
          throw new Error('Not an array')
        }
      } catch (jsonError) {
        // If JSON parsing fails, try text format (new format)
        console.log(`📝 JSON parsing failed, trying text format`)
        messages = parseTextToMessages(rawMessages)
        console.log(`📝 Parsed as text format: ${messages.length} messages`)
      }
    }

    console.log(`✅ Retrieved ${messages.length} messages total`)
    console.log(`📝 Final messages:`, messages)
    return messages

  } catch (error) {
    console.error('❌ Error fetching chat history:', error.message)
    return []
  }
}


/**
 * Save a single chat turn with text format
 */
export async function saveChatTurn(userId, topicId, userMessage, aiResponse, phase = 'session') {
  const client = getSupabaseClient()
  
  console.log(`💾 Saving chat turn in text format: ${userId}/${topicId}`)
  
  try {
    // Get current conversation history as text
    const { data: currentData, error: fetchError } = await client
      .from('chat_sessions')
      .select('messages, message_count')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single()

    let currentHistory = ''
    let currentMessageCount = 0
    
    if (!fetchError && currentData?.messages) {
      currentHistory = currentData.messages
      currentMessageCount = currentData.message_count || 0
    }

    // Add new conversation turn in text format
    const newTurn = `USER: ${userMessage.trim()}\nAGENT: ${aiResponse.trim()}`
    
    // Append to existing history
    const updatedHistory = currentHistory 
      ? `${currentHistory}\n${newTurn}`
      : newTurn
    
    const newMessageCount = currentMessageCount + 2 // User + AI message

    // Keep conversation manageable (limit to ~50 turns = 100 messages)
    const lines = updatedHistory.split('\n')
    const trimmedLines = lines.slice(-100) // Keep last 100 lines
    const finalHistory = trimmedLines.join('\n')
    const finalMessageCount = trimmedLines.length

    // Upsert chat session
    const { error } = await client
      .from('chat_sessions')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        messages: finalHistory,
        message_count: finalMessageCount,
        phase: phase,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,topic_id'
      })

    if (error) {
      throw new Error(`Failed to save chat turn: ${error.message}`)
    }

    console.log(`✅ Chat turn saved successfully: ${finalMessageCount} total messages`)
    
    // Return messages in array format for frontend compatibility
    return parseTextToMessages(finalHistory)

  } catch (error) {
    console.error(`❌ Failed to save chat turn:`, error)
    throw error
  }
}

/**
 * Save initial message (welcome message) in text format
 */
export async function saveInitialMessage(userId, topicId, message, phase = 'session') {
  const client = getSupabaseClient()
  
  console.log(`💾 Checking for existing conversation: ${userId}/${topicId}`)
  
  try {
    // Check if conversation already exists
    const { data: existing, error: checkError } = await client
      .from('chat_sessions')
      .select('messages, message_count')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single()

    if (existing && existing.messages && existing.messages.trim() !== '') {
      console.log(`✅ Conversation already exists - not creating initial message`)
      return {
        wasCreated: false,
        conversationHistory: existing.messages,
        messages: parseTextToMessages(existing.messages)
      }
    }

    // No existing conversation, create initial message
    console.log(`💾 Creating initial message for new conversation`)
    const initialHistory = `AGENT: ${message.trim()}`

    const { error } = await client
      .from('chat_sessions')
      .insert({
        user_id: userId,
        topic_id: topicId,
        messages: initialHistory,
        message_count: 1,
        phase: phase,
        last_message_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      throw new Error(`Failed to save initial message: ${error.message}`)
    }

    console.log(`✅ Initial message created successfully`)
    
    return {
      wasCreated: true,
      conversationHistory: initialHistory,
      messages: parseTextToMessages(initialHistory)
    }

  } catch (error) {
    console.error(`❌ Failed to save initial message:`, error)
    throw error
  }
}

/**
 * Clear chat history for a topic
 */
export async function clearChatHistory(userId, topicId) {
  const client = getSupabaseClient()
  
  console.log(`🗑️ Clearing chat history: ${userId}/${topicId}`)
  
  try {
    const { error } = await client
      .from('chat_sessions')
      .delete()
      .eq('user_id', userId)
      .eq('topic_id', topicId)

    if (error) {
      throw new Error(`Failed to clear chat history: ${error.message}`)
    }

    console.log(`✅ Chat history cleared successfully`)

  } catch (error) {
    console.error(`❌ Failed to clear chat history:`, error)
    throw error
  }
}

/**
 * Get chat messages in old string format (for backward compatibility)
 */
export async function getChatHistoryString(userId, topicId) {
  try {
    const messages = await getChatHistory(userId, topicId)
    
    if (messages.length === 0) {
      return ''
    }

    // Convert structured messages back to text format
    const textLines = []
    for (const message of messages) {
      const prefix = message.role === 'user' ? 'USER: ' : 'AGENT: '
      textLines.push(prefix + message.content)
    }

    return textLines.join('\n')

  } catch (error) {
    console.error('Error converting messages to string:', error)
    return ''
  }
}

/**
 * Get recent messages for context
 */
export async function getLastMessages(userId, topicId, count = 10) {
  try {
    const messages = await getChatHistory(userId, topicId)
    return messages.slice(-count)
  } catch (error) {
    console.error('Error getting last messages:', error)
    return []
  }
}

/**
 * Parse history to messages (for compatibility)
 */
export function parseHistoryToMessages(historyString) {
  if (!historyString) return []
  return parseTextToMessages(historyString)
}

export default {
  getChatHistory,
  saveChatTurn,
  saveInitialMessage,
  clearChatHistory,
  getChatHistoryString,
  getLastMessages,
  parseHistoryToMessages
}