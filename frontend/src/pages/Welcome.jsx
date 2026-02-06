/**
 * Welcome Page - Sara Learning Platform
 * Branded landing page with animated background and modern design
 */

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Welcome.css'

const Welcome = () => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

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
            <span className="logo-sara">Sara</span>
          </div>
          <nav className="header-nav">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link nav-link-primary">Sign Up</Link>
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
              Your Personal JavaScript Learning Assistant
            </p>
          </div>

          {/* Value Proposition */}
          <div className="value-section">
            <p className="value-text">
              Master JavaScript with personalized AI guidance, interactive coding challenges, 
              and real-time feedback tailored just for you.
            </p>
          </div>

          {/* Features */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Learning</h3>
              <p>Get personalized explanations and hints from Sara, your intelligent coding mentor</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Interactive Practice</h3>
              <p>Learn by doing with hands-on coding exercises and real-time feedback</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Adaptive Progress</h3>
              <p>Track your journey with smart progress tracking that adapts to your pace</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="cta-section">
            <button 
              className="cta-button"
              onClick={handleGetStarted}
            >
              <span>Start Learning Now</span>
              <div className="button-glow"></div>
            </button>
            <p className="cta-subtitle">
              Join thousands of developers mastering JavaScript with Sara
            </p>
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
          <p>&copy; 2026 Sara Learning Platform. Empowering developers worldwide.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#support">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Welcome