/**
 * Authentication Context - Sara Learning Platform
 * Enhanced auth context with profile management and session handling
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, getToken, getUser, removeToken, removeUser, setToken, setUser } from '../config/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = getToken()
      const savedUser = getUser()
      
      console.log('AuthContext - Initializing with token:', !!token)
      console.log('AuthContext - Saved user from localStorage:', savedUser)
      
      if (token) {
        try {
          // Validate token with server and get fresh user data
          console.log('🔄 AuthContext - Calling /auth/validate...')
          const response = await auth.validate()
          console.log('🔄 AuthContext - Validate response:', response.data)
          
          if (response.data.success && response.data.data.user) {
            const freshUser = response.data.data.user
            console.log('🔄 AuthContext - Fresh user from server:', freshUser)
            console.log('🔄 AuthContext - Fresh user name:', freshUser.name)
            console.log('🔄 AuthContext - Fresh user name type:', typeof freshUser.name)
            
            // Update both state and localStorage with fresh data
            console.log('🔄 AuthContext - Setting fresh user data:', freshUser)
            setUser(freshUser)
            setUserState(freshUser)
            setIsAuthenticated(true)
          } else {
            console.log('🔄 AuthContext - Token validation failed, logging out')
            // Token is invalid, clear storage
            await logout()
          }
        } catch (validationError) {
          console.error('Token validation failed:', validationError)
          // If validation fails but we have saved user data, use it temporarily
          if (savedUser) {
            console.log('Using saved user data as fallback')
            setUserState(savedUser)
            setIsAuthenticated(true)
          } else {
            await logout()
          }
        }
      } else if (savedUser) {
        // No token but have saved user - this shouldn't happen, clear it
        console.log('No token but have saved user - clearing storage')
        await logout()
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      // Clear invalid session
      await logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (usernameOrEmail, password) => {
    try {
      console.log('🔐 AuthContext - Starting login process for:', usernameOrEmail)
      const response = await auth.login(usernameOrEmail, password)
      console.log('🔐 AuthContext - Login response:', response.data)
      
      if (response.data.success) {
        const { user: userData, token } = response.data.data
        console.log('🔐 AuthContext - User data from login:', userData)
        console.log('🔐 AuthContext - User name from login:', userData.name)
        
        // Store token and user data
        setToken(token)
        setUser(userData)
        setUserState(userData)
        setIsAuthenticated(true)
        
        console.log('🔐 AuthContext - Login successful, user state set to:', userData)
        return { success: true, user: userData }
      } else {
        return { success: false, error: response.data.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed. Please try again.' 
      }
    }
  }

  const signup = async (username, email, name, password, confirmPassword) => {
    try {
      const response = await auth.signup(username, email, name, password, confirmPassword)
      
      if (response.data.success) {
        const { user: userData, token } = response.data.data
        
        // Store token and user data
        setToken(token)
        setUser(userData)
        setUserState(userData)
        setIsAuthenticated(true)
        
        return { success: true, user: userData }
      } else {
        return { success: false, error: response.data.error || 'Signup failed' }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Signup failed. Please try again.' 
      }
    }
  }

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate session
      await auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage and state
      removeToken()
      removeUser()
      setUserState(null)
      setIsAuthenticated(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      const response = await auth.updateProfile(updates)
      console.log('AuthContext - Raw API response:', response)
      console.log('AuthContext - Response status:', response.status)
      console.log('AuthContext - Response data:', response.data)
      
      // Check for successful response
      if (response.status >= 200 && response.status < 300 && response.data) {
        if (response.data.success && response.data.data && response.data.data.user) {
          const updatedUser = response.data.data.user
          console.log('AuthContext - Updated user:', updatedUser)
          
          // Update stored user data
          setUser(updatedUser)
          setUserState(updatedUser)
          
          return { success: true, user: updatedUser }
        } else if (response.data.success && response.data.user) {
          // Alternative response structure
          const updatedUser = response.data.user
          console.log('AuthContext - Updated user (alt structure):', updatedUser)
          
          setUser(updatedUser)
          setUserState(updatedUser)
          
          return { success: true, user: updatedUser }
        }
      }
      
      console.log('AuthContext - Update failed, response:', response.data)
      return { 
        success: false, 
        error: response.data?.error || response.data?.message || 'Profile update failed' 
      }
    } catch (error) {
      console.error('Profile update error:', error)
      console.error('Error status:', error.response?.status)
      console.error('Error response:', error.response?.data)
      
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || 'Profile update failed. Please try again.' 
      }
    }
  }

  const forgotPassword = async (usernameOrEmail) => {
    try {
      const response = await auth.forgotPassword(usernameOrEmail)
      
      if (response.data.success) {
        return { success: true, message: response.data.data.message }
      } else {
        return { success: false, error: response.data.error || 'Password reset failed' }
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Password reset failed. Please try again.' 
      }
    }
  }

  const resetPassword = async (token, password, confirmPassword) => {
    try {
      const response = await auth.resetPassword(token, password, confirmPassword)
      
      if (response.data.success) {
        return { success: true, message: response.data.data.message }
      } else {
        return { success: false, error: response.data.error || 'Password reset failed' }
      }
    } catch (error) {
      console.error('Reset password error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Password reset failed. Please try again.' 
      }
    }
  }

  const refreshUser = async () => {
    try {
      const response = await auth.getProfile()
      
      if (response.data.success) {
        const userData = response.data.data.user
        setUser(userData)
        setUserState(userData)
        return userData
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    }
    return null
  }

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Actions
    login,
    signup,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    refreshUser,
    
    // Utilities
    isLoggedIn: () => isAuthenticated && !!user,
    getUserId: () => user?.id,
    getUsername: () => user?.username,
    getUserEmail: () => user?.email,
    getUserName: () => user?.name
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext