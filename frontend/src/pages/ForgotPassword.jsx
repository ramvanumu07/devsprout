/**
 * Forgot Password Page - Sara Learning Platform
 * Security question-based password recovery
 */

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { getSecurityQuestionById } from '../utils/securityQuestions'
import './Auth.css'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [step, setStep] = useState(1) // 1: username, 2: security question, 3: new password, 4: success
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    securityAnswer: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [userInfo, setUserInfo] = useState(null)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 ForgotPassword: User already authenticated, redirecting to dashboard')
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
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateStep1 = () => {
    const newErrors = {}
    const input = formData.usernameOrEmail.trim()

    if (!input) {
      newErrors.usernameOrEmail = 'Username or email is required'
    } else if (input.includes('@') && !validateEmail(input)) {
      newErrors.usernameOrEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (!formData.securityAnswer.trim()) {
      newErrors.securityAnswer = 'Security answer is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStep1Submit = async (e) => {
    e.preventDefault()
    
    if (!validateStep1()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/get-security-question`, {
        usernameOrEmail: formData.usernameOrEmail.trim()
      })

      if (response.data.success) {
        setUserInfo(response.data.data)
        setStep(2)
        setErrors({})
      }
    } catch (error) {
      console.error('Get security question error:', error)
      
      let errorMessage = 'Something went wrong. Please try again.'

      if (error.response) {
        const status = error.response.status
        const serverMessage = error.response.data?.error || error.response.data?.message

        switch (status) {
          case 404:
            errorMessage = 'Account with this username/email does not exist'
            break
          case 400:
            errorMessage = 'Please check your input and try again'
            break
          default:
            if (serverMessage) {
              errorMessage = serverMessage
            }
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.'
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Submit = async (e) => {
    e.preventDefault()
    
    if (!validateStep2()) {
      return
    }

    setIsLoading(true)

    try {
      // Verify security answer first before proceeding to password reset
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-security-answer-only`, {
        usernameOrEmail: formData.usernameOrEmail.trim(),
        securityAnswer: formData.securityAnswer.trim()
      })

      if (response.data.success) {
        // Security answer is correct, proceed to password reset step
        setStep(3)
        setErrors({})
      }
    } catch (error) {
      console.error('Security answer verification error:', error)
      
      let errorMessage = 'Something went wrong. Please try again.'

      if (error.response) {
        const status = error.response.status
        const serverMessage = error.response.data?.error || error.response.data?.message

        switch (status) {
          case 400:
            errorMessage = serverMessage || 'Please provide a valid answer'
            break
          case 401:
            errorMessage = 'Incorrect security answer. Please try again.'
            break
          case 404:
            errorMessage = 'Account not found. Please go back and verify your username/email.'
            break
          case 429:
            errorMessage = 'Too many attempts. Please wait before trying again.'
            break
          default:
            if (serverMessage) {
              errorMessage = serverMessage
            }
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.'
      }
      
      setErrors({ securityAnswer: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const validateStep3 = () => {
    const newErrors = {}
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, number, and special character'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStep3Submit = async (e) => {
    e.preventDefault()
    
    if (!validateStep3()) {
      return
    }

    setIsLoading(true)

    try {
      // Since security answer was already verified in Step 2, we just need to reset the password
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-security-answer`, {
        usernameOrEmail: formData.usernameOrEmail.trim(),
        securityAnswer: formData.securityAnswer.trim(),
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      })

      if (response.data.success) {
        setStep(4)
        setErrors({})
      }
    } catch (error) {
      console.error('Password reset error:', error)
      
      let errorMessage = 'Something went wrong. Please try again.'

      if (error.response) {
        const status = error.response.status
        const serverMessage = error.response.data?.error || error.response.data?.message

        switch (status) {
          case 400:
            errorMessage = serverMessage || 'Invalid password format'
            break
          case 401:
            // This shouldn't happen since we already verified the answer, but just in case
            errorMessage = 'Session expired. Please start over.'
            setStep(1)
            return
          case 429:
            errorMessage = 'Too many attempts. Please wait before trying again.'
            break
          default:
            if (serverMessage) {
              errorMessage = serverMessage
            }
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.'
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }


  const renderStep1 = () => (
    <div className="auth-card">
      <div className="auth-card-header">
        <h1>Reset Your Password</h1>
        <p>Enter your username or email address to continue</p>
      </div>

      <form onSubmit={handleStep1Submit} className="auth-form" noValidate>
        {errors.general && (
          <div className="username-status">
            <span className="status-taken">{errors.general}</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="usernameOrEmail" className="form-label">
            Username or Email Address
          </label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            className={`form-input ${errors.usernameOrEmail ? 'error' : ''}`}
            placeholder="Enter your username or email address"
            disabled={isLoading}
            required
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            aria-label="Enter your username or email address"
          />
          {errors.usernameOrEmail && (
            <div className="username-status">
              <span className="status-taken">{errors.usernameOrEmail}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`auth-submit-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Finding Account...
            </>
          ) : (
            'Continue'
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Remember your password?{' '}
          <Link to="/login" className="auth-link">
            Back to Sign In
          </Link>
        </p>
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  )

  const renderStep2 = () => {
    const securityQuestion = getSecurityQuestionById(userInfo?.securityQuestion)
    
    return (
      <div className="auth-card">
        <div className="auth-card-header">
          <h1>Security Question</h1>
          <p>Please answer your security question to recover your password</p>
        </div>

        <div className="auth-info">
          <p><strong>Account:</strong> {userInfo?.username}</p>
          <p><strong>Question:</strong> {securityQuestion?.question}</p>
        </div>

        <form onSubmit={handleStep2Submit} className="auth-form" noValidate>
          {errors.general && (
            <div className="username-status">
              <span className="status-taken">{errors.general}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="securityAnswer" className="form-label">
              Your Answer
            </label>
            <input
              type="text"
              id="securityAnswer"
              name="securityAnswer"
              value={formData.securityAnswer}
              onChange={handleChange}
              className={`form-input ${errors.securityAnswer ? 'error' : ''}`}
              placeholder="Enter your answer"
              disabled={isLoading}
              required
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
            />
            {errors.securityAnswer && (
              <div className="username-status">
                <span className="status-taken">{errors.securityAnswer}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`auth-submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Verifying Answer...
              </>
            ) : (
              'Verify Answer'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="auth-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Back to Username
            </button>
          </p>
        </div>
      </div>
    )
  }

  const renderStep3 = () => (
    <div className="auth-card">
      <div className="auth-card-header">
        <h1>Set New Password</h1>
        <p>Enter your new password to complete the reset process.</p>
      </div>

      <form onSubmit={handleStep3Submit} className="auth-form" noValidate>
        {errors.general && (
          <div className="username-status">
            <span className="status-taken">{errors.general}</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <div className="password-input-wrapper">
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              placeholder="Enter your new password"
              disabled={isLoading}
              required
              aria-label="Enter your new password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={isLoading}
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showNewPassword}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {showNewPassword ? (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>
          {errors.newPassword && (
            <div className="username-status">
              <span className="status-taken">{errors.newPassword}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="Confirm your new password"
            disabled={isLoading}
            required
            aria-label="Confirm your new password"
          />
          {errors.confirmPassword && (
            <div className="username-status">
              <span className="status-taken">{errors.confirmPassword}</span>
            </div>
          )}
        </div>

        <div className="auth-actions">
          <button
            type="submit"
            className={`auth-submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </div>

        <div className="auth-footer">
          <p>
            <button
              type="button" 
              onClick={() => setStep(2)}
              className="auth-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              disabled={isLoading}
            >
              Back to Security Question
            </button>
          </p>
        </div>
      </form>
    </div>
  )

  const renderStep4 = () => (
    <div className="auth-card">
      <div className="auth-card-header">
        <h1>Password Reset Successful</h1>
        <p>Your password has been successfully reset. You can now login with your new password.</p>
      </div>

      <div className="auth-actions">
        <Link to="/login" className="auth-submit-btn">
          Go to Sign In
        </Link>
      </div>
    </div>
  )

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
          <span className="logo-sara" role="img" aria-label="Sara Learning Platform">Sara</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </main>
    </div>
  )
}

export default ForgotPassword