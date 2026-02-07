import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { learning, chat } from '../config/api'
import './Learn.css'
import './Learn-responsive.css'

// Component to render message content with proper code block formatting
const MessageContent = ({ content, role }) => {
  const renderContent = (text) => {
    // First handle code blocks (```javascript ... ```)
    const codeBlockParts = text.split(/(```[\s\S]*?```)/g)

    return codeBlockParts.map((part, blockIndex) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code
        const lines = part.slice(3, -3).split('\n')
        const language = lines[0].trim()
        const code = lines.slice(1).join('\n').trim()

        return (
          <div key={blockIndex} className="code-block" style={{
            backgroundColor: '#1e1e1e',
            border: '1px solid #333',
            borderRadius: '6px',
            margin: '8px 0',
            fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
            fontSize: '0.85rem',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
            maxWidth: '100%',
            maxHeight: '400px', // Fixed max height
            display: 'flex',
            flexDirection: 'column',
            WebkitOverflowScrolling: 'touch'
          }}>
            {language && (
              <div style={{
                fontSize: '0.7rem',
                color: '#888',
                padding: '8px 12px 0 12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: '1px solid #333'
              }}>
                {language}
              </div>
            )}
            <div style={{
              padding: '12px',
              overflow: 'auto', // Both horizontal and vertical scroll
              flex: 1,
              minHeight: 0 // Important for scrolling
            }}>
              <pre style={{
                margin: 0,
                whiteSpace: 'pre',
                color: '#f8f8f2',
                lineHeight: '1.3'
              }}>
                {code}
              </pre>
            </div>
          </div>
        )
      } else {
        // Handle inline code (`code`) and regular text
        const inlineCodeParts = part.split(/(`[^`]+`)/g)

        return inlineCodeParts.map((inlinePart, inlineIndex) => {
          if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
            // Inline code
            const code = inlinePart.slice(1, -1)
            return (
              <code key={`${blockIndex}-${inlineIndex}`} style={{
                backgroundColor: '#f1f3f4',
                color: '#d73a49',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                fontSize: '0.9em',
                fontWeight: '600'
              }}>
                {code}
              </code>
            )
          } else {
            // Regular text with line breaks preserved
            return (
              <span key={`${blockIndex}-${inlineIndex}`} style={{ whiteSpace: 'pre-wrap' }}>
                {inlinePart}
              </span>
            )
          }
        })
      }
    })
  }

  return <div>{renderContent(content)}</div>
}

const Learn = () => {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Chat state
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [chatError, setChatError] = useState(null)
  const [historyChecked, setHistoryChecked] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [hasExistingHistory, setHasExistingHistory] = useState(false)
  const [sessionInitializing, setSessionInitializing] = useState(false)
  const [currentPhase, setCurrentPhase] = useState('session') // 'session', 'playtime', 'assignment', 'feedback'
  const [phaseProgress, setPhaseProgress] = useState({
    session: false,
    playtime: false,
    assignment: false,
    feedback: false
  })
  const [currentAssignment, setCurrentAssignment] = useState(null)
  const [userCode, setUserCode] = useState('') // Empty - placeholder will show
  const [lastExecutionState, setLastExecutionState] = useState(null)
  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState(0)
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false)
  const [assignmentFeedback, setAssignmentFeedback] = useState(null)
  const [testResults, setTestResults] = useState(null)

  // Progress tracking function
  const updateProgress = async (progressData) => {
    try {
      console.log('📊 Updating progress for topic:', topicId, progressData)
      
      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sara_token')}`
        },
        body: JSON.stringify({
          topicId: topicId,
          ...progressData
        })
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        console.log('✅ Progress updated successfully:', result.data)
      } else {
        console.error('❌ Failed to update progress:', result.message || 'Unknown error')
      }
    } catch (error) {
      console.error('❌ Progress update error:', error)
    }
  }

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Phase management helpers
  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'session': return '📚 Learning'
      case 'playtime': return '🎮 Playtime'
      case 'assignment': return '📝 Assignment'
      case 'feedback': return '📊 Feedback'
      default: return ''
    }
  }

  const getNextPhase = (currentPhase) => {
    const phases = ['session', 'playtime', 'assignment', 'feedback']
    const currentIndex = phases.indexOf(currentPhase)
    return currentIndex < phases.length - 1 ? phases[currentIndex + 1] : null
  }

  const canAdvanceToPhase = (phase) => {
    switch (phase) {
      case 'session': return true
      case 'playtime': return phaseProgress.session || sessionComplete
      case 'assignment': return phaseProgress.playtime
      case 'feedback': return phaseProgress.assignment
      default: return false
    }
  }

  useEffect(() => {
    // Reset all state when topicId changes
    setMessages([])
    setSessionStarted(false)
    setHistoryChecked(false)
    setHasExistingHistory(false)
    setSessionInitializing(false)
    setSessionComplete(false)
    setChatError(null)
    
    // Load topic data
    loadTopic()
  }, [topicId])

  // Handle phase parameter from URL
  useEffect(() => {
    const phaseParam = searchParams.get('phase')
    if (phaseParam && ['session', 'playtime', 'assignment'].includes(phaseParam)) {
      console.log(`🔄 URL phase parameter detected: ${phaseParam}`)
      setCurrentPhase(phaseParam)

      // Load assignment state if needed
      if (phaseParam === 'assignment' && topic?.tasks) {
        // Get current assignment from progress or start with first
        const currentAssignmentFromProgress = 0 // This should come from progress API
        setCurrentAssignmentIndex(currentAssignmentFromProgress)
        setCurrentAssignment(topic.tasks[currentAssignmentFromProgress])
      }
    }
  }, [searchParams, topic])

  // Initialize new session only if no existing history
  useEffect(() => {
    const shouldInitializeNewSession = (
      historyChecked && 
      !hasExistingHistory && 
      messages.length === 0 && 
      topic && 
      !isTyping &&
      !sessionStarted && // Only if session hasn't been started yet
      !sessionInitializing // Prevent duplicate initialization
    )

    if (shouldInitializeNewSession) {
      console.log('🚀 No existing history found - initializing new session')
      
      const initializeNewSession = async () => {
        try {
          setSessionInitializing(true) // Prevent duplicate calls
          setIsTyping(true)
          
          // Initialize the session and get AI welcome message
          console.log('🚀 Calling session start API for topic:', topicId)
          const sessionResponse = await learning.startSession(topicId, topic.tasks || [])
          
          if (sessionResponse.data.success) {
            console.log('✅ New session initialized with AI welcome message')
            
            // Get the AI-generated welcome message from backend
            const aiWelcomeMessage = sessionResponse.data.message
            
            // Display only AI message
            setMessages([
              { role: 'assistant', content: aiWelcomeMessage, timestamp: new Date() }
            ])
            
            setSessionStarted(true) // Mark session as successfully started
            console.log('🎯 New session ready - AI message displayed')
            
            // Focus on input for user to respond
            setTimeout(() => {
              inputRef.current?.focus()
            }, 500)
          } else {
            console.error('❌ Failed to initialize session:', sessionResponse.data.message)
            setChatError('Failed to start session. Please try again.')
          }
        } catch (err) {
          console.error('Error initializing session:', err)
          setChatError('Failed to start session. Please try again.')
        } finally {
          setIsTyping(false)
          setSessionInitializing(false) // Reset initialization flag
        }
      }
      
      initializeNewSession()
    }
  }, [historyChecked, hasExistingHistory, messages.length, topic, topicId, isTyping, sessionStarted, sessionInitializing])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadTopic = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔄 Loading topic:', topicId)

      // Get topic and history in parallel
      const [topicResponse, historyResponse] = await Promise.all([
        learning.getTopic(topicId),
        chat.getHistory(topicId)
      ])

      console.log('📡 Topic API response:', topicResponse.data)
      console.log('📡 History API response:', historyResponse.data)

      if (topicResponse.data.success) {
        const topicData = topicResponse.data.data.topic
        setTopic(topicData)
        console.log('✅ Topic loaded successfully:', topicData.title)

        // Check if we have existing conversation history
        console.log('🔍 HISTORY DEBUG - Response structure:', {
          success: historyResponse.data.success,
          hasData: !!historyResponse.data.data,
          hasMessages: !!historyResponse.data.data?.messages,
          messagesLength: historyResponse.data.data?.messages?.length,
          messagesType: typeof historyResponse.data.data?.messages
        })
        
        if (historyResponse.data.success && historyResponse.data.data.messages && historyResponse.data.data.messages.length > 0) {
          console.log('✅ EXISTING HISTORY FOUND:', historyResponse.data.data.messages.length, 'messages')
          console.log('📝 Existing messages:', historyResponse.data.data.messages)

          // Auto-resume session with existing messages
          const existingMessages = historyResponse.data.data.messages
          setMessages(existingMessages)
          setSessionStarted(true) // Mark session as active (resuming)
          setHasExistingHistory(true) // Prevent new session initialization
          
          console.log('🎯 EXISTING SESSION RESUMED - No API calls needed')

          // Check if any message contains the completion signal
          const hasCompletionSignal = existingMessages.some(msg =>
            msg.role === 'assistant' &&
            (msg.content.includes('SESSION_COMPLETE_SIGNAL') ||
              (msg.content.includes('🏆') && msg.content.includes('Congratulations')))
          )

          if (hasCompletionSignal) {
            console.log('🎉 Detected completed session from history')
            setSessionComplete(true)
          }

          console.log('🚀 Auto-resumed session - NO WELCOME MESSAGE SENT')

          // Focus on input after loading
          setTimeout(() => {
            inputRef.current?.focus()
          }, 500)
        } else {
          console.log('📭 NO EXISTING HISTORY - Will initialize new session')
          setHasExistingHistory(false) // Mark as no existing history
          // sessionStarted remains false - useEffect will handle new session initialization
        }

        setHistoryChecked(true)
      } else {
        console.log('❌ API returned error:', topicResponse.data)
        setError(topicResponse.data.message || 'Topic not found')
      }
    } catch (err) {
      console.error('❌ Error loading topic:', err)
      setError(err.response?.data?.message || 'Failed to load topic')
    } finally {
      setLoading(false)
    }
  }


  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  const startSession = async () => {
    try {
      console.log('🚀 Manual session start triggered for topic:', topicId)

      // Prevent starting if we already have messages or haven't checked history yet
      if (!historyChecked) {
        console.log('⚠️ Cannot start session - history not checked yet')
        return
      }

      if (messages.length > 0) {
        console.log('⚠️ Cannot start session - messages already exist:', messages.length)
        setSessionStarted(true) // Just show the chat interface
        return
      }

      setIsTyping(true)
      setChatError(null)

      // Start with a welcome message
      const welcomeMessage = "Hello! I'm ready to start learning about " + topic.title + ". Let's begin!"

      console.log('📤 Sending welcome message:', welcomeMessage)

      const response = await learning.sessionChat(topicId, welcomeMessage)

      console.log('📥 Session response:', response.data)

      if (response.data.success) {
        const aiResponse = response.data.data.response

        console.log('🤖 AI Response received:', aiResponse)

        // Add user message and AI response
        setMessages([
          { role: 'user', content: welcomeMessage, timestamp: new Date() },
          { role: 'assistant', content: aiResponse, timestamp: new Date() }
        ])

        setSessionStarted(true)

        // Focus on input after starting session
        setTimeout(() => {
          inputRef.current?.focus()
        }, 500)
      } else {
        setChatError(response.data.message || 'Failed to start session')
      }
    } catch (err) {
      console.error('❌ Error starting session:', err)
      setChatError(err.response?.data?.message || 'Failed to start session')
    } finally {
      setIsTyping(false)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return

    const userMessage = currentMessage.trim()
    setCurrentMessage('')
    setIsTyping(true)
    setChatError(null)

    // Add user message immediately
    const newUserMessage = { role: 'user', content: userMessage, timestamp: new Date() }
    setMessages(prev => [...prev, newUserMessage])

    try {
      console.log('Sending message:', userMessage)

      let response
      switch (currentPhase) {
        case 'session':
          // Prevent sending messages if session is already complete
          if (sessionComplete) {
            setChatError('Session is complete! Click "Start Practicing" to move to the playground phase.')
            return
          }
          response = await learning.sessionChat(topicId, userMessage)
          break
        case 'playtime':
          response = await learning.playtimeChat(topicId, userMessage)
          break
        case 'assignment':
          // For assignment phase, treat messages as hints requests
          response = await learning.getHint(topicId, currentAssignment, userCode)
          break
        case 'feedback':
          // Feedback phase is read-only, no new messages
          setChatError('Feedback phase is complete. Use phase navigation to continue.')
          return
        default:
          response = await learning.sessionChat(topicId, userMessage)
      }

      console.log('Chat response:', response)

      if (response.data.success) {
        const aiResponse = response.data.data.response
        const isComplete = response.data.data.sessionComplete

        console.log('🔍 Frontend Completion Debug:')
        console.log('   - AI Response received:', aiResponse?.substring(0, 200) + '...')
        console.log('   - Session Complete flag:', isComplete)
        console.log('   - Full response data:', response.data.data)

        // Add AI response
        const newAiMessage = { role: 'assistant', content: aiResponse, timestamp: new Date() }
        setMessages(prev => [...prev, newAiMessage])

        // Check if current phase is complete
        if (isComplete) {
          console.log(`🎉 ${currentPhase} phase completed!`)
          setPhaseProgress(prev => ({
            ...prev,
            [currentPhase]: true
          }))

          if (currentPhase === 'session') {
            setSessionComplete(true)

            // Update progress: session completed, ready for playtime
            updateProgress({
              phase: 'session',
              status: 'completed',
              nextPhase: 'playtime',
              completedAt: new Date().toISOString()
            })
          }
        } else {
          console.log(`📚 ${currentPhase} phase still in progress...`)
        }
      } else {
        setChatError(response.data.message || 'Failed to send message')
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setChatError(err.response?.data?.message || 'Failed to send message')
    } finally {
      setIsTyping(false)
    }
  }

  const sendPlaytimeMessage = async (message) => {
    setIsTyping(true)
    setChatError(null)

    try {
      console.log('🎮 Sending playtime message:', message)

      const response = await learning.playtimeChat(topicId, message)

      if (response.data.success) {
        const aiResponse = response.data.data.response

        // Add both user and AI messages
        const userMessage = { role: 'user', content: message, timestamp: new Date() }
        const aiMessage = { role: 'assistant', content: aiResponse, timestamp: new Date() }

        setMessages([userMessage, aiMessage])
      } else {
        setChatError(response.data.message || 'Failed to start playtime')
      }
    } catch (err) {
      console.error('Error starting playtime:', err)
      setChatError(err.response?.data?.message || 'Failed to start playtime')
    } finally {
      setIsTyping(false)
    }
  }

  const handlePhaseChange = async (newPhase) => {
    console.log(`🔄 Changing phase from ${currentPhase} to ${newPhase}`)

    // Update URL to reflect new phase
    setSearchParams({ phase: newPhase })

    setCurrentPhase(newPhase)
    setMessages([])
    setCurrentMessage('')
    setChatError(null)

    // Initialize the new phase
    switch (newPhase) {
      case 'session':
        // Load session history or start fresh
        try {
          const historyResponse = await learning.getHistory(topicId)
          if (historyResponse.data.success && historyResponse.data.data.messages?.length > 0) {
            setMessages(historyResponse.data.data.messages)
          }
        } catch (err) {
          console.error('Error loading session history:', err)
        }
        break

      case 'playtime':
        // Initialize playtime - clean code playground (no welcome message needed)
        setMessages([]) // Clear any previous messages
        setUserCode('') // Empty code area - placeholder will show
        setLastExecutionState(null) // Clear execution state

        // Clear output and AI analysis areas
        setTimeout(() => {
          const outputDiv = document.getElementById('terminal-output')
          const aiDiv = document.getElementById('ai-analysis')
          if (outputDiv) {
            outputDiv.innerHTML = '<pre style="margin: 0; color: #6b7280; font-family: Monaco, monospace;">Click "Run" to execute your code</pre>'
          }
          if (aiDiv) {
            aiDiv.innerHTML = '<div style="color: #6b7280; font-style: italic;">Write some code and run it to get AI analysis</div>'
          }
        }, 100)
        break

      case 'assignment':
        // Initialize assignment phase - load first assignment
        if (topic?.tasks && topic.tasks.length > 0) {
          setCurrentAssignment(topic.tasks[0])
          setCurrentAssignmentIndex(0)
          setUserCode('')
          setAssignmentSubmitted(false)
          setAssignmentFeedback(null)
          setTestResults(null)
          setLastExecutionState(null)
        }
        break

      case 'feedback':
        await initializeFeedbackPhase()
        break
    }
  }

  const initializeAssignmentPhase = async () => {
    try {
      setIsTyping(true)

      // Get assignment for this topic
      const assignment = topic?.tasks?.[0] || {
        description: `Create a console.log program that demonstrates all the concepts you learned in ${topic?.title}`,
        testCases: []
      }

      setCurrentAssignment(assignment)

      // Add assignment introduction message
      const assignmentMessage = {
        role: 'assistant',
        content: `📝 **Assignment Time!**\n\n**Your Task:** ${assignment.description}\n\nWrite your code below and I'll help you if you get stuck. When you're ready, submit your solution for feedback!`,
        timestamp: new Date()
      }

      setMessages([assignmentMessage])
    } catch (err) {
      console.error('Error initializing assignment:', err)
      setChatError('Failed to load assignment')
    } finally {
      setIsTyping(false)
    }
  }

  const initializeFeedbackPhase = async () => {
    if (!userCode || !currentAssignment) {
      setChatError('Please complete the assignment first')
      return
    }

    try {
      setIsTyping(true)

      const response = await learning.getFeedback(topicId, userCode, currentAssignment)

      if (response.data.success) {
        const feedbackMessage = {
          role: 'assistant',
          content: `📊 **Code Feedback**\n\n${response.data.data.feedback}`,
          timestamp: new Date()
        }

        setMessages([feedbackMessage])

        // Mark feedback phase as complete
        setPhaseProgress(prev => ({
          ...prev,
          feedback: true
        }))
      } else {
        setChatError('Failed to get feedback')
      }
    } catch (err) {
      console.error('Error getting feedback:', err)
      setChatError('Failed to get feedback')
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #f3f4f6',
          borderTop: '3px solid #10a37f',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Loading topic...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px',
        textAlign: 'center',
        padding: '24px'
      }}>
        <h2 style={{ color: '#dc2626', marginBottom: '8px' }}>Topic Not Found</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          {error || 'The requested topic could not be found.'}
        </p>
        <button
          onClick={handleBackToDashboard}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10a37f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div style={{
      height: '100vh',
      backgroundColor: sessionStarted ? '#ffffff' : '#f9fafb',
      fontFamily: 'Outfit, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header - Only show when NOT in chat mode */}
      {!sessionStarted && (
        <header style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleBackToDashboard}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                color: '#6b7280',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#10a37f',
              margin: 0
            }}>
              Sara
            </h1>
          </div>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            {topic.title}
          </h2>
        </header>
      )}

      {/* Chat Header - Only show when IN chat mode */}
      {sessionStarted && (
        <header style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleBackToDashboard}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                color: '#6b7280',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h1 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#10a37f',
              margin: 0
            }}>
              Sara
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h2 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              {topic.title} {getPhaseIcon(currentPhase)}
            </h2>

            {/* Single Action Button */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {currentPhase === 'session' && (
                <button
                  onClick={() => {
                    if (sessionComplete) {
                      handlePhaseChange('playtime')

                      // Update progress: user accessed playtime
                      updateProgress({
                        phase: 'playtime',
                        status: 'in_progress',
                        nextPhase: 'assignment',
                        accessedAt: new Date().toISOString()
                      })
                    }
                  }}
                  disabled={!sessionComplete}
                  style={{
                    backgroundColor: sessionComplete ? '#10a37f' : '#e5e7eb',
                    color: sessionComplete ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: sessionComplete ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    opacity: sessionComplete ? 1 : 0.5
                  }}
                  title={sessionComplete ? 'Start practicing in playground' : 'Complete all session outcomes first'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  Play
                </button>
              )}

              {currentPhase === 'playtime' && (
                <button
                  onClick={async () => {
                    try {
                      // Mark playtime as completed using centralized progress manager
                      await learning.completePlaytime(topicId)
                      console.log('✅ Playtime marked as completed via progress manager')

                      // Transition to assignment phase
                      handlePhaseChange('assignment')
                    } catch (error) {
                      console.error('❌ Error completing playtime:', error)
                      // Still allow transition even if API call fails
                      handlePhaseChange('assignment')
                    }
                  }}
                  style={{
                    backgroundColor: '#10a37f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  title="Start coding assignments"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16,18 22,12 16,6" />
                    <polyline points="8,6 2,12 8,18" />
                  </svg>
                  Code
                </button>
              )}

              {currentPhase === 'assignment' && (
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Assignment {currentAssignmentIndex + 1} of {topic?.tasks?.length || 0}
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: sessionStarted ? '0' : '24px',
        maxWidth: sessionStarted ? 'none' : '1000px',
        margin: sessionStarted ? '0' : '0 auto',
        overflow: 'hidden'
      }}>

        {/* Professional Code Playground */}
        {currentPhase === 'playtime' ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#ffffff',
            color: '#111827',
            overflow: 'hidden' // Prevent double scrollbars
          }}>

            {/* Main Content Area */}
            <div className="playground-main-content" style={{
              flex: 1,
              display: 'flex',
              height: 'calc(100vh - 200px)',
              minHeight: '500px',
              overflow: 'auto' // Allow scrolling of the entire playground
            }}>
              {/* Left Panel - Code Editor */}
              <div className="playground-left-panel" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid #404040',
                minWidth: '0', // Important for flex overflow
                minHeight: 0 // Important to prevent expansion
              }}>
                {/* Editor Header */}
                <div className="playground-editor-header" style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '0.8rem',
                  color: '#6b7280'
                }}>
                  <div style={{
                    padding: '4px 12px',
                    backgroundColor: '#ffffff',
                    borderRadius: '4px 4px 0 0',
                    borderBottom: '2px solid #10a37f',
                    color: '#111827',
                    fontWeight: '500'
                  }}>
                    playground.js
                  </div>
                </div>

                {/* Code Editor with Line Numbers */}
                <div style={{
                  flex: 1, // Take available space
                  minHeight: '250px', // Minimum height for visibility
                  maxHeight: 'calc(100vh - 400px)', // Max height to leave room for footer
                  display: 'flex',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  visibility: 'visible',
                  opacity: 1
                }}>
                  {/* Line Numbers */}
                  <div className="playground-line-numbers" style={{
                    width: '50px',
                    backgroundColor: '#f9fafb',
                    borderRight: '1px solid #e5e7eb',
                    padding: '16px 8px',
                    fontSize: '0.8rem',
                    color: '#9ca3af',
                    fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                    lineHeight: '1.4',
                    textAlign: 'right',
                    userSelect: 'none',
                    overflow: 'auto', // Allow scrolling for line numbers
                    maxHeight: '100%'
                  }}>
                    {userCode.split('\n').map((_, index) => (
                      <div key={index} style={{ height: '19.6px' }}>
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  {/* Code Input */}
                  <textarea
                    className="playground-textarea"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    onScroll={(e) => {
                      // Sync line numbers with textarea scroll
                      const lineNumbers = e.target.parentElement.querySelector('.playground-line-numbers')
                      if (lineNumbers) {
                        lineNumbers.scrollTop = e.target.scrollTop
                      }
                    }}
                    placeholder="// Write your JavaScript code here..."
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      padding: '16px',
                      backgroundColor: '#ffffff',
                      color: '#111827',
                      fontSize: '0.875rem',
                      fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                      lineHeight: '1.4',
                      whiteSpace: 'pre',
                      overflowWrap: 'normal',
                      overflowX: 'auto',
                      overflowY: 'auto',
                      tabSize: 2,
                      height: '100%', // Fill container height
                      minHeight: 0 // Important for scrolling
                    }}
                    spellCheck={false}
                  />
                </div>

                {/* Editor Footer with Actions */}
                <div className="playground-footer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 16px',
                  backgroundColor: '#f9fafb',
                  borderTop: '1px solid #e5e7eb',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span>JavaScript</span>
                    <span>UTF-8</span>
                    <span>LF</span>
                  </div>
                  <div className="playground-footer-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={async () => {
                        const outputDiv = document.getElementById('terminal-output')
                        const aiDiv = document.getElementById('ai-analysis')
                        if (!outputDiv) return

                        try {
                          // Show loading state
                          outputDiv.innerHTML = '<div style="color: #6b7280; font-style: italic;">Executing code...</div>'

                          // Execute code securely on server
                          const response = await learning.executeCode(userCode, topicId)

                          if (response.data.success) {
                            const execution = response.data.data.execution

                            if (execution.success) {
                              const outputText = execution.output || 'No output'
                              outputDiv.innerHTML = `<pre style="margin: 0; color: #10a37f; font-family: Monaco, monospace; line-height: 1.4; white-space: pre-wrap; word-break: break-word;">${outputText}</pre>`

                              // Enable AI analysis button and clear previous analysis
                              if (aiDiv) {
                                aiDiv.innerHTML = '<div style="color: #6b7280; font-style: italic;">Click "Explain Code" to get AI analysis of your code and output</div>'
                              }

                              // Store execution state for AI analysis
                              setLastExecutionState({
                                code: userCode,
                                output: outputText,
                                hasError: false
                              })
                            } else {
                              const errorMessage = execution.error || 'Unknown error'
                              outputDiv.innerHTML = `<pre style="margin: 0; color: #dc2626; font-family: Monaco, monospace; line-height: 1.4; white-space: pre-wrap; word-break: break-word;">${errorMessage}</pre>`

                              // Enable AI analysis for errors too
                              if (aiDiv) {
                                aiDiv.innerHTML = '<div style="color: #6b7280; font-style: italic;">Click "Explain Code" to get help with this error</div>'
                              }

                              // Store execution state for AI analysis
                              setLastExecutionState({
                                code: userCode,
                                output: errorMessage,
                                hasError: true
                              })
                            }
                          } else {
                            const errorMessage = response.data.message || 'Server error'
                            outputDiv.innerHTML = `<pre style="margin: 0; color: #dc2626; font-family: Monaco, monospace;">Server Error: ${errorMessage}</pre>`

                            setLastExecutionState({
                              code: userCode,
                              output: errorMessage,
                              hasError: true
                            })
                          }
                        } catch (error) {
                          console.error('Code execution error:', error)
                          const errorMessage = `Network Error: ${error.message}`
                          outputDiv.innerHTML = `<pre style="margin: 0; color: #dc2626; font-family: Monaco, monospace;">${errorMessage}</pre>`

                          setLastExecutionState({
                            code: userCode,
                            output: errorMessage,
                            hasError: true
                          })
                        }
                      }}
                      disabled={!userCode.trim()}
                      style={{
                        backgroundColor: !userCode.trim() ? '#e5e7eb' : '#10a37f',
                        color: !userCode.trim() ? '#9ca3af' : 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        cursor: !userCode.trim() ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Run
                    </button>
                    <button
                      onClick={() => {
                        setUserCode('') // Empty code area - placeholder will show
                        const outputDiv = document.getElementById('terminal-output')
                        const aiDiv = document.getElementById('ai-analysis')
                        if (outputDiv) {
                          outputDiv.innerHTML = '<pre style="margin: 0; color: #6b7280; font-family: Monaco, monospace;">Click "Run" to execute your code</pre>'
                        }
                        if (aiDiv) {
                          aiDiv.innerHTML = '<div style="color: #6b7280; font-style: italic;">Write some code and run it to get AI analysis</div>'
                        }
                        // Clear execution state
                        setLastExecutionState(null)
                      }}
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel - Output & AI */}
              <div className="playground-right-panel" style={{
                width: '45%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff'
              }}>
                {/* Terminal Output */}
                <div style={{
                  height: '50%', // Fixed height instead of flex: 1
                  display: 'flex',
                  flexDirection: 'column',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <div className="playground-output-header" style={{
                    padding: '8px 16px',
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '0.8rem',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Terminal Output
                  </div>
                  <div style={{
                    flex: 1,
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #333',
                    borderRadius: '0 0 6px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0 // Important for flex child to shrink
                  }}>
                    <div
                      id="terminal-output"
                      className="playground-output"
                      style={{
                        flex: 1,
                        padding: '16px',
                        backgroundColor: 'transparent',
                        color: '#10a37f',
                        fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                        fontSize: '0.875rem',
                        overflow: 'auto',
                        minHeight: 0, // Important for scrolling
                        maxWidth: '100%', // Prevent width expansion
                        wordBreak: 'break-word' // Handle long lines
                      }}
                    >
                      <pre style={{ margin: 0, color: '#6b7280' }}>Click "Run" to execute your code</pre>
                    </div>
                  </div>
                </div>

                {/* AI Analysis Panel */}
                <div style={{
                  height: '50%', // Fixed height instead of flex: 1
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div className="playground-ai-header" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '0.8rem',
                    color: '#374151'
                  }}>
                    <span style={{ fontWeight: '500' }}>AI Code Analysis</span>
                    <button
                      onClick={async () => {
                        const aiDiv = document.getElementById('ai-analysis')
                        if (!aiDiv || !lastExecutionState) return

                        const { code, output, hasError } = lastExecutionState

                        // Show loading
                        aiDiv.innerHTML = '<div style="color: #6b7280; font-style: italic;">Analyzing your code...</div>'

                        try {
                          // Simulate AI analysis (replace with actual API call)
                          await new Promise(resolve => setTimeout(resolve, 1500))

                          // Generate analysis based on code and output
                          let analysis = `**Code Analysis:**\n\n`

                          if (hasError) {
                            analysis += `**Error Analysis:**\n`
                            analysis += `Your code encountered an error: ${output}\n\n`
                            analysis += `**Common fixes:**\n`
                            analysis += `- Check for typos in function names\n`
                            analysis += `- Ensure parentheses are balanced\n`
                            analysis += `- Make sure variables are defined\n`
                            analysis += `- End statements with semicolons\n\n`
                          } else {
                            if (code.includes('console.log')) {
                              analysis += `Great! You're using console.log() to display output.\n\n`

                              const logMatches = code.match(/console\.log\([^)]+\)/g)
                              if (logMatches) {
                                analysis += `**What your code does:**\n`
                                logMatches.forEach((match, index) => {
                                  analysis += `${index + 1}. ${match} - Prints the value to the terminal\n`
                                })
                                analysis += `\n`
                              }
                            }

                            if (output !== 'No output') {
                              analysis += `**Output Explanation:**\n`
                              analysis += `Your code successfully executed and produced:\n${output}\n\n`
                            }
                          }

                          analysis += `**Try Next:**\n`
                          analysis += `- Experiment with different data types\n`
                          analysis += `- Try mathematical expressions\n`
                          analysis += `- Combine strings with variables`

                          aiDiv.innerHTML = `<div style="color: #111827; line-height: 1.5; white-space: pre-wrap;">${analysis}</div>`

                        } catch (error) {
                          aiDiv.innerHTML = '<div style="color: #dc2626;">Failed to analyze code. Please try again.</div>'
                        }
                      }}
                      disabled={!lastExecutionState}
                      style={{
                        backgroundColor: lastExecutionState ? '#10a37f' : '#e5e7eb',
                        color: lastExecutionState ? 'white' : '#9ca3af',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                        cursor: lastExecutionState ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Explain Code
                    </button>
                  </div>
                  <div style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0 0 6px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0 // Important for flex child to shrink
                  }}>
                    <div
                      id="ai-analysis"
                      className="playground-ai-content"
                      style={{
                        flex: 1,
                        padding: '16px',
                        backgroundColor: 'transparent',
                        color: '#111827',
                        fontSize: '0.8rem',
                        overflow: 'auto',
                        lineHeight: '1.5',
                        minHeight: 0, // Important for scrolling
                        maxWidth: '100%', // Prevent width expansion
                        wordBreak: 'break-word' // Handle long content
                      }}
                    >
                      <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                        Write some code and run it to get AI analysis
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : currentPhase === 'assignment' ? (
          // Professional Assignment Interface
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#ffffff',
            color: '#111827',
            overflow: 'hidden'
          }}>
            {/* Main Assignment Area */}
            <div className="assignment-main-content" style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr 45%',
              gap: 0,
              height: 'calc(100vh - 140px)', // Reduced to account for sticky footer
              minHeight: '400px',
              overflow: 'hidden' // Prevent main container from scrolling
            }}>
              {/* Left Panel - Assignment Details & Code Editor */}
              <div className="assignment-left-panel" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid #e5e7eb',
                minWidth: '0',
                minHeight: 0, // Important to prevent expansion
                overflow: 'hidden' // Prevent panel from scrolling
              }}>
                {/* Assignment Header */}
                <div className="assignment-header" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 24px',
                  backgroundColor: '#f7f7f8',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  <div style={{ color: '#111827' }}>
                    Assignment {currentAssignmentIndex + 1} of {topic?.tasks?.length || 0}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{topic?.title}</span>
                  </div>
                </div>

                {/* Assignment Question */}
                <div className="assignment-question-section" style={{
                  padding: '16px 24px',
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e5e7eb',
                  maxHeight: '180px', // Increased for better readability
                  minHeight: '120px', // Increased minimum height
                  overflow: 'auto', // Allow scrolling if content is too long
                  flexShrink: 0, // Prevent shrinking
                  zIndex: 20, // Higher z-index to ensure it stays on top
                  position: 'relative', // Ensure proper positioning context
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' // Subtle shadow to separate from code editor
                }}>
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    Task:
                  </h3>
                  <p style={{
                    margin: '0 0 16px 0',
                    fontSize: '0.95rem',
                    color: '#374151',
                    lineHeight: '1.5'
                  }}>
                    {currentAssignment?.description}
                  </p>

                  {/* Test Cases */}
                  {currentAssignment?.testCases && currentAssignment.testCases.length > 0 && (
                    <div>
                      <h4 style={{
                        margin: '0 0 8px 0',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Expected Output:
                      </h4>
                      {currentAssignment.testCases.map((testCase, index) => (
                        <div key={index} style={{
                          padding: '8px 12px',
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          marginBottom: '8px',
                          fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                          fontSize: '0.85rem',
                          color: '#10a37f'
                        }}>
                          {testCase.expectedOutput}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Code Editor */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0, // Important for flex child to shrink
                  overflow: 'hidden' // Prevent code editor container from scrolling
                }}>
                  {/* Editor Header */}
                  <div className="assignment-editor-header" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '0.8rem',
                    color: '#6b7280'
                  }}>
                    <div style={{
                      padding: '4px 12px',
                      backgroundColor: '#ffffff',
                      borderRadius: '4px 4px 0 0',
                      borderBottom: '2px solid #10a37f',
                      color: '#111827',
                      fontWeight: '500'
                    }}>
                      solution.js
                    </div>
                  </div>

                  {/* Code Editor Area */}
                  <div style={{
                    flex: 1, // Take available space
                    minHeight: '200px', // Minimum height for visibility
                    maxHeight: '400px', // Maximum height to prevent footer from being pushed out
                    display: 'flex',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    visibility: 'visible',
                    opacity: 1
                  }}>
                    {/* Line Numbers */}
                    <div className="assignment-line-numbers" style={{
                      width: '50px',
                      backgroundColor: '#f9fafb !important',
                      borderRight: '1px solid #e5e7eb',
                      padding: '16px 8px',
                      fontSize: '0.8rem',
                      color: '#9ca3af !important',
                      fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                      lineHeight: '1.4',
                      textAlign: 'right',
                      userSelect: 'none',
                      overflow: 'auto', // Allow scrolling for line numbers
                      maxHeight: '100%',
                      display: 'block !important',
                      visibility: 'visible !important',
                      opacity: 1,
                      flexShrink: 0
                    }}>
                      {userCode.split('\n').map((_, index) => (
                        <div key={index} style={{ height: '19.6px' }}>
                          {index + 1}
                        </div>
                      ))}
                    </div>

                    {/* Code Input */}
                    <textarea
                      className="assignment-textarea"
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      onScroll={(e) => {
                        // Sync line numbers with textarea scroll
                        const lineNumbers = e.target.parentElement.querySelector('.assignment-line-numbers')
                        if (lineNumbers) {
                          lineNumbers.scrollTop = e.target.scrollTop
                        }
                      }}
                      placeholder="// Write your solution here..."
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        padding: '16px',
                        backgroundColor: '#ffffff !important',
                        color: '#111827 !important',
                        fontSize: '0.875rem',
                        fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                        lineHeight: '1.4',
                        whiteSpace: 'pre',
                        overflowWrap: 'normal',
                        overflowX: 'auto',
                        overflowY: 'auto',
                        tabSize: 2,
                        height: '100%', // Fill container height
                        maxHeight: '100%', // Ensure it doesn't exceed container
                        minHeight: 0, // Important for scrolling
                        display: 'block !important',
                        visibility: 'visible !important',
                        opacity: 1
                      }}
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Editor Footer - Status Only */}
                <div className="assignment-footer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 16px',
                  backgroundColor: '#f9fafb',
                  borderTop: '1px solid #e5e7eb',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  flexShrink: 0 // Prevent footer from shrinking
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span>JavaScript</span>
                    <span>UTF-8</span>
                    <span>LF</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                    Line {userCode.split('\n').length} • {userCode.length} chars
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Output & Review */}
            <div className="assignment-right-panel" style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff'
            }}>
              {/* Output Panel */}
              <div style={{
                height: '50%',
                display: 'flex',
                flexDirection: 'column',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div className="assignment-output-header" style={{
                  padding: '8px 16px',
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '0.8rem',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  Test Output
                </div>
                <div style={{
                  flex: 1,
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #333',
                  borderRadius: '0 0 6px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0 // Important for flex child to shrink
                }}>
                  <div
                    id="assignment-output"
                    className="assignment-output"
                    style={{
                      flex: 1,
                      padding: '16px',
                      backgroundColor: 'transparent',
                      color: '#10a37f',
                      fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      minHeight: 0, // Important for scrolling
                      maxWidth: '100%',
                      wordBreak: 'break-word'
                    }}
                  >
                    <pre style={{ margin: 0, color: '#6b7280' }}>Click "Run" to test your code</pre>
                  </div>
                </div>
              </div>

              {/* Review Panel */}
              <div style={{
                height: '50%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div className="assignment-review-header" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 16px',
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '0.8rem',
                  color: '#374151'
                }}>
                  <span style={{ fontWeight: '500' }}>Code Review & Feedback</span>
                  <button
                    onClick={async () => {
                      const nextIndex = currentAssignmentIndex + 1

                      try {
                        // Require passing tests before completing assignment
                        const completionResponse = await learning.completeAssignment(topicId, currentAssignmentIndex, userCode)
                        console.log('✅ Assignment completed via progress manager:', completionResponse.data)
                      } catch (error) {
                        console.error('❌ Error marking assignment complete:', error)

                        // Show error message to user
                        const errorMessage = error.response?.data?.error || error.message || 'Failed to complete assignment'

                        if (errorMessage.includes('tests are failing')) {
                          alert('❌ Cannot advance to next assignment!\n\nYour code must pass all tests before you can continue. Please:\n\n1. Click "Submit" to run the tests\n2. Fix any failing tests\n3. Try "Next" again when all tests pass')
                        } else {
                          alert(`❌ Error completing assignment: ${errorMessage}`)
                        }

                        return // Don't advance if assignment completion failed
                      }

                      if (nextIndex < (topic?.tasks?.length || 0)) {
                        // Move to next assignment - no submission requirement
                        setCurrentAssignmentIndex(nextIndex)
                        setCurrentAssignment(topic.tasks[nextIndex])
                        setUserCode('')
                        setAssignmentSubmitted(false)
                        setAssignmentFeedback(null)
                        setTestResults(null)
                        setLastExecutionState(null)

                        // Clear output and review
                        const outputDiv = document.getElementById('assignment-output')
                        const reviewDiv = document.getElementById('assignment-review')
                        if (outputDiv) {
                          outputDiv.innerHTML = '<pre style="margin: 0; color: #6b7280; font-family: Monaco, monospace;">Click "Run" to test your code</pre>'
                        }
                        if (reviewDiv) {
                          reviewDiv.innerHTML = '<div style="color: #6b7280; font-style: italic;">Submit your code to get feedback</div>'
                        }
                      } else {
                        // All assignments completed - topic is now completed
                        setPhaseProgress(prev => ({
                          ...prev,
                          assignment: true,
                          feedback: true // Since we combined them
                        }))

                        console.log(`🎉 Topic ${topicId} completed! All assignments finished.`)

                        // Show completion message
                        alert(`🎉 Congratulations! You've mastered ${topic.title}!\n\nAll assignments completed successfully. You can now return to the dashboard to continue with the next topic.`)
                      }
                    }}
                    style={{
                      backgroundColor: '#10a37f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Next
                  </button>
                </div>
                <div style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0 0 6px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0 // Important for flex child to shrink
                }}>
                  <div
                    id="assignment-review"
                    className="assignment-review"
                    style={{
                      flex: 1,
                      padding: '16px',
                      backgroundColor: 'transparent',
                      color: '#111827',
                      fontSize: '0.8rem',
                      overflow: 'auto',
                      lineHeight: '1.5',
                      minHeight: 0, // Important for scrolling
                      maxWidth: '100%',
                      wordBreak: 'break-word'
                    }}
                  >
                    <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                      Submit your code to get feedback
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Action Buttons */}
            <div style={{
              padding: '16px 24px',
              backgroundColor: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={async () => {
                  const outputDiv = document.getElementById('assignment-output')
                  if (!outputDiv) return

                  try {
                    // Show loading state
                    outputDiv.innerHTML = '<div style="color: #6b7280; font-style: italic;">Executing code...</div>'

                    // Execute code securely on server
                    const response = await learning.executeCode(userCode, topicId, currentAssignmentIndex)

                    if (response.data.success) {
                      const execution = response.data.data.execution

                      if (execution.success) {
                        const outputText = execution.output || 'No output'
                        outputDiv.innerHTML = `<pre style="margin: 0; color: #10a37f; font-family: Monaco, monospace; line-height: 1.4; white-space: pre-wrap; word-break: break-word;">${outputText}</pre>`

                        // Store execution state
                        setLastExecutionState({
                          code: userCode,
                          output: outputText,
                          hasError: false
                        })
                      } else {
                        const errorMessage = execution.error || 'Unknown error'
                        outputDiv.innerHTML = `<pre style="margin: 0; color: #dc2626; font-family: Monaco, monospace; line-height: 1.4; white-space: pre-wrap; word-break: break-word;">${errorMessage}</pre>`

                        // Store error state
                        setLastExecutionState({
                          code: userCode,
                          output: errorMessage,
                          hasError: true
                        })
                      }
                    } else {
                      const errorMessage = response.data.message || 'Server error'
                      outputDiv.innerHTML = `<pre style="margin: 0; color: #dc2626; font-family: Monaco, monospace;">Server Error: ${errorMessage}</pre>`
                    }
                  } catch (error) {
                    console.error('Code execution error:', error)
                    outputDiv.innerHTML = `<pre style="margin: 0; color: #dc2626; font-family: Monaco, monospace;">Network Error: ${error.message}</pre>`
                  }
                }}
                disabled={!userCode.trim()}
                style={{
                  backgroundColor: !userCode.trim() ? '#e5e7eb' : '#10a37f',
                  color: !userCode.trim() ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: !userCode.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Run Code
              </button>

              <button
                onClick={async () => {
                  if (!userCode.trim() || !currentAssignment) return

                  const outputDiv = document.getElementById('assignment-output')
                  const reviewDiv = document.getElementById('assignment-review')

                  try {
                    // Show loading state
                    if (outputDiv) {
                      outputDiv.innerHTML = '<div style="color: #6b7280; font-style: italic;">Executing and validating code...</div>'
                    }
                    if (reviewDiv) {
                      reviewDiv.innerHTML = '<div style="color: #6b7280; font-style: italic;">Preparing feedback...</div>'
                    }

                    // Execute code securely on server with test validation
                    const response = await learning.executeCode(userCode, topicId, currentAssignmentIndex)

                    if (response.data.success) {
                      const execution = response.data.data.execution
                      setTestResults(execution.testResults || [])
                      setAssignmentSubmitted(true)

                      // Show execution results
                      if (outputDiv) {
                        const allPassed = execution.allTestsPassed
                        const resultColor = allPassed ? '#10a37f' : '#dc2626'
                        const statusText = allPassed ? 'PASSED ✓' : 'FAILED ✗'

                        let outputHtml = `<pre style="margin: 0; color: #111827; font-family: Monaco, monospace; line-height: 1.4;">`

                        if (execution.output) {
                          outputHtml += `Output: ${execution.output}\n\n`
                        }

                        if (execution.testResults && execution.testResults.length > 0) {
                          outputHtml += `Test Results:\n`
                          execution.testResults.forEach((test, index) => {
                            const testStatus = test.passed ? '✓' : '✗'
                            outputHtml += `Test ${index + 1}: ${testStatus} Expected: "${test.expected}", Got: "${test.actual}"\n`
                          })
                          outputHtml += `\nOverall Result: `
                        } else {
                          outputHtml += `Result: `
                        }

                        outputHtml += `</pre><div style="color: ${resultColor}; font-weight: bold; margin-top: 8px; font-size: 1.1em;">${statusText}</div>`
                        outputDiv.innerHTML = outputHtml
                      }

                      // Generate AI-powered review
                      if (reviewDiv) {
                        reviewDiv.innerHTML = '<div style="color: #6b7280; font-style: italic;">Generating AI code review...</div>'

                        try {
                          const feedbackResponse = await learning.getFeedback(topicId, userCode, currentAssignment)

                          if (feedbackResponse.data.success) {
                            const feedback = feedbackResponse.data.data.feedback
                            reviewDiv.innerHTML = `<div style="color: #111827; line-height: 1.5; white-space: pre-wrap;">${feedback}</div>`
                          } else {
                            // Enhanced fallback review
                            let review = `**Code Review:**\n\n`

                            if (execution.allTestsPassed) {
                              review += `🎉 **Excellent work!** Your solution passes all test cases.\n\n`
                              review += `**What you did well:**\n`
                              review += `- Correct logic implementation\n`
                              review += `- Proper syntax usage\n`
                              review += `- Expected output achieved\n\n`
                              review += `**Professional Tips:**\n`
                              review += `- Consider code readability\n`
                              review += `- Think about edge cases\n`
                              review += `- Practice different approaches\n\n`
                              review += `✅ **Ready for the next challenge!** Click "Next" to continue.`
                            } else {
                              review += `**Almost there!** Let's improve your solution.\n\n`
                              review += `**Issues found:**\n`
                              execution.testResults?.forEach((result, index) => {
                                if (!result.passed) {
                                  review += `- Test ${index + 1}: Expected "${result.expected}", Got "${result.actual}"\n`
                                }
                              })
                              review += `\n**Suggestions:**\n`
                              review += `- Check your console.log statement\n`
                              review += `- Verify the exact output format\n`
                              review += `- Test with the expected values\n\n`
                              review += `💪 **Keep trying!** You're on the right track.`
                            }

                            reviewDiv.innerHTML = `<div style="color: #111827; line-height: 1.5; white-space: pre-wrap;">${review}</div>`
                          }
                        } catch (feedbackError) {
                          console.error('Feedback generation failed:', feedbackError)
                          // Simple fallback without AI
                          const isSuccess = execution.allTestsPassed
                          const message = isSuccess
                            ? `✅ **Great job!** All tests passed. Click "Next" to continue.`
                            : `❌ **Keep trying!** Some tests failed. Check the output above and adjust your code.`
                          reviewDiv.innerHTML = `<div style="color: #111827; line-height: 1.5;">${message}</div>`
                        }
                      }

                    } else {
                      throw new Error(response.data.message || 'Code execution failed')
                    }

                  } catch (error) {
                    console.error('Assignment submission error:', error)
                    setTestResults([{ passed: false, error: error.message }])
                    setAssignmentSubmitted(true)

                    if (outputDiv) {
                      outputDiv.innerHTML = `<pre style="margin: 0; color: #dc2626; font-family: Monaco, monospace;">Error: ${error.message}\n\nTest Result: FAILED ✗</pre>`
                    }

                    if (reviewDiv) {
                      reviewDiv.innerHTML = `<div style="color: #111827; line-height: 1.5;">**Code Review:**\n\nThere was an error executing your code. Please check your syntax and try again.\n\n**Error:** ${error.message}</div>`
                    }
                  }
                }}
                disabled={!userCode.trim()}
                style={{
                  backgroundColor: !userCode.trim() ? '#e5e7eb' : '#f59e0b',
                  color: !userCode.trim() ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: !userCode.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Submit & Test
              </button>
            </div>
          </div>
        ) : (
          // Regular Learning Interface (Session/Feedback) 
          <>
            {false ? (
              // Topic Overview - DISABLED - Always skip to chat interface
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '16px'
                }}>
                  {topic.title}
                </h3>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '12px'
                  }}>
                    Learning Objectives:
                  </h4>
                  <ul style={{ paddingLeft: '20px', color: '#6b7280' }}>
                    {topic.outcomes?.map((outcome, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <p style={{
                    color: '#0c4a6e',
                    margin: 0,
                    fontSize: '0.875rem'
                  }}>
                    💡 Ready to start your personalized learning session with Sara?
                    This topic contains {topic.tasks?.length || 0} practice tasks that we'll work through together.
                  </p>
                </div>

                {chatError && (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px'
                  }}>
                    <p style={{
                      color: '#dc2626',
                      margin: 0,
                      fontSize: '0.875rem'
                    }}>
                      ❌ {chatError}
                    </p>
                  </div>
                )}

                <button
                  onClick={startSession}
                  disabled={isTyping || !historyChecked}
                  style={{
                    padding: '16px 32px',
                    backgroundColor: isTyping ? '#9ca3af' : '#10a37f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isTyping ? 'not-allowed' : 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    width: '100%',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isTyping ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Starting Session...
                    </>
                  ) : (
                    <>
                      🚀 Continue Learning with Sara
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Chat Interface - Full Screen (NO CONTAINER)
              <>
                {/* Chat Messages - Full Screen */}
                <div className="chat-messages" style={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '24px 32px',
                  backgroundColor: '#ffffff',
                  WebkitOverflowScrolling: 'touch'
                }}>
                  {messages.map((message, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      width: '100%',
                      maxWidth: '1000px',
                      margin: '0 auto'
                    }}>
                      <div className={`message-bubble ${message.role === 'user' ? 'user-message' : ''}`} style={{
                        maxWidth: message.role === 'user' ? '70%' : '85%',
                        padding: '12px 16px',
                        borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        backgroundColor: message.role === 'user' ? '#10a37f' : '#f8f9fa',
                        border: message.role === 'assistant' ? '1px solid #e9ecef' : 'none',
                        color: message.role === 'user' ? 'white' : '#212529',
                        fontSize: '0.95rem',
                        lineHeight: '1.5',
                        boxShadow: message.role === 'user' ? '0 2px 6px rgba(16, 163, 127, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        wordBreak: 'break-word'
                      }}>
                        {message.role === 'assistant' && (
                          <div style={{
                            fontSize: '0.75rem',
                            opacity: 0.7,
                            marginBottom: '4px',
                            fontWeight: '600',
                            color: '#10a37f'
                          }}>
                            Sara
                          </div>
                        )}
                        <MessageContent content={message.content} role={message.role} />
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      width: '100%',
                      maxWidth: '1000px',
                      margin: '0 auto'
                    }}>
                      <div style={{
                        maxWidth: '85%',
                        padding: '12px 16px',
                        borderRadius: '16px 16px 16px 4px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        color: '#212529',
                        fontSize: '0.95rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          opacity: 0.7,
                          marginBottom: '4px',
                          fontWeight: '600',
                          color: '#10a37f'
                        }}>
                          Sara
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <div style={{ width: '8px', height: '8px', backgroundColor: '#10a37f', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                          <div style={{ width: '8px', height: '8px', backgroundColor: '#10a37f', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.2s' }}></div>
                          <div style={{ width: '8px', height: '8px', backgroundColor: '#10a37f', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.4s' }}></div>
                          <span style={{ marginLeft: '8px', fontSize: '0.9rem', color: '#6c757d' }}>Sara is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Error */}
                {chatError && (
                  <div style={{
                    padding: '16px 32px',
                    backgroundColor: '#fef2f2',
                    borderTop: '1px solid #fecaca',
                    color: '#dc2626',
                    fontSize: '1rem',
                    textAlign: 'center'
                  }}>
                    ❌ {chatError}
                  </div>
                )}

                {/* Chat Input - Full Width */}
                <div className="chat-input-container" style={{
                  padding: '16px 32px 24px',
                  borderTop: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  flexShrink: 0
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-end',
                    maxWidth: '1000px',
                    margin: '0 auto',
                    width: '100%'
                  }}>
                    <textarea
                      ref={inputRef}
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        currentPhase === 'session' && sessionComplete
                          ? "Session complete! Click 'Start Practicing' above to continue"
                          : "Type your message"
                      }
                      disabled={isTyping || (currentPhase === 'session' && sessionComplete)}
                      className="chat-input"
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        fontFamily: 'inherit',
                        resize: 'none',
                        minHeight: '44px',
                        maxHeight: '120px',
                        backgroundColor: (isTyping || (currentPhase === 'session' && sessionComplete)) ? '#f9fafb' : 'white',
                        color: (isTyping || (currentPhase === 'session' && sessionComplete)) ? '#9ca3af' : '#111827',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        borderColor: currentMessage.trim() ? '#10a37f' : '#e5e7eb'
                      }}
                      rows="1"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!currentMessage.trim() || isTyping || (currentPhase === 'session' && sessionComplete)}
                      className="send-button"
                      style={{
                        padding: '12px 20px',
                        backgroundColor: (!currentMessage.trim() || isTyping || (currentPhase === 'session' && sessionComplete)) ? '#d1d5db' : '#10a37f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: (!currentMessage.trim() || isTyping || (currentPhase === 'session' && sessionComplete)) ? 'not-allowed' : 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                        minWidth: '80px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: (!currentMessage.trim() || isTyping) ? 'none' : '0 1px 4px rgba(16, 163, 127, 0.3)'
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )
        }
      </main >

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* INDUSTRY-LEVEL RESPONSIVE DESIGN - COMPREHENSIVE FIX */
        
        /* CRITICAL: Ensure Code Editor is Always Visible */
        .assignment-textarea,
        .playground-textarea {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          background-color: #ffffff !important;
          color: #111827 !important;
          border: none !important;
          outline: none !important;
          font-family: 'Monaco', 'Consolas', 'SF Mono', 'Courier New', monospace !important;
          font-size: 0.875rem !important;
          line-height: 1.4 !important;
        }
        
        .assignment-line-numbers,
        .playground-line-numbers {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          background-color: #f9fafb !important;
          color: #9ca3af !important;
          border-right: 1px solid #e5e7eb !important;
        }
        
        /* Assignment Task Section - CRITICAL FIX for overlay issues */
        .assignment-question-section {
          position: relative !important;
          z-index: 10 !important;
          flex-shrink: 0 !important;
          background-color: #f8fafc !important;
          border-bottom: 1px solid #e5e7eb !important;
        }
        
        .assignment-question-section h3 {
          margin: 0 0 8px 0 !important;
          font-weight: 600 !important;
          color: #111827 !important;
        }
        
        .assignment-question-section p {
          margin: 0 !important;
          color: #374151 !important;
          line-height: 1.4 !important;
        }
        
        /* Code Editor Container - Ensure visibility */
        .assignment-left-panel > div:nth-child(3) {
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          min-height: 200px !important;
          background-color: #ffffff !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 6px !important;
          position: relative !important;
          z-index: 5 !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* Code Editor Header - Ensure visibility */
        .assignment-left-panel .assignment-editor-header,
        .playground-left-panel .playground-editor-header {
          display: flex !important;
          visibility: visible !important;
          background-color: #f9fafb !important;
          border-bottom: 1px solid #e5e7eb !important;
          padding: 8px 16px !important;
          flex-shrink: 0 !important;
        }
        
        /* Code Editor Content Area - Ensure visibility */
        .assignment-left-panel > div:nth-child(3) > div:last-child,
        .playground-left-panel > div:nth-child(2) > div:last-child {
          flex: 1 !important;
          display: flex !important;
          background-color: #ffffff !important;
          border: 1px solid #e5e7eb !important;
          overflow: hidden !important;
          visibility: visible !important;
        }
        
        /* Ensure proper spacing and no overlaps */
        .assignment-left-panel {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          overflow: hidden !important;
        }
        
        .assignment-header {
          flex-shrink: 0 !important;
          z-index: 15 !important;
          position: relative !important;
        }
        
        /* Base Mobile Styles */
        @media (max-width: 768px) {
          /* Assignment Question Section - Mobile */
          .assignment-question-section {
            max-height: 140px !important;
            padding: 12px 16px !important;
            overflow-y: auto !important;
            z-index: 25 !important;
            position: relative !important;
            background-color: #f8fafc !important;
            border-bottom: 1px solid #e5e7eb !important;
          }
          
          .assignment-question-section h3 {
            font-size: 0.95rem !important;
            margin-bottom: 8px !important;
          }
          
          .assignment-question-section p {
            font-size: 0.85rem !important;
            line-height: 1.4 !important;
          }
          
          /* Code Editor - Mobile - Ensure Visibility */
          .assignment-left-panel > div:nth-child(3) {
            max-height: calc(100vh - 300px) !important;
            min-height: 250px !important;
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            display: flex !important;
            overflow: hidden !important;
          }
          
          /* Code Editor Header - Mobile */
          .assignment-left-panel > div:nth-child(3) > div:first-child {
            background-color: #f9fafb !important;
            border-bottom: 1px solid #e5e7eb !important;
            padding: 8px 16px !important;
            flex-shrink: 0 !important;
          }
          
          /* Code Editor Content Area - Mobile */
          .assignment-left-panel > div:nth-child(3) > div:last-child {
            flex: 1 !important;
            display: flex !important;
            background-color: #ffffff !important;
            overflow: hidden !important;
          }
          
          /* Force textarea visibility */
          .assignment-textarea {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            background-color: #ffffff !important;
            color: #111827 !important;
            border: none !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          /* Force line numbers visibility */
          .assignment-line-numbers {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            background-color: #f9fafb !important;
            color: #9ca3af !important;
            width: 45px !important;
            border-right: 1px solid #e5e7eb !important;
          }
          
          /* Layout Adjustments */
          /* Mobile: Stack panels vertically */
          .playground-main-content,
          .assignment-main-content {
            flex-direction: column !important;
            height: calc(100vh - 180px) !important; /* Account for header and sticky footer */
            overflow-y: auto !important;
            overflow-x: hidden !important;
          }
          
          .playground-left-panel,
          .assignment-left-panel {
            border-right: none !important;
            border-bottom: 1px solid #e5e7eb !important;
            min-height: 350px !important;
            flex-shrink: 0 !important;
          }
          
          .playground-right-panel,
          .assignment-right-panel {
            width: 100% !important;
            min-height: 300px !important;
            max-height: 400px !important;
            flex-shrink: 0 !important;
          }
          
          .playground-right-panel > div,
          .assignment-right-panel > div {
            height: 50% !important;
            max-height: 250px !important;
          }
          
          /* Enable scrolling to access all sections on mobile */
          .playground-main-content,
          .assignment-main-content {
            max-height: calc(100vh - 140px) !important; /* Account for sticky footer */
            overflow-y: auto !important;
            scroll-behavior: smooth !important;
            -webkit-overflow-scrolling: touch !important;
          }

          /* Sticky footer adjustments for mobile */
          .assignment-sticky-footer {
            padding: 8px 16px !important;
            flex-direction: column !important;
            gap: 8px !important;
            align-items: stretch !important;
          }

          .assignment-sticky-actions {
            justify-content: space-between !important;
            width: 100% !important;
          }

          .assignment-sticky-actions button {
            flex: 1 !important;
            padding: 12px 16px !important;
            font-size: 0.85rem !important;
          }
          
          .playground-header,
          .assignment-header {
            padding: 8px 12px !important;
            font-size: 0.8rem !important;
          }
          
          .playground-editor-header,
          .assignment-editor-header {
            padding: 6px 12px !important;
          }
          
          .playground-line-numbers,
          .assignment-line-numbers {
            width: 40px !important;
            padding: 12px 4px !important;
            font-size: 0.7rem !important;
          }
          
          .playground-textarea,
          .assignment-textarea {
            padding: 12px !important;
            font-size: 0.8rem !important;
            height: 300px !important; /* Fixed height on mobile */
          }
          
          /* Code editor containers on mobile */
          .playground-left-panel > div:nth-child(2),
          .assignment-left-panel > div:nth-child(3) {
            max-height: 250px !important; /* Reduced height on mobile */
            flex: 1 !important;
          }
          
          /* Assignment description on mobile */
          .assignment-left-panel > div:nth-child(2) {
            max-height: 150px !important; /* Limit description height on mobile */
            overflow: auto !important;
          }
          
          .playground-footer,
          .assignment-footer {
            padding: 6px 12px !important;
            font-size: 0.7rem !important;
          }
          
          .playground-footer button,
          .assignment-footer button {
            padding: 4px 8px !important;
            font-size: 0.7rem !important;
          }
          
          .playground-output-header,
          .playground-ai-header,
          .assignment-output-header,
          .assignment-review-header {
            padding: 6px 12px !important;
            font-size: 0.75rem !important;
          }
          
          .playground-output,
          .playground-ai-content,
          .assignment-output,
          .assignment-review {
            padding: 12px !important;
            font-size: 0.8rem !important;
            min-height: 120px !important;
            max-height: 200px !important;
            overflow-y: auto !important;
          }
        }
        
        @media (max-width: 480px) {
          /* Small mobile adjustments */
          .playground-header,
          .assignment-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
            padding: 8px 12px !important;
          }
          
          .playground-header-dots {
            align-self: center !important;
          }
          
          .playground-line-numbers,
          .assignment-line-numbers {
            width: 35px !important;
            font-size: 0.65rem !important;
          }
          
          .playground-textarea,
          .assignment-textarea {
            font-size: 0.75rem !important;
          }
          
          .playground-footer,
          .assignment-footer {
            flex-direction: column !important;
            gap: 8px !important;
            align-items: flex-start !important;
          }
          
          .playground-footer-actions,
          .assignment-footer-actions {
            display: flex !important;
            gap: 6px !important;
            width: 100% !important;
            justify-content: space-between !important;
          }

          /* Assignment question section - extra small screens */
          .assignment-question-section {
            max-height: 120px !important;
            padding: 10px 12px !important;
          }

          .assignment-question-section h3 {
            font-size: 0.9rem !important;
          }

          .assignment-question-section p {
            font-size: 0.8rem !important;
          }

          /* Sticky footer - small mobile */
          .assignment-sticky-footer {
            padding: 6px 12px !important;
          }

          .assignment-sticky-actions button {
            padding: 10px 12px !important;
            font-size: 0.8rem !important;
          }
          
          /* Enable smooth scrolling for small screens */
          .playground-main-content,
          .assignment-main-content {
            scroll-behavior: smooth !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          /* Ensure sections are accessible via scroll */
          .playground-left-panel,
          .playground-right-panel,
          .assignment-left-panel,
          .assignment-right-panel {
            scroll-margin-top: 20px !important;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        /* Tablet Styles (769px - 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) {
          .assignment-question-section {
            max-height: 130px !important;
            padding: 14px 20px !important;
          }
          
          .assignment-question-section h3 {
            font-size: 1rem !important;
          }
          
          .assignment-question-section p {
            font-size: 0.9rem !important;
          }
          
          .assignment-left-panel > div:nth-child(3) {
            max-height: calc(100vh - 320px) !important;
            min-height: 300px !important;
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          .playground-main-content,
          .assignment-main-content {
            flex-direction: row !important;
          }
          
          .playground-left-panel,
          .assignment-left-panel {
            width: 50% !important;
            border-right: 1px solid #e5e7eb !important;
            border-bottom: none !important;
          }
          
          .playground-right-panel,
          .assignment-right-panel {
            width: 50% !important;
          }
        }
        
        /* Desktop Styles (1025px+) */
        @media (min-width: 1025px) {
          .assignment-question-section {
            max-height: 160px !important;
            padding: 16px 24px !important;
          }
          
          .assignment-question-section h3 {
            font-size: 1.1rem !important;
          }
          
          .assignment-question-section p {
            font-size: 0.95rem !important;
          }
          
          .assignment-left-panel > div:nth-child(3) {
            max-height: calc(100vh - 380px) !important;
            min-height: 350px !important;
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          .playground-main-content,
          .assignment-main-content {
            flex-direction: row !important;
            min-height: calc(100vh - 180px) !important;
          }
          
          .playground-left-panel,
          .assignment-left-panel {
            width: 50% !important;
            border-right: 1px solid #e5e7eb !important;
            border-bottom: none !important;
          }
          
          .playground-right-panel,
          .assignment-right-panel {
            width: 50% !important;
          }
        }
        
        /* Large Desktop (1440px+) */
        @media (min-width: 1440px) {
          .assignment-question-section {
            max-height: 180px !important;
          }
          
          .assignment-left-panel > div:nth-child(3) {
            max-height: calc(100vh - 400px) !important;
            min-height: 400px !important;
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            display: flex !important;
            flex-direction: column !important;
          }
        }
        
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          /* Chat container padding */
          .chat-messages {
            padding: 16px !important;
            gap: 16px !important;
            max-height: calc(100vh - 180px) !important;
            overflow-y: auto !important;
          }
          
          /* Prevent text overflow in all containers */
          .assignment-header,
          .playground-header {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          
          /* Ensure buttons are always accessible */
          .editor-footer,
          .assignment-footer,
          .playground-footer {
            position: sticky !important;
            bottom: 0 !important;
            background-color: #f9fafb !important;
            z-index: 20 !important;
            border-top: 1px solid #e5e7eb !important;
          }
          
          /* Fix potential z-index issues */
          .assignment-output,
          .playground-output {
            position: relative !important;
            z-index: 5 !important;
          }
          
          /* Ensure proper spacing on all screen sizes */
          .topic-overview,
          .loading-container,
          .error-container {
            margin: 16px !important;
            padding: 16px !important;
            max-width: calc(100vw - 32px) !important;
            box-sizing: border-box !important;
          }
          
          /* Code blocks - prevent overflow and ensure readability */
          .code-block {
            font-size: 0.8rem !important;
            padding: 14px !important;
            margin: 10px 0 !important;
            border-radius: 6px !important;
            max-width: 100% !important;
            overflow-x: auto !important;
            word-wrap: break-word !important;
            white-space: pre-wrap !important;
          }
          
          .code-block pre {
            font-size: 0.8rem !important;
            line-height: 1.3 !important;
            margin: 0 !important;
            white-space: pre-wrap !important;
            word-break: break-word !important;
          }
          
          /* Fix textarea and input sizing issues */
          .playground-textarea,
          .assignment-textarea {
            width: 100% !important;
            box-sizing: border-box !important;
            resize: none !important;
            font-size: 14px !important; /* Prevent zoom on iOS */
            background-color: #ffffff !important;
            color: #111827 !important;
            border: none !important;
            outline: none !important;
            padding: 12px !important;
            font-family: 'Monaco', 'Consolas', monospace !important;
          }
          
          /* Ensure line numbers stay in sync and are visible */
          .playground-line-numbers,
          .assignment-line-numbers {
            flex-shrink: 0 !important;
            width: 45px !important;
            background-color: #f9fafb !important;
            border-right: 1px solid #e5e7eb !important;
            color: #9ca3af !important;
            font-family: 'Monaco', 'Consolas', monospace !important;
            padding: 12px 6px !important;
            overflow: auto !important;
          }
          
          /* Fix button accessibility on touch devices */
          button {
            min-height: 44px !important;
            min-width: 44px !important;
            touch-action: manipulation !important;
          }
          
          /* Prevent horizontal scroll on main containers */
          .playground-main-content,
          .assignment-main-content {
            overflow-x: hidden !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          
          /* Message bubbles - larger on mobile for touch */
          .message-bubble {
            max-width: 95% !important;
            padding: 16px 18px !important;
            font-size: 1rem !important;
            line-height: 1.6 !important;
          }
          
          .user-message {
            max-width: 85% !important;
          }
          
          /* Input area */
          .chat-input {
            padding: 12px 16px !important;
            font-size: 1rem !important;
            min-height: 44px !important;
          }
          
          .send-button {
            padding: 12px 18px !important;
            min-width: 70px !important;
            height: 44px !important;
            font-size: 0.9rem !important;
          }
          
          /* Chat input container */
          .chat-input-container {
            padding: 16px 16px 24px !important;
            gap: 12px !important;
          }
        }
      `}</style >
    </div >
  )
}

export default Learn