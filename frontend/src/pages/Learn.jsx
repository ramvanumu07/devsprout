import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { learning, chat } from '../config/api'

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
  const [currentPhase, setCurrentPhase] = useState('session') // 'session', 'playtime', 'assignment', 'feedback'
  const [phaseProgress, setPhaseProgress] = useState({
    session: false,
    playtime: false,
    assignment: false,
    feedback: false
  })
  const [currentAssignment, setCurrentAssignment] = useState(null)
  const [userCode, setUserCode] = useState('') // Empty - placeholder will show
  const [editorHeight, setEditorHeight] = useState(70) // Default 70% for code editor
  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState(0)
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false)
  const [assignmentFeedback, setAssignmentFeedback] = useState(null)
  const [testResults, setTestResults] = useState(null)

  // Progress tracking function
  const updateProgress = async (progressData) => {
    try {
      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          topicId: topicId,
          ...progressData
        })
      })
      
      if (response.ok) {
        console.log('✅ Progress updated:', progressData)
      } else {
        console.error('❌ Failed to update progress')
      }
    } catch (error) {
      console.error('❌ Progress update error:', error)
    }
  }

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Phase management helpers
  const getPhaseIcon = (phase) => {
    switch(phase) {
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
    switch(phase) {
      case 'session': return true
      case 'playtime': return phaseProgress.session || sessionComplete
      case 'assignment': return phaseProgress.playtime
      case 'feedback': return phaseProgress.assignment
      default: return false
    }
  }

  useEffect(() => {
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
        if (historyResponse.data.success && historyResponse.data.data.messages && historyResponse.data.data.messages.length > 0) {
          console.log('✅ Found existing conversation with', historyResponse.data.data.messages.length, 'messages')

          // Auto-resume session with existing messages
          const existingMessages = historyResponse.data.data.messages
          setMessages(existingMessages)
          setSessionStarted(true)

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
          console.log('📭 No existing conversation - showing overview')
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
        
        // Clear output area
        setTimeout(() => {
          const outputDiv = document.getElementById('terminal-output')
          if (outputDiv) {
            // Clear line numbers on initialization
            const lineNumbersDiv = outputDiv.parentElement.querySelector('.terminal-line-numbers')
            if (lineNumbersDiv) {
              lineNumbersDiv.innerHTML = ''
            }
            
            outputDiv.innerHTML = `
              <div style="color: #10a37f; font-family: Monaco, Consolas, 'SF Mono', 'Courier New', monospace; line-height: 1.4;">
                Click "Run" to execute your code
              </div>
            `
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
        /* Terminal dark theme line numbers */
        .terminal-line-numbers {
          background-color: #2d2d2d !important;
          color: #6b7280 !important;
          border-right: 1px solid #404040 !important;
          overflow-y: hidden !important; /* Hide scrollbar but allow programmatic scroll */
          scrollbar-width: none !important; /* Firefox */
          -ms-overflow-style: none !important; /* IE/Edge */
        }
        
        /* Hide scrollbar for webkit browsers */
        .terminal-line-numbers::-webkit-scrollbar {
          display: none !important;
        }
        
        /* Ensure proper scroll behavior on mobile */
        @media (max-width: 768px) {
          .terminal-line-numbers {
            overflow-y: hidden !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          .playground-output {
            -webkit-overflow-scrolling: touch !important;
            overflow-y: auto !important;
          }
        }
        
        /* Force equal header heights - highest specificity */
        .playground-editor-panel .playground-editor-header,
        .playground-output-panel .playground-output-header {
          height: 56px !important;
          min-height: 56px !important;
          max-height: 56px !important;
        }
        
        /* Universal responsive container system */
        .playground-main-content,
        .assignment-main-content {
          height: 100% !important;
          min-height: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          overflow: hidden !important;
        }
        
        /* Universal panel system */
        .playground-editor-panel,
        .playground-output-panel {
          display: flex !important;
          flex-direction: column !important;
          min-height: 0 !important;
          overflow: hidden !important;
        }
        
        /* Universal scroll containers */
        .playground-output,
        .playground-textarea {
          overflow: auto !important;
          -webkit-overflow-scrolling: touch !important;
          scrollbar-width: thin !important;
        }
        
        /* Universal line numbers */
        .playground-line-numbers,
        .terminal-line-numbers {
          overflow: hidden !important;
          flex-shrink: 0 !important;
        }
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
                      <polygon points="5,3 19,12 5,21"/>
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
                      <polyline points="16,18 22,12 16,6"/>
                      <polyline points="8,6 2,12 8,18"/>
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
              flexDirection: 'column',
              height: '100%',
              minHeight: 0,
              overflow: 'hidden'
            }}>
              {/* Top Panel - Code Editor */}
              <div className="playground-editor-panel" style={{
                height: `${editorHeight}%`,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '200px', // Minimum height for editor
                overflow: 'hidden'
              }}>
                {/* Editor Header */}
                <div className="playground-editor-header" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '0.8rem',
                  color: '#6b7280',
                  minHeight: '56px'
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
                  
                  {/* Action Buttons - Moved from Footer */}
                  <div className="playground-header-actions" style={{ 
                    display: 'flex', 
                    gap: '8px',
                    alignItems: 'center',
                    height: 'auto' 
                  }}>
                    <button
                      onClick={() => {
                        // Execute code and update output
                        const outputDiv = document.getElementById('terminal-output')
                        if (!outputDiv) return

                        try {
                          // Clear previous output
                          outputDiv.innerHTML = ''
                          
                          // Create execution environment
                          const outputs = []
                          const originalConsoleLog = console.log
                          console.log = (...args) => {
                            outputs.push(args.map(arg => String(arg)).join(' '))
                          }
                          
                          try {
                            // Execute code
                            eval(userCode)
                            console.log = originalConsoleLog
                            
                            // Display clean output and update line numbers
                            const outputText = outputs.length > 0 ? outputs.join('\n') : 'No output'
                            const outputLines = outputText.split('\n')
                            
                            // Update line numbers
                            const lineNumbersDiv = outputDiv.parentElement.querySelector('.terminal-line-numbers')
                            if (lineNumbersDiv) {
                              let lineNumbersHTML = ''
                              outputLines.forEach((_, index) => {
                                lineNumbersHTML += `<div style="line-height: 1.4; margin-bottom: 2px; color: #6b7280; text-align: right; padding-right: 2px;">${index + 1}</div>`
                              })
                              lineNumbersDiv.innerHTML = lineNumbersHTML
                            }
                            
                            // Update output content
                            let formattedOutput = ''
                            outputLines.forEach((line) => {
                              formattedOutput += `<div style="line-height: 1.4; margin-bottom: 2px; white-space: pre; padding-left: 2px;">${line || ' '}</div>`
                            })
                            
                            outputDiv.innerHTML = `
                              <div style="font-family: Monaco, Consolas, 'SF Mono', 'Courier New', monospace; line-height: 1.4; color: #10a37f;">
                                ${formattedOutput}
                              </div>
                            `
                            
                            
                          } catch (executionError) {
                            console.log = originalConsoleLog
                            
                            // Display clean error output
                            let errorMessage = `${executionError.name}: ${executionError.message}`
                            
                            // Update line numbers for error
                            const lineNumbersDiv = outputDiv.parentElement.querySelector('.terminal-line-numbers')
                            if (lineNumbersDiv) {
                              lineNumbersDiv.innerHTML = '<div style="line-height: 1.4; margin-bottom: 2px; color: #6b7280; text-align: right; padding-right: 2px;">1</div>'
                            }
                            
                            outputDiv.innerHTML = `
                              <div style="font-family: Monaco, Consolas, 'SF Mono', 'Courier New', monospace; line-height: 1.4;">
                                <div style="line-height: 1.4; margin-bottom: 2px; white-space: pre; color: #dc2626; padding-left: 2px;">${errorMessage}</div>
                              </div>
                            `
                            
                          }
                          
                        } catch (generalError) {
                          // Update line numbers for general error
                          const lineNumbersDiv = outputDiv.parentElement.querySelector('.terminal-line-numbers')
                          if (lineNumbersDiv) {
                            lineNumbersDiv.innerHTML = '<div style="line-height: 1.4; margin-bottom: 2px; color: #6b7280; text-align: right; padding-right: 2px;">1</div>'
                          }
                          
                          outputDiv.innerHTML = `
                            <div style="font-family: Monaco, Consolas, 'SF Mono', 'Courier New', monospace; line-height: 1.4;">
                              <div style="line-height: 1.4; margin-bottom: 2px; white-space: pre; color: #dc2626; padding-left: 2px;">Unexpected error: ${generalError.message}</div>
                            </div>
                          `
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
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease',
                        boxShadow: !userCode.trim() ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        minWidth: '60px',
                        height: '28px',
                        alignSelf: 'flex-start'
                      }}
                    >
                      Run
                    </button>
                    <button
                      onClick={() => {
                        setUserCode('') // Empty code area - placeholder will show
                        const outputDiv = document.getElementById('terminal-output')
                        if (outputDiv) {
                          // Clear line numbers
                          const lineNumbersDiv = outputDiv.parentElement.querySelector('.terminal-line-numbers')
                          if (lineNumbersDiv) {
                            lineNumbersDiv.innerHTML = ''
                          }
                          
                          outputDiv.innerHTML = `
                            <div style="color: #10a37f; font-family: Monaco, Consolas, 'SF Mono', 'Courier New', monospace; line-height: 1.4;">
                              Click "Run" to execute your code
                            </div>
                          `
                        }
                      }}
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        minWidth: '60px',
                        height: '28px',
                        alignSelf: 'flex-start'
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Code Editor with Line Numbers */}
                <div style={{
                  flex: 1, // Take all available space
                  minHeight: '300px', // Minimum height for visibility
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
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                    lineHeight: '1.4',
                    textAlign: 'right',
                    userSelect: 'none',
                    overflow: 'auto', // Allow scrolling for line numbers
                    maxHeight: '100%'
                  }}>
                    {userCode.split('\n').map((_, index) => (
                      <div key={index} style={{ 
                        lineHeight: '1.4',
                        fontSize: '0.875rem'
                      }}>
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
              </div>

              {/* Resizable Splitter */}
              <div 
                className="playground-splitter"
                style={{
                  height: '4px',
                  backgroundColor: 'transparent',
                  cursor: 'row-resize',
                  position: 'relative',
                  zIndex: 10,
                  touchAction: 'none' // Prevent scrolling during touch
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  const startY = e.clientY
                  const startHeight = editorHeight
                  const containerHeight = e.currentTarget.parentElement.clientHeight
                  
                  const handleMouseMove = (e) => {
                    const deltaY = e.clientY - startY
                    const deltaPercent = (deltaY / containerHeight) * 100
                    const newHeight = Math.min(Math.max(startHeight + deltaPercent, 20), 80) // Min 20%, Max 80%
                    setEditorHeight(newHeight)
                  }
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                  }
                  
                  document.addEventListener('mousemove', handleMouseMove)
                  document.addEventListener('mouseup', handleMouseUp)
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  const touch = e.touches[0]
                  const startY = touch.clientY
                  const startHeight = editorHeight
                  const containerHeight = e.currentTarget.parentElement.clientHeight
                  
                  const handleTouchMove = (e) => {
                    const touch = e.touches[0]
                    const deltaY = touch.clientY - startY
                    const deltaPercent = (deltaY / containerHeight) * 100
                    const newHeight = Math.min(Math.max(startHeight + deltaPercent, 20), 80) // Min 20%, Max 80%
                    setEditorHeight(newHeight)
                  }
                  
                  const handleTouchEnd = () => {
                    document.removeEventListener('touchmove', handleTouchMove)
                    document.removeEventListener('touchend', handleTouchEnd)
                  }
                  
                  document.addEventListener('touchmove', handleTouchMove, { passive: false })
                  document.addEventListener('touchend', handleTouchEnd)
                }}
              >
              </div>

              {/* Bottom Panel - Terminal Output */}
              <div className="playground-output-panel" style={{
                height: `${100 - editorHeight}%`,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                minHeight: '100px', // Minimum height for output
                overflow: 'hidden'
              }}>
                {/* Header */}
                <div className="playground-output-header" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '0.8rem',
                  color: '#6b7280',
                  minHeight: '56px'
                }}>
                  <div style={{
                    padding: '4px 12px',
                    backgroundColor: '#ffffff',
                    borderRadius: '4px 4px 0 0',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#111827',
                    border: '1px solid #e5e7eb',
                    borderTop: '1px solid #e5e7eb',
                    borderLeft: '1px solid #e5e7eb',
                    borderRight: '1px solid #e5e7eb',
                    borderBottom: '2px solid #10a37f',
                    position: 'relative',
                    zIndex: 1,
                    marginBottom: '-1px' // Overlap with content border
                  }}>
                    Terminal Output
                  </div>
                </div>

                {/* Terminal Output Content */}
                <div style={{
                  flex: 1,
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #333',
                  borderTop: 'none', // Let tab border connect
                  display: 'flex',
                  minHeight: 0 // Important for flex child to shrink
                }}>
                  {/* Terminal Line Numbers */}
                  <div className="terminal-line-numbers" style={{
                    width: '50px',
                    backgroundColor: '#2d2d2d !important',
                    borderRight: '1px solid #404040 !important',
                    padding: '16px 8px',
                    fontSize: '0.875rem',
                    color: '#6b7280 !important',
                    fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                    lineHeight: '1.4',
                    textAlign: 'right',
                    userSelect: 'none',
                    overflow: 'hidden', // Hide scrollbar but allow programmatic scrolling
                    flexShrink: 0,
                    position: 'relative' // For proper scroll positioning
                  }}>
                    {/* Line numbers will be populated by JavaScript */}
                  </div>
                  
                  {/* Terminal Content Area */}
                  <div
                    id="terminal-output"
                    className="playground-output"
                    onScroll={(e) => {
                      // Sync line numbers with terminal content scroll
                      const lineNumbers = e.target.parentElement.querySelector('.terminal-line-numbers')
                      if (lineNumbers) {
                        lineNumbers.scrollTop = e.target.scrollTop
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '16px',
                      backgroundColor: '#1e1e1e',
                      color: '#10a37f',
                      fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                      overflow: 'auto',
                      minHeight: 0,
                      height: '100%'
                    }}
                  >
                    <div style={{ 
                      color: '#10a37f', 
                      fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                      fontSize: '0.875rem',
                      lineHeight: '1.4'
                    }}>
                      Click "Run" to execute your code
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : currentPhase === 'assignment' ? (
          // Professional Assignment Interface
          <>
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
                          // Always mark current assignment as completed - no tracking dependency
                          const completionResponse = await learning.completeAssignment(topicId, currentAssignmentIndex)
                          console.log('✅ Assignment completed via progress manager:', completionResponse.data)
                        } catch (error) {
                          console.error('❌ Error marking assignment complete (continuing anyway):', error)
                          // Continue regardless of API failure
                        }
                        
                        if (nextIndex < (topic?.tasks?.length || 0)) {
                          // Move to next assignment - no submission requirement
                          setCurrentAssignmentIndex(nextIndex)
                          setCurrentAssignment(topic.tasks[nextIndex])
                          setUserCode('')
                          setAssignmentSubmitted(false)
                          setAssignmentFeedback(null)
                          setTestResults(null)
                          
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
            </div>

            {/* Sticky Footer with Action Buttons */}
            <div className="assignment-sticky-footer" style={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderTop: '2px solid #e5e7eb',
              padding: '12px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 100,
              boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.85rem',
                color: '#6b7280'
              }}>
                <span>Assignment {currentAssignmentIndex + 1} of {topic?.tasks?.length || 0}</span>
                {testResults && (
                  <span style={{
                    color: testResults.every(r => r.passed) ? '#10a37f' : '#dc2626',
                    fontWeight: '500'
                  }}>
                    {testResults.every(r => r.passed) ? '✓ Tests Passed' : '✗ Tests Failed'}
                  </span>
                )}
              </div>
              
              <div className="assignment-sticky-actions" style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    // Execute code and show output
                    const outputDiv = document.getElementById('assignment-output')
                    if (!outputDiv) return

                    try {
                      const outputs = []
                      const originalConsoleLog = console.log
                      console.log = (...args) => {
                        outputs.push(args.map(arg => String(arg)).join(' '))
                      }
                      
                      try {
                        eval(userCode)
                        console.log = originalConsoleLog
                        
                        const outputText = outputs.length > 0 ? outputs.join('\n') : 'No output'
                        outputDiv.innerHTML = `<pre style="margin: 0; color: #10a37f; font-family: Monaco, monospace; line-height: 1.4; white-space: pre-wrap; word-break: break-word;">${outputText}</pre>`
                        
                        
                      } catch (executionError) {
                        console.log = originalConsoleLog
                        
                        let errorMessage = `${executionError.name}: ${executionError.message}`
                        outputDiv.innerHTML = `<pre style="margin: 0; color: #dc2626; font-family: Monaco, monospace; line-height: 1.4; white-space: pre-wrap; word-break: break-word;">${errorMessage}</pre>`
                        
                      }
                      
                    } catch (generalError) {
                      outputDiv.innerHTML = `<pre style="margin: 0; color: #dc2626; font-family: Monaco, monospace;">Unexpected error: ${generalError.message}</pre>`
                    }
                  }}
                  disabled={!userCode.trim()}
                  style={{
                    backgroundColor: !userCode.trim() ? '#e5e7eb' : '#10a37f',
                    color: !userCode.trim() ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: !userCode.trim() ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Run
                </button>
                <button
                  onClick={async () => {
                    if (!userCode.trim() || !currentAssignment) return
                    
                    // Run tests and submit assignment
                    const outputDiv = document.getElementById('assignment-output')
                    const reviewDiv = document.getElementById('assignment-review')
                    
                    // Execute code and validate against test cases
                    try {
                      const outputs = []
                      const originalConsoleLog = console.log
                      console.log = (...args) => {
                        outputs.push(args.map(arg => String(arg)).join(' '))
                      }
                      
                      eval(userCode)
                      console.log = originalConsoleLog
                      
                      const userOutput = outputs.join('\n')
                      const testResults = currentAssignment.testCases.map(testCase => ({
                        expected: testCase.expectedOutput,
                        actual: userOutput,
                        passed: userOutput === testCase.expectedOutput
                      }))
                      
                      const allPassed = testResults.every(result => result.passed)
                      setTestResults(testResults)
                      setAssignmentSubmitted(true)
                      
                      // Show test results in output
                      if (outputDiv) {
                        const resultColor = allPassed ? '#10a37f' : '#dc2626'
                        outputDiv.innerHTML = `<pre style="margin: 0; color: ${resultColor}; font-family: Monaco, monospace; line-height: 1.4;">Output: ${userOutput}\n\nTest Result: ${allPassed ? 'PASSED ✓' : 'FAILED ✗'}</pre>`
                      }
                      
                      // Generate AI review
                      if (reviewDiv) {
                        reviewDiv.innerHTML = '<div style="color: #6b7280; font-style: italic;">Generating code review...</div>'
                        
                        setTimeout(() => {
                          let review = `**Code Review:**\n\n`
                          
                          if (allPassed) {
                            review += `🎉 **Excellent work!** Your solution passes all test cases.\n\n`
                            review += `**What you did well:**\n`
                            review += `- Correct logic implementation\n`
                            review += `- Proper syntax usage\n`
                            review += `- Expected output achieved\n\n`
                            review += `**Professional Tips:**\n`
                            review += `- Consider code readability\n`
                            review += `- Think about edge cases\n`
                            review += `- Practice different approaches\n\n`
                            review += `Ready for the next challenge!`
                          } else {
                            review += `**Almost there!** Let's improve your solution.\n\n`
                            review += `**Issues found:**\n`
                            testResults.forEach((result, index) => {
                              if (!result.passed) {
                                review += `- Expected: "${result.expected}", Got: "${result.actual}"\n`
                              }
                            })
                            review += `\n**Suggestions:**\n`
                            review += `- Check your console.log statement\n`
                            review += `- Verify the exact output format\n`
                            review += `- Test with the expected values\n\n`
                            review += `Try again - you're on the right track!`
                          }
                          
                          reviewDiv.innerHTML = `<div style="color: #111827; line-height: 1.5; white-space: pre-wrap;">${review}</div>`
                        }, 1000)
                      }
                      
                    } catch (error) {
                      setTestResults([{ passed: false, error: error.message }])
                      setAssignmentSubmitted(true)
                      
                      if (outputDiv) {
                        outputDiv.innerHTML = `<pre style="margin: 0; color: #dc2626; font-family: Monaco, monospace;">Error: ${error.message}\n\nTest Result: FAILED ✗</pre>`
                      }
                      
                      if (reviewDiv) {
                        reviewDiv.innerHTML = `<div style="color: #111827; line-height: 1.5;">**Code Review:**\n\nThere's a syntax or runtime error in your code. Please fix the error and try again.\n\n**Error:** ${error.message}</div>`
                      }
                    }
                  }}
                  disabled={!userCode.trim()}
                  style={{
                    backgroundColor: !userCode.trim() ? '#e5e7eb' : '#f59e0b',
                    color: !userCode.trim() ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: !userCode.trim() ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </>
        ) : (
          // Regular Learning Interface (Session/Feedback) 
          <>
        {!sessionStarted ? (
          // Topic Overview - Only show if no existing history
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
        )}
      </main>

      {/* CSS Animations and Mobile Styles */}
      <style>{`
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
        .playground-editor-panel .playground-editor-header,
        .playground-output-header {
          display: flex !important;
          visibility: visible !important;
          background-color: #f9fafb !important;
          border-bottom: 1px solid #e5e7eb !important;
          padding: 8px 16px !important;
          flex-shrink: 0 !important;
        }
        
        /* Code Editor Content Area - Ensure visibility */
        .assignment-left-panel > div:nth-child(3) > div:last-child,
        .playground-editor-panel > div:nth-child(2) > div:last-child {
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
        
        /* Unified Responsive System */
        @media (max-width: 768px) {
          /* Responsive headers */
          .playground-editor-header,
          .playground-output-header {
            height: clamp(48px, 8vh, 64px) !important;
            padding: clamp(8px, 2vh, 16px) !important;
            font-size: clamp(0.7rem, 2vw, 0.8rem) !important;
          }
          
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
          
          /* Responsive layout system */
          .playground-editor-panel,
          .playground-output-panel {
            min-height: clamp(120px, 20vh, 300px) !important;
            max-height: none !important;
          }
          
          .playground-splitter {
            height: clamp(8px, 2vh, 16px) !important;
            background: #e5e7eb !important;
            cursor: row-resize !important;
            touch-action: none !important;
          }
          
          /* Responsive splitter indicator */
          .playground-splitter::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: clamp(30px, 8vw, 50px);
            height: 2px;
            background: #9ca3af;
            border-radius: 1px;
          }
          
          /* Responsive line numbers and content */
          .playground-line-numbers,
          .terminal-line-numbers {
            width: clamp(30px, 8vw, 50px) !important;
            padding: clamp(8px, 2vw, 16px) clamp(4px, 1vw, 8px) !important;
            font-size: clamp(0.65rem, 2vw, 0.75rem) !important;
          }
          
          .playground-textarea,
          .playground-output {
            padding: clamp(8px, 2vw, 16px) !important;
            font-size: clamp(0.65rem, 2vw, 0.75rem) !important;
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
            padding: 12px 16px !important;
            flex-direction: row !important; /* Keep horizontal layout */
            justify-content: space-between !important;
            align-items: center !important;
            gap: 12px !important;
            height: 56px !important; /* Much larger height for proper breathing room */
            min-height: 56px !important;
            max-height: 56px !important;
          }
          
          .playground-header-actions {
            display: flex !important;
            flex-direction: row !important; /* Ensure buttons are side by side */
            flex-shrink: 0 !important; /* Prevent buttons from shrinking */
            gap: 8px !important; /* Normal gap like desktop */
            align-items: center !important;
          }
          
          /* Remove ALL mobile overrides - let inline styles work */
          
          /* Prevent buttons from stretching to full header height */
          .playground-header-actions button {
            height: 28px !important; /* Force button height */
            max-height: 28px !important;
            min-height: 28px !important;
            flex-shrink: 0 !important;
            flex-grow: 0 !important;
            align-self: flex-start !important;
          }
          
          /* Make file tab fit within compact header */
          .playground-editor-header > div:first-child,
          .assignment-editor-header > div:first-child {
            padding: 4px 10px !important;
            font-size: 0.75rem !important;
            flex-shrink: 0 !important;
            border-radius: 4px 4px 0 0 !important;
            height: 28px !important; /* Match button height */
            display: flex !important;
            align-items: center !important;
            line-height: 1 !important;
          }
          
          /* Optimize buttons for mobile */
          .assignment-review-header button {
            padding: 3px 6px !important;
            font-size: 0.65rem !important;
            min-width: 60px !important;
          }
          
          .playground-line-numbers,
          .assignment-line-numbers {
            width: 40px !important;
            padding: 12px 4px !important;
            font-size: 0.75rem !important; /* Match textarea font size */
          }
          
          .playground-textarea,
          .assignment-textarea {
            padding: 8px !important;
            font-size: 0.75rem !important;
            line-height: 1.4 !important; /* Ensure same line height */
            min-height: 200px !important; /* Minimum height for mobile */
            height: auto !important; /* Allow flexible height */
            max-height: calc(40vh - 100px) !important; /* Limit based on viewport */
          }
          
          /* Code editor containers on mobile */
          .playground-editor-panel > div:nth-child(2),
          .assignment-left-panel > div:nth-child(3) {
            flex: 1 !important;
            overflow: hidden !important;
          }
          
          /* Assignment description on mobile */
          .assignment-left-panel > div:nth-child(2) {
            max-height: 150px !important; /* Limit description height on mobile */
            overflow: auto !important;
          }
          
          .assignment-footer button {
            padding: 4px 8px !important;
            font-size: 0.7rem !important;
          }
          
          .playground-output-header,
          .assignment-output-header,
          .assignment-review-header {
            padding: 12px 16px !important;
            font-size: 0.8rem !important;
            height: 56px !important; /* Match editor header height */
            min-height: 56px !important;
          }
          
          .playground-output,
          .assignment-output,
          .assignment-review {
            padding: 8px !important;
            font-size: 0.75rem !important;
            flex: 1 !important; /* Fill available space */
            overflow-y: auto !important;
            line-height: 1.3 !important; /* Tighter line height for mobile */
          }
        }
        
        /* Small mobile optimization */
        @media (max-width: 480px) {
          .playground-editor-header,
          .playground-output-header {
            height: clamp(44px, 10vh, 56px) !important;
            padding: clamp(6px, 1.5vh, 12px) !important;
            font-size: clamp(0.6rem, 2.5vw, 0.75rem) !important;
          }
          
          .playground-line-numbers,
          .terminal-line-numbers {
            width: clamp(25px, 10vw, 40px) !important;
            font-size: clamp(0.6rem, 2.5vw, 0.7rem) !important;
          }
          
          .playground-textarea,
          .playground-output {
            font-size: clamp(0.6rem, 2.5vw, 0.7rem) !important;
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
            flex-direction: column !important; /* Keep vertical layout */
            height: 100vh !important; /* Use full viewport height */
            min-height: 100vh !important;
            max-height: 100vh !important;
            overflow: hidden !important; /* Prevent container overflow */
          }
          
          /* On larger tablets, keep vertical layout but show splitter */
          .playground-editor-panel,
          .assignment-left-panel {
            height: 65% !important;
            width: 100% !important;
            border-bottom: none !important;
            border-right: none !important;
          }
          
          .playground-output-panel,
          .assignment-right-panel {
            height: 30% !important;
            width: 100% !important;
          }
          
          .playground-splitter {
            display: block !important;
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
            flex-direction: column !important; /* Keep vertical layout on desktop */
            min-height: calc(100vh - 180px) !important;
          }
          
          /* Desktop keeps vertical layout with splitter */
          .playground-editor-panel,
          .assignment-left-panel {
            width: 100% !important;
            border-right: none !important;
            border-bottom: none !important;
          }
          
          .playground-output-panel,
          .assignment-right-panel {
            width: 100% !important;
          }
          
          .playground-splitter {
            display: block !important;
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
          .assignment-footer {
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
      `}</style>
    </div>
  )
}

export default Learn