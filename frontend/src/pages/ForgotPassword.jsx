/**
 * Forgot Password Page - Sara Learning Platform
 * Password reset request functionality
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'Username or email is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, {
        usernameOrEmail: formData.usernameOrEmail.trim()
      })

      if (response.data.success) {
        setIsSuccess(true)
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error })
      } else {
        setErrors({ general: 'Failed to send reset email. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
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

        {/* Success Content */}
        <main className="auth-main">
          <div className="auth-card">
            <div className="auth-card-header">
              <h1>Check Your Email</h1>
              <p>We've sent password reset instructions to your email address</p>
            </div>

            <div className="success-message">
              If an account with that username/email exists, a password reset link has been sent
            </div>

            <div className="forgot-password-info">
              <strong>What's next?</strong><br />
              1. Check your email inbox (and spam folder)<br />
              2. Click the reset link in the email<br />
              3. Create a new password<br />
              4. Sign in with your new password
            </div>

            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <Link to="/login" className="auth-link">
                  Back to Sign In
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    )
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
            <h1>Reset Your Password</h1>
            <p>Enter your username or email address and we'll send you a link to reset your password</p>
          </div>

          <div className="forgot-password-info">
            We'll send you a secure link to reset your password. The link will expire in 1 hour for security.
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
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
                placeholder="Enter your username or email"
                disabled={isLoading}
                autoComplete="username"
              />
              {errors.usernameOrEmail && (
                <span className="error-message">{errors.usernameOrEmail}</span>
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
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
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
      </main>
    </div>
  )
}

export default ForgotPassword