import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { learning, progress } from '../config/api'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  // Debug user data
  console.log('🏠 Dashboard - Current user object:', user)
  console.log('🏠 Dashboard - User name specifically:', user?.name)
  console.log('🏠 Dashboard - User name type:', typeof user?.name)
  console.log('🏠 Dashboard - User name length:', user?.name?.length)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('javascript')
  const [userProgress, setUserProgress] = useState([])
  const [progressSummary, setProgressSummary] = useState({})
  const [lastAccessed, setLastAccessed] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showMobileMenu) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showMobileMenu])

  // Prevent horizontal scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflowX = 'hidden'
    } else {
      document.body.style.overflowX = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflowX = 'unset'
    }
  }, [showMobileMenu])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔄 Loading dashboard data...')
      
      // Clear any frontend caches
      if (window.clearCache) {
        window.clearCache()
      }

      const [progressRes, continueRes, coursesRes] = await Promise.all([
        progress.getAll(),
        learning.getContinueLearning(),
        learning.getCourses()
      ])

      console.log('📡 Raw API responses:')
      console.log('Progress API:', progressRes)
      console.log('Continue API:', continueRes)
      console.log('Courses API:', coursesRes)

      if (progressRes.data.success) {
        const progressData = progressRes.data.data.progress || []
        setUserProgress(progressData)
        setProgressSummary(progressRes.data.data.summary || {})
        console.log('📊 User progress loaded:', progressData.length, 'topics')
        console.log('📊 Progress data:', progressData)
        console.log('📊 Full API response:', progressRes.data)
        
        // Store globally for debugging
        window.lastProgressData = progressData
        window.lastProgressResponse = progressRes.data
        
        // Log each record individually
        progressData.forEach((record, index) => {
          console.log(`📊 Progress Record ${index + 1}:`, {
            topic_id: record.topic_id,
            status: record.status,
            phase: record.phase,
            topic_completed: record.topic_completed,
            created_at: record.created_at,
            updated_at: record.updated_at
          })
        })
      } else {
        console.log('❌ Progress API failed:', progressRes.data)
      }

      if (continueRes.data.success && continueRes.data.data.lastAccessed) {
        setLastAccessed(continueRes.data.data.lastAccessed)
        console.log('🎯 Last accessed:', continueRes.data.data.lastAccessed)
      } else {
        console.log('📭 No last accessed data found')
      }

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.data.courses || [])
      }

    } catch (err) {
      console.error('Dashboard load error:', err)
      setError('Failed to load dashboard. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const updateProgressForCourse = (courseId) => {
    const courseTopics = courses.find(c => c.id === courseId)?.topics || []
    const courseProgress = userProgress.filter(p =>
      courseTopics.some(topic => topic.id === p.topic_id)
    )

    console.log(`🔍 FRONTEND DEBUG: updateProgressForCourse(${courseId})`)
    console.log(`   - Course topics count: ${courseTopics.length}`)
    console.log(`   - User progress count: ${userProgress.length}`)
    console.log(`   - Course progress count: ${courseProgress.length}`)
    console.log(`   - Course progress data:`, courseProgress)

    // Step 1: Count fully completed topics (topic_completed = true)
    const fullyCompleted = courseProgress.filter(p =>
      p.topic_completed === true
    ).length
    const completedPhases = fullyCompleted * 3

    console.log(`   - Fully completed topics: ${fullyCompleted}`)
    console.log(`   - Completed phases: ${completedPhases}`)

    // Step 2: Find current active topic (most recently updated, not completed)
    const activeTopics = courseProgress.filter(p => p.topic_completed !== true)
    const currentTopic = activeTopics.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))[0]

    // Step 3: Calculate current topic phase progress
    let currentPhaseProgress = 0
    if (currentTopic) {
      if (currentTopic.phase === 'playtime') {
        currentPhaseProgress = 1  // Session completed
      } else if (currentTopic.phase === 'assignment') {
        currentPhaseProgress = 2  // Session + PlayTime completed
      }
      // If phase === 'session', currentPhaseProgress remains 0 (just started)
      
      console.log(`   - Current topic: ${currentTopic.topic_id}, Phase: ${currentTopic.phase}`)
      console.log(`   - Current phase progress: ${currentPhaseProgress}`)
    }

    // Step 4: Calculate final percentage
    const totalCompletedPhases = completedPhases + currentPhaseProgress
    const totalPossiblePhases = courseTopics.length * 3
    const percentage = totalPossiblePhases > 0 ? Math.round((totalCompletedPhases / totalPossiblePhases) * 100) : 0

    console.log(`   - Total completed phases: ${totalCompletedPhases}`)
    console.log(`   - Total possible phases: ${totalPossiblePhases}`)
    console.log(`   - Accurate percentage: ${percentage}%`)

    return {
      completed_topics: fullyCompleted,
      total_topics: courseTopics.length,
      completion_percentage: percentage
    }
  }

  const handleContinueLearning = () => {
    console.log('🎯 Smart Continue Learning - Analyzing progress...')
    console.log('📊 User Progress:', userProgress)

    // Find the most recent topic with progress
    const recentTopic = userProgress
      .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))[0]

    if (recentTopic) {
      const topicId = recentTopic.topic_id
      const phase = recentTopic.phase
      const status = recentTopic.status
      const currentAssignment = recentTopic.current_assignment || 0
      const topicCompleted = recentTopic.topic_completed

      console.log(`🎯 Most recent topic: ${topicId}, Phase: ${phase}, Status: ${status}`)

      // If topic is completed, find next topic
      if (topicCompleted === true || (status === 'completed' && phase === 'assignment')) {
        const selectedCourseData = courses.find(c => c.id === selectedCourse)
        const currentTopicIndex = selectedCourseData?.topics?.findIndex(t => t.id === topicId)
        
        if (currentTopicIndex !== -1 && currentTopicIndex < (selectedCourseData?.topics?.length - 1)) {
          // Move to next topic's session phase
          const nextTopic = selectedCourseData.topics[currentTopicIndex + 1]
          console.log(`🎯 Topic completed, moving to next topic: ${nextTopic.id}`)
          navigate(`/learn/${nextTopic.id}`)
          return
        } else {
          // Course completed or no more topics
          console.log('🎉 Course completed! Starting from first topic.')
          navigate(`/learn/${selectedCourseData?.topics?.[0]?.id}`)
          return
        }
      }

      // CORRECTED: Smart phase detection using phase-specific completion flags
      let targetPhase = 'session'
      let targetUrl = `/learn/${topicId}`

      console.log('🔍 Progress Debug:', {
        phase: recentTopic.phase,
        status: recentTopic.status,
        session_completed: recentTopic.session_completed,
        playtime_completed: recentTopic.playtime_completed,
        assignment_completed: recentTopic.assignment_completed,
        topic_completed: recentTopic.topic_completed
      })

      // SIMPLIFIED LOGIC: Use phase + status for compatibility with current schema
      if (phase === 'session' && status === 'completed') {
        // Session completed → Go to playtime
        targetPhase = 'playtime'
        targetUrl = `/learn/${topicId}?phase=playtime`
        console.log('🎯 Session completed → Redirecting to playtime')
      } else if (phase === 'playtime' && status === 'completed') {
        // Playtime completed → Go to assignments
        targetPhase = 'assignment'
        targetUrl = `/learn/${topicId}?phase=assignment`
        console.log('🎯 Playtime completed → Redirecting to assignments')
      } else if (phase === 'playtime' && status === 'in_progress') {
        // User is in playtime → Continue playtime
        targetPhase = 'playtime'
        targetUrl = `/learn/${topicId}?phase=playtime`
        console.log('🎯 User in playtime → Continue playtime')
      } else if (phase === 'assignment') {
        // User is in assignments → Continue assignment
        targetPhase = 'assignment'
        targetUrl = `/learn/${topicId}?phase=assignment`
        console.log(`🎯 User in assignments → Continue assignment ${currentAssignment + 1}`)
      } else if (phase === 'session' && status === 'in_progress') {
        // Session in progress → Continue session
        targetPhase = 'session'
        targetUrl = `/learn/${topicId}`
        console.log('🎯 Session in progress → Continue session')
      } else {
        // Default fallback
        targetPhase = phase || 'session'
        targetUrl = phase === 'playtime' ? `/learn/${topicId}?phase=playtime` : 
                   phase === 'assignment' ? `/learn/${topicId}?phase=assignment` : 
                   `/learn/${topicId}`
        console.log(`🎯 Fallback → Continue current phase: ${targetPhase}`)
      }

      navigate(targetUrl)
      return
    }

    // No progress found - start with first topic of selected course
    const selectedCourseData = courses.find(c => c.id === selectedCourse)
    const firstTopic = selectedCourseData?.topics?.[0]
    if (firstTopic) {
      console.log('🎯 No progress found, starting with first topic:', firstTopic.id)
      navigate(`/learn/${firstTopic.id}`)
    }
  }

  const handleCompletedTopicClick = (topicId) => {
    navigate(`/learn/${topicId}`)
  }

  const handleTopicClick = (topicId) => {
    navigate(`/learn/${topicId}`)
  }

  const handleEditProfile = () => {
    navigate('/profile')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getTopicById = (topicId) => {
    for (const course of courses) {
      const topic = course.topics?.find(t => t.id === topicId)
      if (topic) return topic
    }
    return null
  }

  const getTopicStatus = (topicId) => {
    const topicProgress = userProgress.find(p => p.topic_id === topicId)
    if (!topicProgress) return 'not_started'

    // Only consider fully completed if topic_completed is true
    if (topicProgress.status === 'completed' && topicProgress.topic_completed === true) {
      return 'completed'
    }

    // If started but not fully completed, show as in_progress
    if (topicProgress.status === 'in_progress' ||
      (topicProgress.status === 'completed' && topicProgress.topic_completed !== true)) {
      return 'in_progress'
    }

    return topicProgress.status || 'not_started'
  }

  const getTopicPhase = (topicId) => {
    const topicProgress = userProgress.find(p => p.topic_id === topicId)
    return topicProgress?.phase || 'session'
  }

  const getCurrentActiveTopic = () => {
    console.log('🔍 getCurrentActiveTopic - Debug Info:')
    console.log('   - userProgress length:', userProgress.length)
    console.log('   - userProgress data:', userProgress)
    
    // Find current active topic (most recently updated, not completed)
    const activeTopics = userProgress.filter(p => p.topic_completed !== true)
    console.log('   - activeTopics count:', activeTopics.length)
    console.log('   - activeTopics data:', activeTopics)
    
    const currentTopicProgress = activeTopics.sort((a, b) => 
      new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
    )[0]
    
    console.log('   - currentTopicProgress:', currentTopicProgress)

    if (currentTopicProgress) {
      const topic = getTopicById(currentTopicProgress.topic_id)
      console.log('   - found topic:', topic)
      
      const result = {
        ...topic,
        phase: currentTopicProgress.phase,
        progress: currentTopicProgress
      }
      console.log('   - returning result:', result)
      return result
    }
    
    // Fallback: if no active topics, try to find the most recent topic with any progress
    console.log('   - no active topics, trying fallback approach')
    if (userProgress.length > 0) {
      const mostRecentProgress = userProgress.sort((a, b) => 
        new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
      )[0]
      
      console.log('   - most recent progress:', mostRecentProgress)
      
      if (mostRecentProgress) {
        const topic = getTopicById(mostRecentProgress.topic_id)
        console.log('   - fallback topic:', topic)
        
        const result = {
          ...topic,
          phase: mostRecentProgress.phase,
          progress: mostRecentProgress
        }
        console.log('   - fallback result:', result)
        return result
      }
    }
    
    // Final fallback: if no progress at all, return first topic of selected course
    console.log('   - no progress found, showing first topic of selected course')
    const selectedCourseData = courses.find(c => c.id === selectedCourse)
    const firstTopic = selectedCourseData?.topics?.[0]
    if (firstTopic) {
      const result = {
        ...firstTopic,
        phase: 'session',
        progress: null
      }
      console.log('   - returning first topic as fallback:', result)
      return result
    }
    
    console.log('   - no topic found at all, returning null')
    return null
  }

  const getPhaseDisplayName = (phase) => {
    switch (phase) {
      case 'session':
        return 'Learning Session'
      case 'playtime':
        return 'Interactive Practice'
      case 'assignment':
        return 'Coding Assignments'
      default:
        return 'Learning Session'
    }
  }

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'session':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="phase-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
        )
      case 'playtime':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="phase-icon">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        )
      case 'assignment':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="phase-icon">
            <polyline points="9,11 12,14 22,4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        )
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="phase-icon">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        )
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={loadDashboardData} className="retry-button">
          Try Again
        </button>
      </div>
    )
  }

  const selectedCourseData = courses.find(c => c.id === selectedCourse)
  const currentProgressSummary = updateProgressForCourse(selectedCourse)

  // Only show topics that are FULLY completed (topic_completed = true)
  const completedTopics = userProgress.filter(p =>
    p.status === 'completed' && p.topic_completed === true
  )

  return (
    <div className={`dashboard ${showMobileMenu ? 'mobile-menu-open' : ''}`}>
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
      >
        {showMobileMenu ? (
          // Close (X) icon when menu is open
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // Hamburger icon when menu is closed
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Sidebar - Desktop always visible, Mobile toggleable */}
      <div className={`sidebar ${showMobileMenu ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="brand">Sara</h1>
          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
            </div>
            <div className="user-actions">
              <button onClick={handleEditProfile} className="action-btn" title="Edit Profile">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button onClick={handleLogout} className="action-btn" title="Logout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="courses-nav">
          <h3>Courses</h3>
          {courses.map(course => (
            <button
              key={course.id}
              className={`course-item ${selectedCourse === course.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedCourse(course.id)
                setShowMobileMenu(false) // Close mobile menu on selection
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
              {course.title}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Overlay - Disabled for side-by-side layout */}
      {/* 
      <div 
        className={`mobile-overlay ${showMobileMenu ? 'active' : ''}`}
        onClick={() => setShowMobileMenu(false)}
        style={{ display: showMobileMenu ? 'block' : 'none' }}
      />
      */}

      {/* Main Content - Single flowing page */}
      <div className="main-content">
        {/* Course Header */}
        <div className="course-header">
          <h2>{selectedCourseData?.title || 'Course'}</h2>
          <p>{selectedCourseData?.description || 'Master programming concepts step by step with Sara'}</p>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <h3>Your Progress</h3>
          <div className="progress-stats">
            <div className="stat">
              <span className="number">{currentProgressSummary.completed_topics || 0}</span>
              <span className="label">Completed</span>
            </div>
            <div className="stat">
              <span className="number">{currentProgressSummary.total_topics || 0}</span>
              <span className="label">Total Topics</span>
            </div>
            <div className="stat">
              <span className="number">{currentProgressSummary.completion_percentage || 0}%</span>
              <span className="label">Overall</span>
            </div>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${currentProgressSummary.completion_percentage || 0}%` }}
            />
          </div>
        </div>

        {/* Continue Learning Section */}
        <div className="continue-section">
          {/* Current Learning Status Card - Above Button */}
          {(() => {
            const currentTopic = getCurrentActiveTopic()
            console.log('🎯 Rendering current topic card:', currentTopic)
            
            if (currentTopic) {
              return (
                <div className="current-learning-card">
                  <div className="learning-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="learning-icon">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <span className="learning-label">Currently Learning</span>
                  </div>
                  <div className="topic-info">
                    <h4 className="topic-title">{currentTopic.title}</h4>
                    <div className="phase-info">
                      {getPhaseIcon(currentTopic.phase)}
                      <span className="phase-name">{getPhaseDisplayName(currentTopic.phase)}</span>
                    </div>
                  </div>
                </div>
              )
            } else {
              console.log('🎯 No current topic found - card will not render')
              return null
            }
          })()}

          {/* Continue Learning Button */}
          <button
            className="continue-btn"
            onClick={handleContinueLearning}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Continue Learning
          </button>
        </div>

        {/* Completed Topics */}
        {completedTopics.length > 0 && (
          <div className="completed-section">
            <h4>Completed Topics</h4>
            <div className="completed-list">
              {completedTopics.map(topicProgress => {
                const topic = getTopicById(topicProgress.topic_id)
                if (!topic) return null

                return (
                  <button
                    key={topicProgress.topic_id}
                    className="completed-topic"
                    onClick={() => handleCompletedTopicClick(topicProgress.topic_id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                    {topic.title}
                  </button>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard