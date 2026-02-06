import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { auth } from '../config/api'
import './Auth.css'

const Profile = () => {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPasswordFields, setShowPasswordFields] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        username: user.username || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear messages on input change
    if (error) setError('')
    if (success) setSuccess('')
  }

  const validateForm = () => {
    const { name, username, email, newPassword, confirmPassword } = formData

    if (!name.trim()) {
      setError('Name is required')
      return false
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long')
      return false
    }

    if (!username.trim()) {
      setError('Username is required')
      return false
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long')
      return false
    }

    if (!email.trim()) {
      setError('Email is required')
      return false
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return false
    }

    // Password validation only if changing password
    if (showPasswordFields) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password')
        return false
      }

      if (newPassword && newPassword.length < 6) {
        setError('New password must be at least 6 characters long')
        return false
      }

      if (newPassword !== confirmPassword) {
        setError('New passwords do not match')
        return false
      }
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

      // Add password fields if changing password
      if (showPasswordFields && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const response = await updateProfile(updateData)

      if (response.success) {
        // User context is already updated by updateProfile function
        
        setSuccess('Profile updated successfully!')
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
        setShowPasswordFields(false)

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
      <div className="auth-card">
        <div className="auth-header">
          <h1>Edit Profile</h1>
          <p>Update your account information</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              disabled={loading}
            >
              {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
            </button>
          </div>

          {showPasswordFields && (
            <>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile