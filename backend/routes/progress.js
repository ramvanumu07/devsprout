import express from 'express'
import { authenticateToken } from './auth.js'
import { getAllProgress, upsertProgress } from '../services/database.js'
import { handleErrorResponse } from '../utils/responses.js'

const router = express.Router()

// DEPRECATED: Use /learn/progress instead
router.get('/', authenticateToken, async (req, res) => {
  console.log('⚠️ DEPRECATED: /api/progress endpoint called. Use /api/learn/progress instead.')
  
  try {
    const progress = await getAllProgress(req.user.userId)
    console.log(`📊 DEPRECATED endpoint: Found ${progress?.length || 0} progress records`)

    // Convert to frontend format (for backward compatibility)
    const formatted = {}
    for (const p of progress) {
      const key = p.topic_id
      formatted[key] = {
        status: p.status,
        phase: p.phase || 'session',
        tasksCompleted: p.current_task || 0,
        startedAt: p.started_at,
        completedAt: p.completed_at
      }
    }

    res.json({ success: true, progress: formatted })
  } catch (error) {
    handleErrorResponse(res, error, 'get progress')
  }
})

// Update progress for a topic
router.post('/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    const { 
      topicId, 
      phase, 
      status, 
      nextPhase,
      currentAssignment,
      totalAssignments,
      completedAssignments,
      topicCompleted,
      completedAt,
      accessedAt,
      updatedAt
    } = req.body

    if (!topicId) {
      return res.status(400).json({
        success: false,
        message: 'Topic ID is required'
      })
    }

    // Prepare progress data
    const progressData = {
      status: status || 'in_progress',
      phase: phase || 'session',
      updated_at: updatedAt || new Date().toISOString()
    }

    // Add optional fields if provided
    if (nextPhase) progressData.next_phase = nextPhase
    if (currentAssignment !== undefined) progressData.current_assignment = currentAssignment
    if (totalAssignments !== undefined) progressData.total_assignments = totalAssignments
    if (completedAssignments !== undefined) progressData.assignments_completed = completedAssignments
    if (topicCompleted !== undefined) progressData.topic_completed = topicCompleted
    if (completedAt) progressData.completed_at = completedAt
    if (accessedAt) progressData.accessed_at = accessedAt

    // Update progress in database
    await upsertProgress(userId, topicId, progressData)

    console.log(`📊 Progress updated for user ${userId}, topic ${topicId}:`, progressData)

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: progressData
    })

  } catch (error) {
    console.error('❌ Progress update error:', error)
    handleErrorResponse(res, error, 'Failed to update progress')
  }
})

export default router
