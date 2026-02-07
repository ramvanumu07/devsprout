/**
 * App Component - Sara Learning Platform
 * Main application routing and layout with Sara branding
 * Enhanced with proper authentication-based redirects
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Import Pages
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Learn from './pages/Learn'

// Import Styles
import './index.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

// Separate component to access auth context
const AppRoutes = () => {
  const { loading } = useAuth()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Outfit, sans-serif'
      }}>
        <div>Loading Sara...</div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes with Authentication Guards */}
      <Route path="/" element={<PublicRoute><Welcome /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/learn/:topicId" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
      
      {/* Legacy Route Redirects */}
      <Route path="/learn/:topicId/:subtopicId" element={<LegacyRedirect />} />
      
      {/* Catch All - Smart Redirect */}
      <Route path="*" element={<SmartRedirect />} />
    </Routes>
  )
}

// Public Route Guard - Redirects authenticated users to dashboard
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated) {
    console.log('🔄 PublicRoute: User is authenticated, redirecting to dashboard')
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Protected Route Guard - Redirects unauthenticated users to login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    console.log('🔄 ProtectedRoute: User not authenticated, redirecting to login')
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Smart Redirect - Routes unknown paths based on auth status
const SmartRedirect = () => {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated) {
    console.log('🔄 SmartRedirect: Authenticated user, redirecting to dashboard')
    return <Navigate to="/dashboard" replace />
  } else {
    console.log('🔄 SmartRedirect: Unauthenticated user, redirecting to welcome')
    return <Navigate to="/" replace />
  }
}

// Legacy Route Redirect Component (for backward compatibility)
const LegacyRedirect = () => {
  const { topicId } = useParams()
  return <Navigate to={`/learn/${topicId}`} replace />
}

export default App