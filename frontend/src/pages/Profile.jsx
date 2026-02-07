import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { auth } from '../config/api'
import api from '../config/api'
import './Auth.css'

// Debounce utility
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const Profile = () => {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})
  const [usernameAvailable, setUsernameAvailable] = useState(undefined)
  const [emailAvailable, setEmailAvailable] = useState(undefined)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [originalFormData, setOriginalFormData] = useState({
    name: '',
    username: '',
    email: ''
  })
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        username: user.username || '',
        email: user.email || ''
      }
      console.log('Profile - Setting form data from user:', userData)
      setFormData(prev => ({
        ...prev,
        ...userData
      }))
      setOriginalFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || ''
      })
      console.log('Profile - Original form data set:', userData)
    }
  }, [user])

  // Check for changes
  useEffect(() => {
    const hasProfileChanges = 
      formData.name !== originalFormData.name ||
      formData.username !== originalFormData.username ||
      formData.email !== originalFormData.email
    
    setHasChanges(hasProfileChanges)
  }, [formData, originalFormData])

  // Debounced validation functions
  const checkUsernameAvailability = useCallback(
    debounce(async (username, originalUsername) => {
      console.log('Profile - checkUsernameAvailability called:', { username, originalUsername })
      
      if (username === originalUsername) {
        console.log('Profile - Username same as original, skipping check')
        setUsernameAvailable(undefined)
        setCheckingUsername(false)
        return
      }

      if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        console.log('Profile - Invalid username format, skipping check')
        setUsernameAvailable(undefined)
        setCheckingUsername(false)
        return
      }

      console.log('Profile - Starting username availability check for:', username)
      setCheckingUsername(true)
      try {
        const response = await api.get(`/auth/check-username/${username}`)
        console.log('Profile - Username check response:', response.data)
        setUsernameAvailable(response.data.data.available)
        console.log('Profile - Username available:', response.data.data.available)
      } catch (err) {
        console.error('Profile - Username check error:', err)
        setUsernameAvailable(undefined)
      } finally {
        setCheckingUsername(false)
      }
    }, 500),
    []
  )

  const checkEmailAvailability = useCallback(
    debounce(async (email, originalEmail) => {
      if (email === originalEmail) {
        setEmailAvailable(undefined)
        setCheckingEmail(false)
        return
      }

      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
      if (!emailRegex.test(email)) {
        setEmailAvailable(undefined)
        setCheckingEmail(false)
        return
      }

      setCheckingEmail(true)
      try {
        const response = await api.get(`/auth/check-email/${email}`)
        setEmailAvailable(response.data.data.available)
      } catch (err) {
        console.error('Email check error:', err)
        setEmailAvailable(undefined)
      } finally {
        setCheckingEmail(false)
      }
    }, 500),
    []
  )

  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required'
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters long'
        } else {
          delete newErrors.name
        }
        break

      case 'username':
        if (!value.trim()) {
          newErrors.username = 'Username is required'
        } else if (value.trim().length < 3) {
          newErrors.username = 'Username must be at least 3 characters long'
        } else if (value.length > 20) {
          newErrors.username = 'Username must be 20 characters or less'
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username = 'Username can only contain letters, numbers, and underscores'
        } else {
          delete newErrors.username
        }
        break

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required'
        } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
          newErrors.email = 'Please enter a valid email address'
        } else {
          delete newErrors.email
        }
        break
    }

    setErrors(newErrors)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear global messages
    if (error) setError('')
    if (success) setSuccess('')

    // Validate field
    validateField(name, value)

    // Check availability for username and email
    if (name === 'username' && value.trim()) {
      // Reset availability state when user starts typing
      if (value.trim() !== originalFormData.username) {
        setUsernameAvailable(undefined)
        console.log('Profile - Username changed, will check availability:', value.trim())
      }
      checkUsernameAvailability(value.trim(), originalFormData.username)
    } else if (name === 'email' && value.trim()) {
      // Reset availability state when user starts typing
      if (value.trim() !== originalFormData.email) {
        setEmailAvailable(undefined)
        console.log('Profile - Email changed, will check availability:', value.trim())
      }
      checkEmailAvailability(value.trim(), originalFormData.email)
    }
  }


  const validateForm = () => {
    const { name, username, email } = formData

    // Check for field errors
    if (Object.keys(errors).length > 0) {
      setError('Please fix the errors below')
      return false
    }

    // Check required fields
    if (!name.trim() || !username.trim() || !email.trim()) {
      setError('All fields are required')
      return false
    }

    // Check availability
    if (username !== originalFormData.username && usernameAvailable === false) {
      setError('Username is already taken')
      return false
    }

    if (email !== originalFormData.email && emailAvailable === false) {
      setError('Email is already in use')
      return false
    }

    // Check if still checking availability
    if (checkingUsername || checkingEmail) {
      setError('Please wait for validation to complete')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const updateData = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim()
      }


      const response = await updateProfile(updateData)
      console.log('Profile update response:', response)

      if (response.success) {
        // User context is already updated by updateProfile function
        console.log('Profile update successful, updated user:', response.user)

        setSuccess('Profile updated successfully!')

        // Update form data to reflect the actual saved data
        if (response.user) {
          setFormData({
            name: response.user.name || '',
            username: response.user.username || '',
            email: response.user.email || ''
          })
          
          // Update original data to reflect saved changes
          setOriginalFormData({
            name: response.user.name || '',
            username: response.user.username || '',
            email: response.user.email || ''
          })
        }

        // Reset availability states
        setUsernameAvailable(undefined)
        setEmailAvailable(undefined)
        setErrors({})

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        setError(response.error || 'Failed to update profile')
      }
    } catch (err) {
      console.error('Profile update error:', err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }


  return (
    <div className="auth-container">
      {/* Header */}
      <header className="auth-header">
        <div onClick={handleCancel} className="logo" style={{ cursor: 'pointer' }}>
          <span className="logo-sara">Sara</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Edit Profile</h1>
            <p>Update your account information and preferences</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {error && (
              <div className="username-status">
                <span className="status-taken">{error}</span>
              </div>
            )}
            {success && (
              <div className="username-status">
                <span className="status-available">{success}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
                disabled={loading}
                required
                autoComplete="name"
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`form-input ${errors.username || (usernameAvailable === false) ? 'error' : usernameAvailable === true ? 'success' : ''}`}
                placeholder="Choose a unique username"
                disabled={loading}
                required
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
              {/* Debug conditions */}
              {console.log('Profile - Username status conditions:', {
                noErrors: !errors.username,
                isDifferent: formData.username !== originalFormData.username,
                validFormat: /^[a-zA-Z0-9_]{3,20}$/.test(formData.username),
                checkingUsername,
                usernameAvailable,
                currentUsername: formData.username,
                originalUsername: originalFormData.username
              })}
              
              {!errors.username && formData.username !== originalFormData.username && /^[a-zA-Z0-9_]{3,20}$/.test(formData.username) && (
                <div className="username-status">
                  {checkingUsername ? (
                    <span className="status-checking">Checking availability...</span>
                  ) : usernameAvailable === true ? (
                    <span className="status-available">Username is available</span>
                  ) : usernameAvailable === false ? (
                    <span className="status-taken">Username is already taken</span>
                  ) : null}
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
                onChange={handleInputChange}
                className={`form-input ${errors.email || (emailAvailable === false) ? 'error' : emailAvailable === true ? 'success' : ''}`}
                placeholder="your.email@example.com"
                disabled={loading}
                required
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                inputMode="email"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
              {!errors.email && formData.email !== originalFormData.email && (
                <div className="username-status">
                  {checkingEmail ? (
                    <span className="status-checking">Checking availability...</span>
                  ) : emailAvailable === true ? (
                    <span className="status-available">Email is available</span>
                  ) : emailAvailable === false ? (
                    <span className="status-taken">Email is already in use</span>
                  ) : null}
                </div>
              )}
            </div>


            <div className="auth-actions">
              <button
                type="submit"
                className={`auth-submit-btn ${loading ? 'loading' : ''} ${hasChanges ? 'has-changes' : ''}`}
                disabled={loading || !hasChanges}
              >
                {loading ? 'Updating Profile...' : 'Update Profile'}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              <button
                type="button"
                className="auth-link"
                onClick={handleCancel}
                disabled={loading}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Return to Dashboard
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile