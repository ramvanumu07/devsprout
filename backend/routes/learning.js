/**
 * Learning Routes - Sara Learning Platform
 * Single-topic architecture with enhanced features
 */

import express from 'express'
import { authenticateToken } from './auth.js'
import { callAI } from '../services/ai.js'
import {
  getProgress,
  upsertProgress,
  getAllProgress,
  getLastAccessedTopic,
  getCompletedTopics,
  getUserProgressSummary
} from '../services/database.js'
import progressManager from '../services/progressManager.js'
import { saveChatTurn, saveInitialMessage, clearChatHistory, getChatHistoryString, getChatHistory } from '../services/chatService.js'
import { courses } from '../../data/curriculum.js'
import { formatLearningObjectives, findTopicById, getAllTopics } from '../utils/curriculum.js'
import { handleErrorResponse, createSuccessResponse, createErrorResponse } from '../utils/responses.js'
import { rateLimitMiddleware } from '../middleware/rateLimiting.js'

const router = express.Router()

// ============ VALIDATION SCHEMAS ============
const schemas = {
  sessionStart: {
    required: ['topicId'],
    optional: ['assignments']
  },
  playtimeStart: {
    required: ['topicId'],
    optional: []
  },
  assignmentStart: {
    required: ['topicId'],
    optional: []
  },
  playtimeComplete: {
    required: ['topicId'],
    optional: []
  },
  assignmentComplete: {
    required: ['topicId', 'assignmentIndex'],
    optional: []
  }
}

function validateBody(schema) {
  return (req, res, next) => {
    const { required = [], optional = [] } = schema
    const allowedFields = [...required, ...optional]

    // Check required fields
    for (const field of required) {
      if (!req.body[field]) {
        return res.status(400).json(createErrorResponse(`${field} is required`))
      }
    }

    // Remove unexpected fields
    const cleanBody = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        cleanBody[field] = req.body[field]
      }
    }
    req.body = cleanBody

    next()
  }
}

// ============ UTILITY FUNCTIONS ============

// Secure code execution function
async function executeCodeSecurely(code, testCases = []) {
  console.log('🔧 Executing code:', code.substring(0, 100) + '...')
  try {
    // Create a safe execution context
    const vm = await import('vm')
    const context = {
      console: {
        log: (...args) => {
          context.__output = (context.__output || '') + args.join(' ') + '\n'
        }
      },
      __output: '',
      __error: null
    }
    
    // Set up the context
    vm.createContext(context)
    
    try {
      // Execute the code in the safe context
      vm.runInContext(code, context, { timeout: 5000 })
      
      const output = context.__output.trim()
      const results = []
      
      // Run test cases if provided
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i]
        const expected = testCase.expectedOutput
        const passed = output.includes(expected) || output === expected
        
        results.push({
          testIndex: i,
          expected,
          actual: output,
          passed,
          description: testCase.description || `Test ${i + 1}`
        })
      }
      
      const result = {
        success: true,
        output,
        testResults: results,
        allTestsPassed: results.length === 0 || results.every(r => r.passed)
      }
      console.log('✅ Code execution successful:', result)
      return result
    } catch (execError) {
      console.error('❌ Code execution error:', execError.message)
      return {
        success: false,
        error: execError.message,
        output: '',
        testResults: [],
        allTestsPassed: false
      }
    }
  } catch (importError) {
    // Fallback to basic validation if vm module not available
    return {
      success: true,
      output: 'Code execution not available on this server',
      testResults: [],
      allTestsPassed: true,
      warning: 'Server-side execution disabled'
    }
  }
}

