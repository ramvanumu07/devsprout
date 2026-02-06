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
      
      if (token && savedUser) {
        // Validate token with server
        const response = await auth.validate()
        
        if (response.data.success) {
          setUserState(response.data.data.user)
          setIsAuthenticated(true)
        } else {
          // Token is invalid, clear storage
          await logout()
        }
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
      const response = await auth.login(usernameOrEmail, password)
      
      if (response.data.success) {
        const { user: userData, token } = response.data.data
        
        // Store token and user data
        setToken(token)
        setUser(userData)
        setUserState(userData)
        setIsAuthenticated(true)
        
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
      
      if (response.data.success) {
        const updatedUser = response.data.data.user
        
        // Update stored user data
        setUser(updatedUser)
        setUserState(updatedUser)
        
        return { success: true, user: updatedUser }
      } else {
        return { success: false, error: response.data.error || 'Profile update failed' }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Profile update failed. Please try again.' 
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