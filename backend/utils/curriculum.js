/**
 * Curriculum utility functions for processing learning objectives
 * Industry-level reusable functions to eliminate code duplication
 */

/**
 * Format learning objectives for system prompts
 * All topics now use standardized array of strings format
 * 
 * @param {Array<string>} outcomes - Array of learning objective strings
 * @returns {string} - Formatted numbered list of learning objectives
 */
export function formatLearningObjectives(outcomes) {
  if (!outcomes || !Array.isArray(outcomes) || outcomes.length === 0) {
    return 'Master fundamental programming concepts through hands-on practice'
  }

  return outcomes.map((outcome, index) => {
    return `${index + 1}. ${outcome}`
  }).join('\n')
}

/**
 * Validate that learning objectives are properly formatted
 * All objectives must be non-empty strings
 * 
 * @param {Array<string>} outcomes - Array of learning objective strings
 * @returns {Object} - {valid: boolean, errors: string[]}
 */
export function validateLearningObjectives(outcomes) {
  const errors = []

  if (!outcomes || !Array.isArray(outcomes)) {
    errors.push('Learning objectives must be an array')
    return { valid: false, errors }
  }

  if (outcomes.length === 0) {
    errors.push('Learning objectives cannot be empty')
    return { valid: false, errors }
  }

  outcomes.forEach((outcome, index) => {
    if (typeof outcome !== 'string') {
      errors.push(`Learning objective ${index + 1} must be a string`)
    } else if (outcome.trim().length === 0) {
      errors.push(`Learning objective ${index + 1} cannot be empty`)
    }
  })

  return { valid: errors.length === 0, errors }
}

/**
 * Find a topic by ID across all courses
 * @param {Array} courses - Array of course objects
 * @param {string} topicId - Topic ID to find
 * @returns {Object|null} - Topic object or null if not found
 */
export function findTopicById(courses, topicId) {
  console.log(`🔍 Looking for topic: "${topicId}" (type: ${typeof topicId})`)
  
  for (const course of courses) {
    const topic = course.topics.find(t => t.id === topicId)
    if (topic) {
      console.log(`✅ Found topic: "${topic.title}" (id: ${topic.id})`)
      return { ...topic, courseId: course.id, courseTitle: course.title }
    }
  }
  
  // Log available topics for debugging
  const availableTopics = courses.flatMap(course => 
    course.topics.map(topic => topic.id)
  )
  console.log(`❌ Topic "${topicId}" not found. Available topics:`, availableTopics.slice(0, 10))
  
  return null
}

/**
 * Get all topics from all courses
 * @param {Array} courses - Array of course objects
 * @returns {Array} - Array of all topics with course info
 */
export function getAllTopics(courses) {
  return courses.flatMap(course =>
    course.topics.map(topic => ({
      ...topic,
      courseId: course.id,
      courseTitle: course.title
    }))
  )
}
