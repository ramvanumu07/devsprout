/**
 * Welcome Page - Sara Learning Platform
 * Branded landing page with animated background and modern design
 */

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Welcome.css'

const Welcome = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated) {
      console.log('🔄 Welcome: User is authenticated, redirecting to dashboard')
      navigate('/dashboard', { replace: true })
      return
    }

    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [isAuthenticated, navigate])

  const handleGetStarted = () => {
    navigate('/signup')
  }

  return (
    <div className="welcome-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Header */}
      <header className="welcome-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-sara" role="img" aria-label="Sara Learning Platform">Sara</span>
          </div>
          <nav className="header-nav" role="navigation" aria-label="Main navigation">
            <Link to="/login" className="nav-link" aria-label="Login to your account">Login</Link>
            <Link to="/signup" className="nav-link nav-link-primary" aria-label="Create new account">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="welcome-main">
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          {/* Brand Name */}
          <div className="brand-section">
            <h1 className="brand-name">
              <span className="sara-text">Sara</span>
            </h1>
            <p className="brand-tagline">
              Your Personal AI Learning Assistant
            </p>
          </div>

          {/* Value Proposition */}
          <div className="value-section">
            <p className="value-text">
              Master new skills with personalized AI guidance, interactive learning experiences, 
              and real-time feedback tailored just for you.
            </p>
          </div>

          {/* Call to Action */}
          <div className="cta-section">
            <button 
              className="cta-button"
              onClick={handleGetStarted}
              aria-label="Start learning with Sara - Create your account"
            >
              <span>Start Learning Now</span>
              <div className="button-glow"></div>
            </button>
            <p className="cta-subtitle">
              Start your personalized learning journey with Sara today
            </p>
          </div>

          {/* Features */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H9V9H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9H21ZM7 15V17H9V15H7ZM15 15V17H17V15H15ZM11 15V17H13V15H11Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>AI-Powered Learning</h3>
              <p>Get personalized explanations and guidance from Sara, your intelligent learning companion</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 2V13H10V22L17 10H13L17 2H7Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Interactive Practice</h3>
              <p>Learn by doing with hands-on exercises and real-time feedback</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6ZM12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Adaptive Progress</h3>
              <p>Track your journey with smart progress tracking that adapts to your pace</p>
            </div>
          </div>
        </div>

        {/* Floating Code Snippets */}
        <div className="floating-code">
          <div className="code-snippet code-1">
            <span className="code-keyword">const</span> <span className="code-variable">future</span> = <span className="code-string">'bright'</span>
          </div>
          <div className="code-snippet code-2">
            <span className="code-function">console.log</span>(<span className="code-string">'Hello, Sara!'</span>)
          </div>
          <div className="code-snippet code-3">
            <span className="code-keyword">function</span> <span className="code-function">learnWithSara</span>() {'{'}
          </div>
          <div className="code-snippet code-4">
            <span className="code-variable">skills</span>.<span className="code-function">push</span>(<span className="code-string">'JavaScript'</span>)
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="welcome-footer">
        <div className="footer-content">
          <p>&copy; 2026 Sara Learning Platform. Empowering learners worldwide.</p>
        </div>
      </footer>
    </div>
  )
}

export default Welcome