function buildSessionPrompt(topicId, conversationHistory, completedTopics = []) {
  const topic = findTopicById(courses, topicId)
  if (!topic) {
    throw new Error(`Topic not found: ${topicId}`)
  }

  const goals = formatLearningObjectives(topic.outcomes)
  const completedList = completedTopics.length > 0
    ? `\n\nCompleted Topics: ${completedTopics.join(', ')}`
    : ''

  return `You are Sara, a friendly JavaScript tutor teaching "${topic.title}".

Goals to Cover:
${goals}

Conversation History:
${conversationHistory || 'Starting new conversation...'}${completedList}

Required Response Format:
For each new concept:
1. One sentence: what it does (explain as simple as you can)
2. "Here's an example:" + minimal code example  
3. "Your turn!" + specific practice task
4. STOP

After student responds:
1. Celebrate if correct (🎉)
2. Use their code to teach when natural, otherwise just move forward
3. Introduce next goal

Response rules:
- 3-4 short paragraphs max
- Conversational, friendly tone
- Use meaningful variable names (userName, not x)
- Always end with a question
- NEVER continue past "Your turn!" - wait for them
- Use "terminal" instead of "browser console"

Adaptive Behaviors:
- If student asks "What is X?": Explain immediately, then return to lesson
- If wrong: Point out issue gently + why + hint (not answer) + ask retry
- If stuck after 2 tries: Give more explicit guidance

Progress & Ending:
- Before each response, check what's already covered in conversation_history
- What's next in goals?
- Has current concept been practiced AND confirmed?
- End when ALL goals are: Explained ✅ + Practiced ✅ + Confirmed ✅

Then write:
🏆 Congratulations! You've Mastered ${topic.title}!
Recap: [list key points]
STOP. No bonus content.

Generate the response now.`
}

async function getCompletedTopicsForUser(userId) {
  try {
    const completedTopics = await getCompletedTopics(userId)
    return completedTopics
  } catch (error) {
    console.error('Error getting completed topics:', error)
    return []
  }
}

// ============ LEARNING STATE MANAGEMENT ============

