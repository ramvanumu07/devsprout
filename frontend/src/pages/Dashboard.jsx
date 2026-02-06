import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { learning, progress } from '../config/api'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

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

    // CORRECTED LOGIC: Only count topics as completed if topic_completed = true
    const completed = courseProgress.filter(p =>
      p.topic_completed === true
    ).length

    // CORRECTED LOGIC: Count topics that are started but not fully completed
    const inProgress = courseProgress.filter(p =>
      p.topic_completed !== true  // Any topic that exists but isn't fully completed
    ).length

    console.log(`   - Completed: ${completed}`)
    console.log(`   - In Progress: ${inProgress}`)

    const total = courseTopics.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      completed_topics: completed,
      in_progress_topics: inProgress,
      total_topics: total,
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
              <span className="number">{currentProgressSummary.in_progress_topics || 0}</span>
              <span className="label">In Progress</span>
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
          <button
            className="continue-btn"
            onClick={handleContinueLearning}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            {/* Show "Continue Learning" if user has any progress, otherwise "Start Learning" */}
            {userProgress.length > 0 ? 'Continue Learning' : 'Start Learning'}
          </button>

          {lastAccessed && (
            <div className="last-topic">
              <span className="topic-name">{getTopicById(lastAccessed.topicId)?.title}</span>
              <span className="topic-phase">Phase: {lastAccessed.phase}</span>
            </div>
          )}
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