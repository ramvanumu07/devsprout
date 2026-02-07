/**
 * Signup Page - Sara Learning Platform
 * Enhanced registration with validation and modern design
 */

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { validatePassword } from '../utils/passwordValidation'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { validateEmail } from '../utils/emailValidation'
import { getAllSecurityQuestions } from '../utils/securityQuestions'
import './Auth.css'

// Constants
const SUBMIT_COOLDOWN = 2000 // 2 seconds
const MAX_SUBMIT_ATTEMPTS = 10
const SUBMIT_RESET_TIME = 60000 // 1 minute
const SUCCESS_REDIRECT_DELAY = 1000 // 1 second

const Signup = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  let usernameCheckTimeout = null
  let emailCheckTimeout = null
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState(null)
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [emailExists, setEmailExists] = useState(null)
  const [submitAttempts, setSubmitAttempts] = useState(0)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 Signup: User already authenticated, redirecting to dashboard')
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Real-time password validation
    if (name === 'password') {
      const validation = validatePassword(value)
      setPasswordValidation(validation)
    }

    // Username real-time validation and availability check
    if (name === 'username') {
      clearTimeout(usernameCheckTimeout)
      
      // Real-time username format validation
      if (value && !/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
        // Show specific format error in real-time
        let usernameError = ''
        if (value.length < 3) {
          usernameError = 'Username must be at least 3 characters long'
        } else if (value.length > 20) {
          usernameError = 'Username must be no more than 20 characters long'
        } else if (/\s/.test(value)) {
          usernameError = 'Username cannot contain spaces'
        } else if (/^[0-9]/.test(value)) {
          usernameError = 'Username cannot start with a number'
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          usernameError = 'Username can only contain letters, numbers, and underscores'
        } else {
          usernameError = 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
        }
        
        setErrors(prev => ({
          ...prev,
          username: usernameError
        }))
        setUsernameAvailable(undefined)
      } else if (value.length >= 3 && /^[a-zA-Z0-9_]{3,20}$/.test(value)) {
        // Valid format: clear error and check availability
        setErrors(prev => ({
          ...prev,
          username: ''
        }))
        setUsernameAvailable(null)
        usernameCheckTimeout = setTimeout(async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/check-username/${encodeURIComponent(value)}`)
            if (response.data.success) {
              setUsernameAvailable(response.data.data.available)
            }
          } catch (error) {
            console.error('Username check error:', error)
            setUsernameAvailable(null)
          }
        }, 500)
      } else {
        // Too short or empty: clear error and availability
        setErrors(prev => ({
          ...prev,
          username: ''
        }))
        setUsernameAvailable(undefined)
      }
    }

    // Email existence check
    if (name === 'email') {
      clearTimeout(emailCheckTimeout)
      setEmailExists(null)
      
      if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        emailCheckTimeout = setTimeout(async () => {
          try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/check-email`, {
              email: value
            })
            if (response.data.success) {
              setEmailExists(response.data.data.exists)
            }
          } catch (error) {
            console.error('Email check error:', error)
            setEmailExists(null)
          }
        }, 500)
      }
    }
  }



  const validateForm = () => {
    const newErrors = {}

    // Username validation - prioritize format requirements
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      // Show specific format requirements based on the issue
      const username = formData.username
      if (username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters long'
      } else if (username.length > 20) {
        newErrors.username = 'Username must be no more than 20 characters long'
      } else if (/\s/.test(username)) {
        newErrors.username = 'Username cannot contain spaces'
      } else if (/^[0-9]/.test(username)) {
        newErrors.username = 'Username cannot start with a number'
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores'
      } else {
        newErrors.username = 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
      }
    } else if (usernameAvailable === false) {
      newErrors.username = 'Username is already taken'
    } else if (usernameAvailable === null && formData.username.length >= 3 && /^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username = 'Checking availability...'
    }

    // Email validation using advanced validator
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else {
      const emailValidationResult = validateEmail(formData.email)
      if (!emailValidationResult.isValid) {
        newErrors.email = emailValidationResult.errors[0] || 'Please enter a valid email address'
      } else if (emailExists === true) {
        newErrors.email = 'Email is already registered'
      }
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    }

    // Password validation using comprehensive validator
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0] // Show first error
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else     if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.securityQuestion) {
      newErrors.securityQuestion = 'Please select a security question'
    }

    if (!formData.securityAnswer.trim()) {
      newErrors.securityAnswer = 'Security answer is required'
    } else if (formData.securityAnswer.trim().length < 2) {
      newErrors.securityAnswer = 'Security answer must be at least 2 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prevent rapid successive submissions
    const now = Date.now()
    if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
      return
    }

    // Rate limiting
    if (submitAttempts >= MAX_SUBMIT_ATTEMPTS) {
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setIsSubmitting(true)
    setLastSubmitTime(now)
    setSubmitAttempts(prev => prev + 1)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
        username: formData.username.trim(),
        email: formData.email.trim(),
        name: formData.name.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer.trim()
      })

      if (response.data.success) {
        // Account created successfully
        
        // Store token
        localStorage.setItem('sara_token', response.data.data.token)

        // Store user info
        localStorage.setItem('sara_user', JSON.stringify(response.data.data.user))

        // Navigate to dashboard
        setTimeout(() => {
          navigate('/dashboard')
        }, SUCCESS_REDIRECT_DELAY)
      }
    } catch (error) {
      console.error('Signup error:', error)

      if (error.response?.data?.message || error.response?.data?.error) {
        const errorMessage = error.response.data.message || error.response.data.error
        
        // Handle specific field errors
        if (errorMessage.includes('Username already exists')) {
          setErrors({ username: 'Username already exists' })
        } else if (errorMessage.includes('Email already registered')) {
          setErrors({ email: 'Email already registered' })
        } else if (errorMessage.includes('Password')) {
          setErrors({ password: errorMessage })
        } else {
          setErrors({ general: errorMessage })
        }
      } else {
        const fallbackMessage = 'Failed to create account. Please try again.'
        setErrors({ general: fallbackMessage })
      }
    } finally {
      setIsLoading(false)
      setIsSubmitting(false)
      
      // Reset submit attempts after timeout
      setTimeout(() => {
        setSubmitAttempts(0)
      }, SUBMIT_RESET_TIME)
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
            <h1>Create Your Account</h1>
            <p>Join Sara and start your personalized learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {errors.general && (
              <div className="username-status">
                <span className="status-taken">{errors.general}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${errors.username ? 'error' : (usernameAvailable === true ? 'success' : '')}`}
                placeholder="Choose a unique username"
                disabled={isLoading}
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                required
              />
              {errors.username && (
                <div 
                  id="username-error"
                  className="error-message"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.username}
                </div>
              )}
              
              {/* Simple username status */}
              {!errors.username && formData.username.length >= 3 && /^[a-zA-Z0-9_]{3,20}$/.test(formData.username) && (
                <div className="username-status">
                  {usernameAvailable === null && (
                    <span className="status-checking">Checking availability...</span>
                  )}
                  {usernameAvailable === true && (
                    <span className="status-available">Username is available</span>
                  )}
                  {usernameAvailable === false && (
                    <span className="status-taken">Username is already taken</span>
                  )}
                </div>
              )}
              
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="your.email@example.com"
                disabled={isLoading}
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                inputMode="email"
                required
              />
              {errors.email && (
                <div className="username-status">
                  <span className="status-taken">{errors.email}</span>
                </div>
              )}
              
              
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Your full name"
                disabled={isLoading}
                autoComplete="name"
                autoCapitalize="words"
                required
              />
              {errors.name && (
                <div className="username-status">
                  <span className="status-taken">{errors.name}</span>
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
                  className={`form-input ${errors.password ? 'error' : (passwordValidation?.isValid ? 'success' : '')}`}
                  placeholder="Create a secure password"
                  disabled={isLoading}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  tabIndex={0}
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
              
              {/* Password Strength */}
              {formData.password && passwordValidation && (
                <PasswordStrengthMeter 
                  password={formData.password}
                  validationResult={passwordValidation}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="text"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'error' : (formData.password && formData.confirmPassword && formData.password === formData.confirmPassword ? 'success' : '')}`}
                placeholder="Confirm your password"
                disabled={isLoading}
                autoComplete="new-password"
                required
              />
              {errors.confirmPassword && (
                <div className="username-status">
                  <span className="status-taken">{errors.confirmPassword}</span>
                </div>
              )}
              
            </div>

            {/* Security Question */}
            <div className="form-group security-question-group">
              <label htmlFor="securityQuestion" className="form-label">
                Security Question
              </label>
              <select
                id="securityQuestion"
                name="securityQuestion"
                value={formData.securityQuestion}
                onChange={handleChange}
                className={`security-question-select ${errors.securityQuestion ? 'error' : (formData.securityQuestion ? 'success' : '')}`}
                disabled={isLoading}
                required
                aria-label="Choose a security question for password recovery"
              >
                <option value="" disabled>Select</option>
                {getAllSecurityQuestions().map((question) => (
                  <option key={question.id} value={question.id} title={question.question}>
                    {question.question}
                  </option>
                ))}
              </select>
              {errors.securityQuestion && (
                <div className="username-status">
                  <span className="status-taken">{errors.securityQuestion}</span>
                </div>
              )}
            </div>

            {/* Security Answer */}
            <div className="form-group">
              <label htmlFor="securityAnswer" className="form-label">
                Security Answer
              </label>
              <input
                type="text"
                id="securityAnswer"
                name="securityAnswer"
                value={formData.securityAnswer}
                onChange={handleChange}
                className={`form-input ${errors.securityAnswer ? 'error' : (formData.securityAnswer && formData.securityAnswer.length >= 2 ? 'success' : '')}`}
                placeholder="Enter your answer"
                disabled={isLoading}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                required
                aria-label="Enter your answer to the security question"
              />
              {errors.securityAnswer && (
                <div className="username-status">
                  <span className="status-taken">{errors.securityAnswer}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`auth-submit-btn ${isLoading || isSubmitting ? 'loading' : ''}`}
              disabled={isLoading || isSubmitting || usernameAvailable === false}
            >
              {isLoading || isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
            
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

    </div>
  )
}

export { Signup }
export default Signup