/**
 * App Component - Sara Learning Platform
 * Main application routing and layout with Sara branding
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

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
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/learn/:topicId" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
            
            {/* Legacy Route Redirects */}
            <Route path="/learn/:topicId/:subtopicId" element={<LegacyRedirect />} />
            
            {/* Catch All - Redirect to Welcome */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('sara_token')
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Legacy Route Redirect Component (for backward compatibility)
const LegacyRedirect = () => {
  const { topicId } = useParams()
  return <Navigate to={`/learn/${topicId}`} replace />
}

export default App