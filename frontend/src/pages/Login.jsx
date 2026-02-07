/**
 * Login Page - Sara Learning Platform
 * Enhanced login with username/email support and forgot password
 */

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import './Auth.css'

// Constants
const MAX_LOGIN_ATTEMPTS = 5
const RATE_LIMIT_WINDOW = 300000 // 5 minutes
const SUBMIT_COOLDOWN = 1000 // 1 second

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lastAttemptTime, setLastAttemptTime] = useState(0)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 Login: User already authenticated, redirecting to dashboard')
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear field-specific errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Clear general error when user starts typing in any field
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'Username or email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Rate limiting check
    const now = Date.now()
    if (now - lastAttemptTime < SUBMIT_COOLDOWN) {
      setErrors({ general: 'Please wait before trying again' })
      return
    }

    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      setErrors({ general: 'Too many login attempts. Please wait 5 minutes before trying again.' })
      return
    }

    setIsLoading(true)
    setLastAttemptTime(now)

    try {
      console.log('🔐 Login Page - Starting login process')
      const result = await login(formData.usernameOrEmail.trim(), formData.password)

      if (result.success) {
        console.log('🔐 Login Page - Login successful:', result.user)
        // Reset login attempts on success
        setLoginAttempts(0)
        
        // Brief success indication
        setErrors({ general: '' })
        
        // Navigate to dashboard with slight delay for UX
        setTimeout(() => {
          navigate('/dashboard')
        }, 500)
      } else {
        console.log('🔐 Login Page - Login failed:', result.error)
        setErrors({ general: result.error || 'Login failed' })
        setLoginAttempts(prev => prev + 1)
      }
    } catch (error) {
      console.error('🔐 Login Page - Unexpected error:', error)
      setErrors({ general: 'Something went wrong. Please try again.' })
      setLoginAttempts(prev => prev + 1)
    } finally {
      setIsLoading(false)
      
      // Reset attempts after timeout
      setTimeout(() => {
        setLoginAttempts(0)
      }, RATE_LIMIT_WINDOW)
    }
  }

  return (
    <div className="auth-container">
      {/* Background */}
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Header */}
      <header className="auth-header">
        <Link to="/" className="logo">
          <span className="logo-sara">Sara</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue your personalized learning journey with Sara</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {errors.general && (
              <div className="username-status">
                <span className="status-taken">{errors.general}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="usernameOrEmail" className="form-label">
                Username or Email
              </label>
              <input
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                className={`form-input ${errors.usernameOrEmail ? 'error' : ''}`}
                placeholder="Username or email address"
                disabled={isLoading}
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                required
              />
              {errors.usernameOrEmail && (
                <div className="username-status">
                  <span className="status-taken">{errors.usernameOrEmail}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      // Eye slash (hide)
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    ) : (
                      // Eye (show)
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <div className="username-status">
                  <span className="status-taken">{errors.password}</span>
                </div>
              )}
            </div>

            <div className="form-options">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className={`auth-submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login