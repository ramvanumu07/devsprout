/**
 * Debug Chat History Route - Check Chat Storage Format
 */

import express from 'express'
import { getSupabaseClient } from '../services/database.js'
import { getChatHistory } from '../services/chatService.js'

const router = express.Router()

// Debug chat history storage format
router.get('/chat-history/:topicId', async (req, res) => {
  try {
    const { topicId } = req.params
    const userId = 'beeedf0e-c329-4255-b161-edc5d3d375cd' // Your user ID
    
    console.log(`🔍 Debug: Checking chat history for ${userId}/${topicId}`)
    
    const client = getSupabaseClient()
    
    if (client === 'DEV_MODE') {
      return res.json({
        mode: 'development',
        message: 'Running in development mode - using in-memory database'
      })
    }

    // Get raw data from database
    const { data: rawData, error: rawError } = await client
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single()

    if (rawError) {
      if (rawError.code === 'PGRST116') {
        return res.json({
          status: 'no_history',
          message: 'No chat history found for this topic',
          userId,
          topicId
        })
      }
      throw new Error(`Database error: ${rawError.message}`)
    }

    // Get parsed data using chat service
    const parsedMessages = await getChatHistory(userId, topicId)

    // Analyze the raw messages format
    const rawMessages = rawData.messages
    const messageType = typeof rawMessages
    const isJson = (() => {
      try {
        JSON.parse(rawMessages)
        return true
      } catch {
        return false
      }
    })()

    // Count lines in text format
    const textLines = rawMessages ? rawMessages.split('\n').filter(line => line.trim() !== '') : []
    const userLines = textLines.filter(line => line.startsWith('USER: '))
    const agentLines = textLines.filter(line => line.startsWith('AGENT: '))

    res.json({
      status: 'found',
      userId,
      topicId,
      raw_data: {
        message_count: rawData.message_count,
        phase: rawData.phase,
        last_message_at: rawData.last_message_at,
        created_at: rawData.created_at,
        updated_at: rawData.updated_at
      },
      raw_messages: {
        type: messageType,
        is_json: isJson,
        length: rawMessages ? rawMessages.length : 0,
        preview: rawMessages ? rawMessages.substring(0, 500) + (rawMessages.length > 500 ? '...' : '') : null,
        text_analysis: {
          total_lines: textLines.length,
          user_lines: userLines.length,
          agent_lines: agentLines.length,
          sample_lines: textLines.slice(0, 5)
        }
      },
      parsed_messages: {
        count: parsedMessages.length,
        messages: parsedMessages.map(msg => ({
          role: msg.role,
          content: msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : ''),
          timestamp: msg.timestamp
        }))
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Debug chat history error:', error)
    res.status(500).json({
      error: 'Failed to debug chat history',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Test the chat API endpoint that frontend uses
router.get('/test-frontend-api/:topicId', async (req, res) => {
  try {
    const { topicId } = req.params
    
    // Simulate the exact API call that frontend makes
    const response = await fetch(`http://localhost:5000/api/chat/history/${topicId}`, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZWVlZGYwZS1jMzI5LTQyNTUtYjE2MS1lZGM1ZDNkMzc1Y2QiLCJ1c2VybmFtZSI6IlJhbVZhbnVtdSIsImVtYWlsIjoic2FyYTRjb2RlQGdtYWlsLmNvbSIsIm5hbWUiOiJSYW0gVmFudW11IiwiaWF0IjoxNzcwMjEwMTE2LCJleHAiOjE3NzAyOTY1MTZ9.eygpZBx4K1zrkxwTMtyW9Jooi4Jf8VeGQEDF6dd1INU'
      }
    })
    
    const data = await response.json()
    
    res.json({
      status: 'frontend_api_test',
      api_response: data,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    res.status(500).json({
      error: 'Frontend API test failed',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

export default router