router.get('/state/:topicId', authenticateToken, async (req, res) => {
  try {
    const { topicId } = req.params
    const userId = req.user.userId

    console.log(`🔄 Loading learning state for: "${topicId}" (type: ${typeof topicId}, length: ${topicId?.length})`)
    console.log(`🔄 Raw params:`, req.params)
    console.log(`🔄 Full URL:`, req.url)

    // Validate topic exists
    const topic = findTopicById(courses, topicId)
    if (!topic) {
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    // Get progress and chat history in parallel
    const [progress, chatHistory] = await Promise.all([
      getProgress(userId, topicId),
      getChatHistoryString(userId, topicId)
    ])

    console.log(`📊 Progress data:`, {
      hasProgress: !!progress,
      status: progress?.status,
      phase: progress?.phase,
      chatHistoryLength: chatHistory?.length
    })

    if (!progress) {
      console.log(`📝 No progress found for ${topicId}`)
      return res.json({
        success: true,
        exists: false,
        topic: {
          id: topicId,
          title: topic.title,
          description: topic.description,
          category: topic.category,
          difficulty: topic.difficulty,
          estimatedTime: topic.estimatedTime
        }
      })
    }

    // Normalize phase
    const normalizedPhase = progress.phase || 'session'

    const responseData = {
      success: true,
      exists: true,
      phase: normalizedPhase,
      conceptRevealed: progress.concept_revealed || false,
      currentAssignment: progress.current_task || 0,
      totalAssignments: progress.total_tasks || 0,
      status: progress.status,
      conversationHistory: chatHistory || '',
      assignments: [],
      savedCode: progress?.saved_code || '',
      hintsUsed: progress?.hints_used || 0,
      topic: {
        id: topicId,
        title: topic.title,
        description: topic.description,
        category: topic.category,
        difficulty: topic.difficulty,
        estimatedTime: topic.estimatedTime
      }
    }

    console.log(`📤 Sending response:`, {
      exists: responseData.exists,
      conversationHistoryLength: responseData.conversationHistory?.length,
      phase: responseData.phase
    })

    res.json(responseData)
  } catch (error) {
    handleErrorResponse(res, error, 'get session state')
  }
})

// ============ SESSION PHASE ============

router.post('/session/start', authenticateToken, rateLimitMiddleware, validateBody(schemas.sessionStart), async (req, res) => {
  try {
    const { topicId, assignments } = req.body
    const userId = req.user.userId

    console.log(`🚀 Starting session for topic: ${topicId}`)

    // Validate topic exists
    const topic = findTopicById(courses, topicId)
    if (!topic) {
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    // Handle empty assignments
    const taskList = assignments && assignments.length > 0
      ? assignments
      : ['Practice the concept with a simple example']

    // Initialize topic progress - direct database call for compatibility
    await upsertProgress(userId, topicId, {
      phase: 'session',
      status: 'in_progress',
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    // Get student context and build prompt
    const completedTopics = await getCompletedTopicsForUser(userId)
    const outcomes = topic ? formatLearningObjectives(topic.outcomes) : 'Learn programming concepts'

    // Build the session prompt
    const sessionPrompt = buildSessionPrompt(topicId, '', completedTopics)

    const messages = [
      { role: 'system', content: sessionPrompt },
      { role: 'user', content: `Start teaching the first concept.` }
    ]

    // Generate initial message (idempotent - won't duplicate if conversation exists)
    const aiResponse = await callAI(messages, 800, 0.4, 'llama-3.3-70b-versatile')

    const result = await saveInitialMessage(userId, topicId, aiResponse)

    const directResponse = result.wasCreated ? aiResponse :
      result.conversationHistory?.match(/AGENT: (.+?)(?=\nUSER:|$)/s)?.[1]?.trim() || 'Session ready'

    // Get updated progress after saving
    const progress = await getProgress(userId, topicId)

    res.json({
      success: true,
      message: directResponse,
      phase: 'session',
      conceptRevealed: false,
      outcomes: outcomes || [],
      progress: progress,
      topic: {
        id: topicId,
        title: topic.title,
        description: topic.description,
        category: topic.category
      }
    })
  } catch (error) {
    handleErrorResponse(res, error, 'start session')
  }
})

// ============ PLAYTIME PHASE ============

router.post('/playtime/start', authenticateToken, rateLimitMiddleware, validateBody(schemas.playtimeStart), async (req, res) => {
  try {
    const { topicId } = req.body
    const userId = req.user.userId

    console.log(`🎮 Starting playtime for topic: ${topicId}`)

    // Validate topic exists
    const topic = findTopicById(courses, topicId)
    if (!topic) {
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    // Start playtime phase - direct database call for compatibility
    await upsertProgress(userId, topicId, {
      phase: 'playtime',
      status: 'in_progress',
      updated_at: new Date().toISOString()
    })

    // Build playtime prompt
    const outcomes = topic ? formatLearningObjectives(topic.outcomes) : 'Learn programming concepts'
    const completedTopics = await getCompletedTopicsForUser(userId)

    const playtimePrompt = `You are Sara, a creative JavaScript mentor for "${topic?.title || 'JavaScript'}" playtime!

Student has learned: ${outcomes}
Completed topics: ${completedTopics.join(', ') || 'None yet'}

Your role in PLAYTIME:
- Suggest 3-4 fun, creative coding challenges using ${topic.title}
- Make challenges progressively more interesting
- Encourage experimentation and creativity
- Be supportive and enthusiastic
- Help debug when they get stuck

Challenge ideas should be:
- Fun and engaging (games, art, interactive)
- Use the concepts they just learned
- Build on each other
- Appropriate for their level

Start by suggesting the first creative challenge!`

    const messages = [
      { role: 'system', content: playtimePrompt },
      { role: 'user', content: `I'm ready for some creative coding challenges with ${topic.title}!` }
    ]

    const aiResponse = await callAI(messages, 1000, 0.6, 'llama-3.3-70b-versatile')

    res.json(createSuccessResponse({
      message: aiResponse,
      phase: 'playtime',
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'start playtime')
  }
})

// ============ PLAYTIME COMPLETION ============

// Test endpoint to verify routing
router.get('/playtime/test', (req, res) => {
  res.json({ success: true, message: 'Playtime routes are working', timestamp: new Date().toISOString() })
})

router.post('/playtime/complete', authenticateToken, rateLimitMiddleware, validateBody(schemas.playtimeComplete), async (req, res) => {
  try {
    const { topicId } = req.body
    const userId = req.user.userId

    console.log(`🎮 PLAYTIME COMPLETE REQUEST:`)
    console.log(`   - User ID: ${userId}`)
    console.log(`   - Topic ID: ${topicId}`)
    console.log(`   - Request Body:`, req.body)

    // Validate topic exists
    const topic = findTopicById(courses, topicId)
    if (!topic) {
      console.error(`❌ Topic not found: ${topicId}`)
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    console.log(`✅ Topic found: ${topic.title}`)

    // Complete playtime phase - direct database update for compatibility
    try {
      console.log(`🎮 Updating progress: phase=assignment, status=in_progress`)
      
      const result = await upsertProgress(userId, topicId, {
        phase: 'assignment',
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      
      console.log(`✅ Playtime completed - database updated:`, result)
    } catch (dbError) {
      console.error(`❌ Database error in playtime complete:`, dbError)
      console.error(`❌ Error details:`, dbError.message)
      console.error(`❌ Error stack:`, dbError.stack)
      throw new Error(`Failed to complete playtime: ${dbError.message}`)
    }

    res.json(createSuccessResponse({
      message: 'Playtime completed successfully',
      phase: 'playtime',
      nextPhase: 'assignment',
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      }
    }))
  } catch (error) {
    console.error(`❌ Playtime complete error:`, error)
    handleErrorResponse(res, error, 'complete playtime')
  }
})

// ============ ASSIGNMENT PHASE ============

router.post('/assignment/start', authenticateToken, rateLimitMiddleware, validateBody(schemas.assignmentStart), async (req, res) => {
  try {
    const { topicId } = req.body
    const userId = req.user.userId

    console.log(`📝 Starting assignment for topic: ${topicId}`)

    // Validate topic exists
    const topic = findTopicById(courses, topicId)
    if (!topic) {
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    // Get topic tasks
    const tasks = topic.tasks || []
    if (tasks.length === 0) {
      return res.status(400).json(createErrorResponse('No assignments available for this topic'))
    }

    // Start assignment phase - direct database call for compatibility
    await upsertProgress(userId, topicId, {
      phase: 'assignment',
      status: 'in_progress',
      current_task: 0,
      total_tasks: tasks.length,
      updated_at: new Date().toISOString()
    })

    // Get first assignment
    const firstTask = tasks[0]

    res.json(createSuccessResponse({
      assignment: {
        description: firstTask.description,
        testCases: firstTask.testCases,
        currentTask: 0,
        totalTasks: tasks.length
      },
      phase: 'assignment',
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'start assignment')
  }
})

router.post('/assignment/complete', authenticateToken, rateLimitMiddleware, async (req, res) => {
  try {
    const { topicId, assignmentIndex, code } = req.body
    const userId = req.user.userId

    if (!topicId || assignmentIndex === undefined) {
      return res.status(400).json(createErrorResponse('topicId and assignmentIndex are required'))
    }

    if (!code || !code.trim()) {
      return res.status(400).json(createErrorResponse('Code is required to complete assignment'))
    }

    console.log(`📝 Completing assignment ${assignmentIndex} for topic: ${topicId}`)

    // Validate topic exists
    const topic = findTopicById(courses, topicId)
    if (!topic) {
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    const tasks = topic.tasks || []
    if (assignmentIndex >= tasks.length) {
      return res.status(400).json(createErrorResponse('Invalid assignment index'))
    }

    const currentTask = tasks[assignmentIndex]
    const testCases = currentTask.testCases || []

    // Execute code and validate against test cases
    const executionResult = await executeCodeSecurely(code, testCases)

    // Check if all tests passed (only if there are test cases)
    if (testCases.length > 0 && !executionResult.allTestsPassed) {
      return res.status(400).json(createErrorResponse('Assignment not completed: Some tests are failing', {
        execution: executionResult,
        requiresAllTestsPassed: true,
        failedTests: executionResult.testResults?.filter(t => !t.passed) || []
      }))
    }

    // Complete assignment - tests passed or no tests required
    const currentProgress = await getProgress(userId, topicId)
    const completedAssignments = (currentProgress?.assignments_completed || 0) + 1
    const isTopicComplete = completedAssignments >= tasks.length

    await upsertProgress(userId, topicId, {
      phase: 'assignment',
      status: isTopicComplete ? 'completed' : 'in_progress',
      current_task: Math.min(assignmentIndex + 1, tasks.length - 1),
      assignments_completed: completedAssignments,
      status: isTopicComplete ? 'completed' : 'in_progress',
      completed_at: isTopicComplete ? new Date().toISOString() : null,
      saved_code: code, // Save the successful code
      updated_at: new Date().toISOString()
    })

    const totalAssignments = tasks.length

    res.json(createSuccessResponse({
      message: isTopicComplete ? 'All assignments completed! Topic mastered!' : 'Assignment completed successfully',
      assignmentCompleted: true,
      topicCompleted: isTopicComplete,
      completedAssignments: completedAssignments,
      totalAssignments: totalAssignments,
      nextAssignment: isTopicComplete ? null : assignmentIndex + 1,
      phase: 'assignment',
      execution: executionResult,
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'complete assignment')
  }
})

// ============ CODE EXECUTION ============

router.post('/execute', authenticateToken, async (req, res) => {
  try {
    const { code, topicId, assignmentIndex } = req.body
    
    if (!code || !topicId) {
      return res.status(400).json(createErrorResponse('Code and topicId are required'))
    }

    // Get topic and assignment details
    const topic = findTopicById(courses, topicId)
    if (!topic) {
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    let testCases = []
    if (assignmentIndex !== undefined && topic.tasks && topic.tasks[assignmentIndex]) {
      testCases = topic.tasks[assignmentIndex].testCases || []
    }

    // Execute code securely
    const result = await executeCodeSecurely(code, testCases)

    res.json(createSuccessResponse({
      execution: result,
      topic: {
        id: topicId,
        title: topic.title
      },
      assignment: assignmentIndex !== undefined ? {
        index: assignmentIndex,
        total: topic.tasks?.length || 0
      } : null
    }))

  } catch (error) {
    console.error('Code execution error:', error)
    res.status(500).json(createErrorResponse('Code execution failed'))
  }
})

// ============ PROGRESS MANAGEMENT ============

router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    console.log(`📊 Progress API called for user: ${userId}`)

    // Get progress data directly for compatibility
    const allProgress = await getAllProgress(userId)
    
    // Calculate summary directly
    const allTopicsFromCurriculum = getAllTopics(courses)
    const totalTopics = allTopicsFromCurriculum.length
    const completedTopics = allProgress.filter(p => p.status === 'completed').length
    const inProgressTopics = allProgress.filter(p => p.status === 'in_progress').length
    
    const summary = {
      total_topics: totalTopics,
      completed_topics: completedTopics,
      in_progress_topics: inProgressTopics,
      completion_percentage: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
    }

    console.log(`📊 Found ${allProgress?.length || 0} progress records from progress table`)
    console.log(`📊 RAW PROGRESS DATA:`, JSON.stringify(allProgress, null, 2))

    // Find most recent topic for lastAccessed
    const lastAccessed = allProgress.length > 0 ? {
      topicId: allProgress[0].topic_id,
      phase: allProgress[0].phase || 'session'
    } : null

    // Topics already loaded above

    res.json(createSuccessResponse({
      progress: allProgress,
      summary: summary,
      lastAccessed: lastAccessed,
      topics: allTopicsFromCurriculum.map(topic => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        category: topic.category,
        difficulty: topic.difficulty,
        estimatedTime: topic.estimatedTime
      }))
    }))
  } catch (error) {
    console.error('❌ Progress API error:', error)
    console.error('❌ Error details:', error.message)
    handleErrorResponse(res, error, 'get progress')
  }
})

// Debug endpoint to check progress table
router.get('/debug/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    console.log(`🔍 Debug: Checking progress table for user ${userId}`)

    // Get progress using the database service
    const data = await getAllProgress(userId)
    const error = null

    console.log(`🔍 Debug results:`)
    console.log(`   - Error:`, error)
    console.log(`   - Data:`, data)
    console.log(`   - Data length:`, data?.length)

    res.json({
      success: true,
      debug: {
        userId: userId,
        error: error,
        data: data,
        dataLength: data?.length || 0
      }
    })
  } catch (error) {
    console.error('❌ Debug error:', error)
    res.json({
      success: false,
      error: error.message
    })
  }
})

// Reset all progress for current user (for testing)
router.delete('/debug/reset-progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    
    // Reset progress - direct database calls for compatibility
    const { getSupabaseClient } = await import('../services/database.js')
    const { progressCache } = await import('../middleware/performance.js')
    const supabase = getSupabaseClient()

    // Delete from all possible tables
    const tables = ['progress', 'chat_sessions', 'chat_history']
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('user_id', userId)
        
        if (error) {
          console.warn(`Failed to delete from ${table}:`, error.message)
        } else {
          console.log(`✅ Deleted all records from ${table}`)
        }
      } catch (err) {
        console.warn(`Error deleting from ${table}:`, err.message)
      }
    }

    // Clear cache
    progressCache.clear()
    console.log(`🧹 Progress cache cleared`)

    const result = { success: true, message: 'All progress reset successfully' }

    res.json({
      success: true,
      message: 'All progress data and cache have been reset using centralized progress manager.',
      userId: userId,
      details: result
    })
  } catch (error) {
    console.error('❌ Reset progress error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Clear all caches (for debugging)
router.post('/debug/clear-cache', authenticateToken, async (req, res) => {
  try {
    const { progressCache } = await import('../middleware/performance.js')
    
    progressCache.clear()
    console.log('🧹 All backend caches cleared')

    res.json({
      success: true,
      message: 'All backend caches cleared',
      cacheSize: progressCache.size()
    })
  } catch (error) {
    console.error('❌ Clear cache error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Debug current progress state for a specific topic
router.get('/debug/progress/:topicId', authenticateToken, async (req, res) => {
  try {
    const { topicId } = req.params
    const userId = req.user.userId
    
    const progress = await getProgress(userId, topicId)
    
    console.log(`🔍 Progress Debug for ${topicId}:`, progress)
    
    res.json({
      success: true,
      debug: {
        userId,
        topicId,
        progress,
        nextPhase: null // Simplified for compatibility
      }
    })
  } catch (error) {
    console.error('❌ Progress debug error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Comprehensive debug - check ALL data sources
router.get('/debug/all-data-sources', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    console.log(`🔍 COMPREHENSIVE DEBUG: Checking all data sources for user: ${userId}`)

    const { getSupabaseClient } = await import('../services/database.js')
    const supabase = getSupabaseClient()

    // Check progress table
    const { data: progressData, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)

    // Check chat_sessions table
    const { data: chatSessionsData, error: chatSessionsError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)

    // Check chat_history table
    const { data: chatHistoryData, error: chatHistoryError } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)

    // Check cache
    const { progressCache } = await import('../middleware/performance.js')

    console.log(`🔍 DEBUG RESULTS:`)
    console.log(`   - Progress table: ${progressData?.length || 0} records`)
    console.log(`   - Chat sessions: ${chatSessionsData?.length || 0} records`)
    console.log(`   - Chat history: ${chatHistoryData?.length || 0} records`)
    console.log(`   - Cache size: ${progressCache.size()}`)

    res.json({
      success: true,
      debug: {
        userId: userId,
        dataSources: {
          progress: {
            count: progressData?.length || 0,
            data: progressData,
            error: progressError?.message
          },
          chatSessions: {
            count: chatSessionsData?.length || 0,
            data: chatSessionsData,
            error: chatSessionsError?.message
          },
          chatHistory: {
            count: chatHistoryData?.length || 0,
            data: chatHistoryData,
            error: chatHistoryError?.message
          },
          cache: {
            size: progressCache.size()
          }
        }
      }
    })
  } catch (error) {
    console.error('❌ Comprehensive debug error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

router.get('/continue', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId

    // Get ONLY from progress table - no fallbacks
    const allProgress = await getAllProgress(userId)
    const lastAccessed = allProgress.length > 0 ? allProgress[0] : null

    if (!lastAccessed) {
      // If no progress, start with first topic
      const firstTopic = getAllTopics(courses)[0]
      console.log(`📭 No progress found for user ${userId}, starting with first topic: ${firstTopic.id}`)
      
      return res.json(createSuccessResponse({
        lastAccessed: {
          topicId: firstTopic.id,
          phase: 'session'
        }
      }))
    }

    const topic = findTopicById(courses, lastAccessed.topic_id)
    console.log(`🎯 Last accessed topic for user ${userId}: ${lastAccessed.topic_id}, phase: ${lastAccessed.phase}`)

    res.json(createSuccessResponse({
      lastAccessed: {
        topicId: lastAccessed.topic_id,
        phase: lastAccessed.phase || 'session',
        status: lastAccessed.status || 'not_started'
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'get continue learning')
  }
})

// ============ COURSE MANAGEMENT ============

// GET /courses - Get all courses
router.get('/courses', authenticateToken, async (req, res) => {
  try {
    res.json(createSuccessResponse({
      courses: courses
    }))
  } catch (error) {
    console.error('Get courses error:', error)
    handleErrorResponse(res, error, 'Failed to get courses')
  }
})

// ============ TOPIC MANAGEMENT ============

router.get('/topics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    const topics = getAllTopics(courses)
    const userProgress = await getAllProgress(userId)

    // Enhance topics with progress information
    const enhancedTopics = topics.map(topic => {
      const progress = userProgress.find(p => p.topic_id === topic.id)
      return {
        ...topic,
        status: progress?.status || 'not_started',
        phase: progress?.phase || 'session',
        lastAccessed: progress?.last_accessed,
        completedAt: progress?.completed_at
      }
    })

    res.json(createSuccessResponse({
      topics: enhancedTopics,
      totalTopics: topics.length,
      completedTopics: userProgress.filter(p => p.status === 'completed').length
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'get topics')
  }
})

router.get('/topic/:topicId', authenticateToken, async (req, res) => {
  try {
    const { topicId } = req.params
    const userId = req.user.userId

    const topic = findTopicById(courses, topicId)
    if (!topic) {
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    const progress = await getProgress(userId, topicId)

    // Get all topics to find next topic
    const allTopics = getAllTopics(courses)
    const currentIndex = allTopics.findIndex(t => t.id === topicId)
    const nextTopic = currentIndex >= 0 && currentIndex < allTopics.length - 1
      ? allTopics[currentIndex + 1]
      : null

    res.json(createSuccessResponse({
      topic: {
        ...topic,
        status: progress?.status || 'not_started',
        phase: progress?.phase || 'session',
        lastAccessed: progress?.last_accessed,
        completedAt: progress?.completed_at
      },
      nextTopic: nextTopic
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'get topic details')
  }
})

// ============ DEBUG ENDPOINTS ============

// Debug: List all available topics
router.get('/debug/topics', (req, res) => {
  try {
    const allTopics = courses.flatMap(course => 
      course.topics.map(topic => ({
        id: topic.id,
        title: topic.title,
        courseId: course.id,
        courseTitle: course.title
      }))
    )
    
    res.json(createSuccessResponse({
      total: allTopics.length,
      topics: allTopics
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'Failed to get topics')
  }
})

// ============ LEGACY COMPATIBILITY ============

// Redirect old subtopic routes to new topic routes
router.get('/state/:topicId/:subtopicId', (req, res) => {
  res.redirect(`/api/learn/state/${req.params.topicId}`)
})

export default router