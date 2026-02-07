/**
 * Progress Manager - Sara Learning Platform
 * Centralized progress tracking with proper state management
 * Industry-level progress tracking logic
 */

import { upsertProgress, getProgress } from './database.js'
import { findTopicById, getAllTopics } from '../utils/curriculum.js'
import { courses } from '../../data/curriculum.js'

// ============ PROGRESS STATE DEFINITIONS ============

export const PROGRESS_STATES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
}

export const PHASES = {
  SESSION: 'session',
  PLAYTIME: 'playtime', 
  ASSIGNMENT: 'assignment'
}

// ============ CORE PROGRESS MANAGEMENT ============

/**
 * Initialize progress for a topic (first time user starts)
 * This creates the initial progress record
 */
export async function initializeTopicProgress(userId, topicId) {
  console.log(`🚀 Initializing progress for user ${userId}, topic ${topicId}`)
  
  const topic = findTopicById(courses, topicId)
  if (!topic) {
    throw new Error(`Topic not found: ${topicId}`)
  }

  const progressData = {
    status: PROGRESS_STATES.IN_PROGRESS,
    phase: PHASES.SESSION,
    status: 'in_progress',
    session_completed: false,
    playtime_completed: false,
    assignment_completed: false,
    current_assignment: 0,
    total_assignments: topic.tasks?.length || 0,
    assignments_completed: 0,
    started_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  await upsertProgress(userId, topicId, progressData)
  console.log(`✅ Topic ${topicId} initialized as IN_PROGRESS for user ${userId}`)
  
  return progressData
}

/**
 * Mark session phase as completed
 */
export async function completeSessionPhase(userId, topicId) {
  console.log(`📚 Completing session phase for user ${userId}, topic ${topicId}`)
  
  try {
    // Get current progress to preserve existing data
    const currentProgress = await getProgress(userId, topicId)
    console.log(`🔍 Current progress before session completion:`, currentProgress)
    
    const progressUpdate = {
      phase: PHASES.PLAYTIME,  // Set phase to playtime since that's next
      status: 'in_progress',   // Keep as in_progress until topic fully complete
      updated_at: new Date().toISOString()
    }

    // Try to add session_completed flag if the column exists
    try {
      progressUpdate.session_completed = true
    } catch (columnError) {
      console.warn('⚠️ session_completed column may not exist, using phase tracking instead')
    }

    await upsertProgress(userId, topicId, progressUpdate)
    console.log(`✅ Session completed for topic ${topicId}, user should go to playtime next`)
    
    return progressUpdate
  } catch (error) {
    console.error(`❌ Error in completeSessionPhase:`, error)
    throw error
  }
}

/**
 * Start playtime phase
 */
export async function startPlaytimePhase(userId, topicId) {
  console.log(`🎮 Starting playtime phase for user ${userId}, topic ${topicId}`)
  
  const progressUpdate = {
    phase: PHASES.PLAYTIME,
    updated_at: new Date().toISOString()
    // Keep status as 'in_progress'
  }

  await upsertProgress(userId, topicId, progressUpdate)
  console.log(`✅ Playtime started for topic ${topicId}`)
  
  return progressUpdate
}

/**
 * Complete playtime phase
 */
export async function completePlaytimePhase(userId, topicId) {
  console.log(`🎮 Completing playtime phase for user ${userId}, topic ${topicId}`)
  
  try {
    // Get current progress to preserve existing data
    const currentProgress = await getProgress(userId, topicId)
    console.log(`🔍 Current progress before playtime completion:`, currentProgress)
    
    const progressUpdate = {
      phase: PHASES.ASSIGNMENT,  // Set phase to assignment since that's next
      status: 'in_progress',     // Keep as in_progress until all assignments done
      updated_at: new Date().toISOString()
    }

    // Try to add playtime_completed flag if the column exists
    try {
      progressUpdate.playtime_completed = true
    } catch (columnError) {
      console.warn('⚠️ playtime_completed column may not exist, using phase tracking instead')
    }

    await upsertProgress(userId, topicId, progressUpdate)
    console.log(`✅ Playtime completed for topic ${topicId}, user should go to assignments next`)
    
    return progressUpdate
  } catch (error) {
    console.error(`❌ Error in completePlaytimePhase:`, error)
    throw error
  }
}

/**
 * Start assignment phase
 */
export async function startAssignmentPhase(userId, topicId) {
  console.log(`📝 Starting assignment phase for user ${userId}, topic ${topicId}`)
  
  const topic = findTopicById(courses, topicId)
  const totalAssignments = topic?.tasks?.length || 0
  
  const progressUpdate = {
    phase: PHASES.ASSIGNMENT,
    total_assignments: totalAssignments,
    current_assignment: 0,
    updated_at: new Date().toISOString()
    // Keep status as 'in_progress'
  }

  await upsertProgress(userId, topicId, progressUpdate)
  console.log(`✅ Assignment phase started for topic ${topicId} (${totalAssignments} assignments)`)
  
  return progressUpdate
}

/**
 * Complete a single assignment
 */
export async function completeAssignment(userId, topicId, assignmentIndex) {
  console.log(`📝 Completing assignment ${assignmentIndex} for user ${userId}, topic ${topicId}`)
  
  const currentProgress = await getProgress(userId, topicId)
  if (!currentProgress) {
    throw new Error(`No progress found for topic ${topicId}`)
  }

  const completedAssignments = (currentProgress.assignments_completed || 0) + 1
  const totalAssignments = currentProgress.total_assignments || 0
  const isTopicComplete = completedAssignments >= totalAssignments

  const progressUpdate = {
    phase: PHASES.ASSIGNMENT,
    current_assignment: Math.min(assignmentIndex + 1, totalAssignments - 1),
    assignments_completed: completedAssignments,
    updated_at: new Date().toISOString()
  }

  // CRITICAL: Only mark as fully completed when ALL assignments are done
  if (isTopicComplete) {
    progressUpdate.status = PROGRESS_STATES.COMPLETED
    progressUpdate.status = 'completed'
    progressUpdate.assignment_completed = true
    progressUpdate.completed_at = new Date().toISOString()
    
    console.log(`🎉 TOPIC FULLY COMPLETED: ${topicId} for user ${userId}`)
    console.log(`   - Completed ${completedAssignments}/${totalAssignments} assignments`)
  } else {
    console.log(`📝 Assignment ${assignmentIndex + 1} completed for topic ${topicId}`)
    console.log(`   - Progress: ${completedAssignments}/${totalAssignments} assignments`)
  }

  await upsertProgress(userId, topicId, progressUpdate)
  
  return {
    ...progressUpdate,
    isTopicComplete,
    completedAssignments,
    totalAssignments
  }
}

/**
 * Get progress summary for a user
 */
export async function getProgressSummary(userId) {
  const { getAllProgress } = await import('./database.js')
  const allProgress = await getAllProgress(userId)
  
  // Get total topics from curriculum
  const allTopics = getAllTopics(courses)
  const totalTopics = allTopics.length

  // Calculate accurate counts
  const completedTopics = allProgress.filter(p => p.status === 'completed').length
  const inProgressTopics = allProgress.filter(p => p.status === 'in_progress').length
  const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

  console.log(`📊 Progress Summary for user ${userId}:`)
  console.log(`   - Total Topics: ${totalTopics}`)
  console.log(`   - Completed: ${completedTopics}`)
  console.log(`   - In Progress: ${inProgressTopics}`)
  console.log(`   - Completion: ${completionPercentage}%`)

  return {
    total_topics: totalTopics,
    completed_topics: completedTopics,
    in_progress_topics: inProgressTopics,
    completion_percentage: completionPercentage,
    progress_records: allProgress
  }
}

/**
 * Reset all progress for a user (for testing)
 */
export async function resetUserProgress(userId) {
  console.log(`🗑️ Resetting ALL progress for user: ${userId}`)
  
  const { getSupabaseClient } = await import('./database.js')
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

  console.log(`✅ All progress reset for user ${userId}`)
  
  return { success: true, message: 'All progress reset successfully' }
}

// ============ VALIDATION HELPERS ============

/**
 * Check if user can access a specific phase
 */
export async function canAccessPhase(userId, topicId, targetPhase) {
  const progress = await getProgress(userId, topicId)
  
  if (!progress) {
    // No progress - can only access session
    return targetPhase === PHASES.SESSION
  }

  switch (targetPhase) {
    case PHASES.SESSION:
      return true // Always can access session
      
    case PHASES.PLAYTIME:
      return progress.session_completed === true
      
    case PHASES.ASSIGNMENT:
      return progress.playtime_completed === true
      
    default:
      return false
  }
}

/**
 * Get next recommended phase for a user
 */
export async function getNextPhase(userId, topicId) {
  const progress = await getProgress(userId, topicId)
  
  if (!progress) {
    return PHASES.SESSION
  }

  if (progress.status === 'completed') {
    return null // Topic is complete
  }

  if (!progress.session_completed) {
    return PHASES.SESSION
  }

  if (!progress.playtime_completed) {
    return PHASES.PLAYTIME
  }

  return PHASES.ASSIGNMENT
}

export default {
  initializeTopicProgress,
  completeSessionPhase,
  startPlaytimePhase,
  completePlaytimePhase,
  startAssignmentPhase,
  completeAssignment,
  getProgressSummary,
  resetUserProgress,
  canAccessPhase,
  getNextPhase,
  PROGRESS_STATES,
  PHASES
}